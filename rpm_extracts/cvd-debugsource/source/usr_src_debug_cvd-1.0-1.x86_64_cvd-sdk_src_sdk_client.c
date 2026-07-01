/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: sdk_client.c
    Description: client for CVD-SDK(CAS Virtual Disk Software Development Kit)
    Date: 2019-04-22
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/

#ifdef  __cplusplus
extern "C" {
#endif

#include <pthread.h>
#include <sys/prctl.h>
#include <czmq.h>
#include "clog.h"
#include "cvd_error.h"
#include "cvd_defines.h"
#include "sdk_client.h"

#define SDK_CLIENT_MAX_IP_LEN 32
#define SDK_CLIENT_MAX_ENDPOINT_LEN 128
#define SDK_CLIENT_REQUEST_TIMEOUT 30000
#define SDK_CLIENT_CONNECT_TIMEOUT 3000    /* Sets how long to wait before timing-out a connect() system call */
#define SDK_CLIENT_SNDTIMEO 3000        /* Maximum time before a send operation returns with EAGAIN */
#define SDK_CLIENT_HEARTBEAT_IVL 3000     /* Time in milliseconds between sending heartbeat PING messages. */
#define SDK_CLIENT_IN_ROUTER_ENDPOINT_TEMPLATE "inproc://%s.inrouter.h3c"
#define SDK_CLIENT_PAIR_ENDPOINT_TEMPLATE "inproc://%s.pair.h3c"
#define SDK_CLIENT_PAIR_TERMINATE_MSG "$TERM"
#define SDK_CLIENT_MAX_UUID_LEN 64
#define SDK_CLIENT_LINGER 1000          /* when disconnect client will send CVD_CLOSING to server */

enum sdk_client_event_type {
    SDK_CLIENT_IN_ROUTER_EVENT = 0,
    SDK_CLIENT_CLIENT_EVENT = 1,
};

typedef struct sdk_client_context_t {
    char server_ip[SDK_CLIENT_MAX_IP_LEN];
    uint16_t port;
    pthread_t tid;
    zsock_t *client;
    zsock_t *in_router;
    char in_router_endpoint[SDK_CLIENT_MAX_ENDPOINT_LEN];
    zsock_t *pair;      /* receive terminate message */
    char pair_endpoint[SDK_CLIENT_MAX_ENDPOINT_LEN];
    uint32_t timeout;   /* request timeout in milliseconds */
    pthread_mutex_t mutex;
    pthread_cond_t cond;
    int connect_rc;     /* sdk_client_connect return code */
}sdk_client_context;

/**
 * Description: The in pair event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the pair sock pointer
 *              void *arg: pointer to sdk_client_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int sdk_client_pair_event(zloop_t *loop, zsock_t *reader, void *arg)
{
    char *str = NULL;
    sdk_client_context *context = (sdk_client_context *)arg;
    (void)loop;
    
    str = zstr_recv(reader);
    if (!str) {
        clog_warn("pair received empty msg");
        return -1;
    }
    clog_debug("pair received msg: %s", str);

    if (0 == strcmp(str, SDK_CLIENT_PAIR_TERMINATE_MSG)) {
        clog_info("pair received terminate msg");
        zstr_free(&str);
        if (0 != zstr_send(context->client, CVD_CLOSING)) {
            clog_err("send closing msg failed with errno: %d", errno);
        }
        return -1;
    }

    zstr_free(&str);
    return 0;
}

/**
 * Description: The common event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the sock pointer
 *              void *arg: pointer to sdk_client_context object
 *              int type: sdk_client_event_type type
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int sdk_client_common_event(zloop_t *loop, zsock_t *reader, void *arg, int type)
{
    int rc = 0;
    sdk_client_context *context = (sdk_client_context *)arg;
    zmsg_t *msg = NULL;
    zframe_t *fid = NULL;
    zframe_t *fstr = NULL;
    char *id = NULL;
    char *str = NULL;
    char *type_str = "unknown";
    zsock_t *sender = NULL;
    (void)loop;

    if (SDK_CLIENT_IN_ROUTER_EVENT == type) {
        type_str = "in router";
    } else if (SDK_CLIENT_CLIENT_EVENT == type) {
        type_str = "client";
    }

    /* zmsg_recv will block, if the receive is interrupted, it will return NULL */
    msg = zmsg_recv(reader);
    if (!msg) {
        clog_warn("%s received empty msg", type_str);
        return -1;
    }
    fid = zmsg_first(msg);
    if (fid) {
        id = zframe_strdup(fid);
    }
    fstr = zmsg_last(msg);
    if (fstr) {
        str = zframe_strdup(fstr);
    }
    clog_debug("%s received msg, id: %s, msg: %s", type_str, id, str);

    if (SDK_CLIENT_IN_ROUTER_EVENT == type) {
        sender = context->client;
        type_str = "client";
    } else if (SDK_CLIENT_CLIENT_EVENT == type) {
        sender = context->in_router;
        type_str = "in router";
    }
    /* zmsg_send will destroy msg if success */
    rc = zmsg_send(&msg, sender);
    if (0 != rc) {
        clog_err("send msg using %s failed with errno: %d, id: %s, msg: %s", errno, type_str, id, str);
        zmsg_destroy(&msg);
    } else {
        clog_debug("send msg using %s success, id: %s, msg: %s", type_str, id, str);
    }

    free(id);
    free(str);
    return 0;
}

/**
 * Description: The in router event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the in router sock pointer
 *              void *arg: pointer to sdk_client_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int sdk_client_in_router_event(zloop_t *loop, zsock_t *reader, void *arg)
{
    return sdk_client_common_event(loop, reader, arg, SDK_CLIENT_IN_ROUTER_EVENT);
}

/**
 * Description: The client event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the client sock pointer
 *              void *arg: pointer to sdk_client_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int sdk_client_client_event(zloop_t *loop, zsock_t *reader, void *arg)
{
    return sdk_client_common_event(loop, reader, arg, SDK_CLIENT_CLIENT_EVENT);
}

/**
 * Description: The client timer event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              int timer_id: timer id
 *              void *arg: pointer to sdk_client_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int sdk_client_timer_event(zloop_t *loop, int timer_id, void *arg)
{
    int rc = 0;
    sdk_client_context *context = (sdk_client_context *)arg;
    zmsg_t *msg = NULL;
    (void)loop;
    (void)timer_id;

    clog_debug("client timer event called");
    msg = zmsg_new();
    if (!msg) {
        clog_out_of_memory();
        return -1;
    }
    zmsg_addstr(msg, CVD_HEARTBEAT);
    /* zmsg_send will destroy msg if success */
    rc = zmsg_send(&msg, context->client);
    if (0 != rc) {
        clog_err("send heartbeat failed with errno: %d", errno);
        zmsg_destroy(&msg);
    } else {
        clog_debug("send heartbeat success");
    }
    return 0;
}

/**
 * Description: Signal connect return code
 *       Input: sdk_client_context *context: pointer to sdk_client_context object
 *              int connect_rc: connect return code
 *      Output: None
 *      Return: None
 */
static void sdk_client_signal_connect(sdk_client_context *context, int connect_rc)
{
    pthread_mutex_lock(&context->mutex);
    context->connect_rc = connect_rc;
    pthread_cond_signal(&context->cond);
    pthread_mutex_unlock(&context->mutex);
}

/**
 * Description: The client thread.
 *       Input: void *arg: pointer to sdk_client_context object
 *      Output: None
 *      Return: None
 */
static void *sdk_client_thread(void * arg)
{
    int rc = 0;
    char endpoint[SDK_CLIENT_MAX_ENDPOINT_LEN] = {0};
    sdk_client_context *context = (sdk_client_context *)arg;
    zloop_t *loop = NULL;
    zuuid_t *uuid = NULL;
    const char *uuid_str = NULL;

    prctl(PR_SET_NAME, (unsigned long)"cvd_sdk_client");
    loop = zloop_new();
    if (!loop) {
        clog_err("create zloop failed");
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }

    uuid = zuuid_new();
    if (!uuid) {
        clog_err("create zuuid failed");
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    uuid_str = zuuid_str(uuid);
    clog_debug("uuid for this client is %s", uuid_str);

    context->pair = zsock_new(ZMQ_PAIR);
    if (!context->pair) {
        clog_err("create zsock pair failed");
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    snprintf(context->pair_endpoint, sizeof(context->pair_endpoint),
             SDK_CLIENT_PAIR_ENDPOINT_TEMPLATE, uuid_str);
    if (-1 == zsock_bind(context->pair, "%s", context->pair_endpoint)) {
        clog_err("zsock_bind pair failed");
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    zloop_reader(loop, context->pair, sdk_client_pair_event, (void *)context);
    zloop_reader_set_tolerant(loop, context->pair);

    context->in_router = zsock_new(ZMQ_ROUTER);
    if (!context->in_router) {
        clog_err("create zsock in router failed");
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    zsock_set_router_mandatory(context->in_router, 1);

    snprintf(context->in_router_endpoint, sizeof(context->in_router_endpoint),
             SDK_CLIENT_IN_ROUTER_ENDPOINT_TEMPLATE, uuid_str);
    if (-1 == zsock_bind(context->in_router, "%s", context->in_router_endpoint)) {
        clog_err("bind in router to %s failed", context->in_router_endpoint);
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    
    zloop_reader(loop, context->in_router, sdk_client_in_router_event, (void *)context);
    zloop_reader_set_tolerant(loop, context->in_router);

    snprintf(endpoint, sizeof(endpoint), "tcp://%s:%u", context->server_ip, context->port);
    context->client = zsock_new(ZMQ_DEALER);
    if (!context->client) {
        clog_err("create zsock dealer failed");
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    zsock_set_linger(context->client, SDK_CLIENT_LINGER);

    rc = zmq_setsockopt(zsock_resolve(context->client), ZMQ_ROUTING_ID, uuid_str, strlen(uuid_str) + 1);
    if (0 != rc) {
        clog_err("zmq_setsockopt fail with error code %d", rc);
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    zsock_set_connect_timeout(context->client, SDK_CLIENT_CONNECT_TIMEOUT);
    zsock_set_sndtimeo(context->client, SDK_CLIENT_SNDTIMEO);

    if (0 != zsock_connect(context->client, "%s", endpoint)) {
        clog_err("connect to %s failed", endpoint);
        sdk_client_signal_connect(context, CVD_EC_INTERNAL_ERROR);
        goto exit;
    }
    zloop_reader(loop, context->client, sdk_client_client_event, (void *)context);
    zloop_reader_set_tolerant(loop, context->client);

    zloop_timer(loop, SDK_CLIENT_HEARTBEAT_IVL, 0, sdk_client_timer_event, (void *)context);

    sdk_client_signal_connect(context, CVD_EC_OK);
    clog_info("sdk client started");
    /* zloop_start() will block until cancel request arrived */
    zloop_start(loop);
    clog_info("zloop exited");
    
exit:
    zloop_destroy(&loop);
    zsock_destroy(&(context->pair));
    zsock_destroy(&(context->in_router));
    zsock_destroy(&(context->client));
    zuuid_destroy(&uuid);
    clog_info("sdk client thread exited");
    return NULL;
}

/**
 * Description: Connect the server. It is the responsibility to disconnect before the next connect.
 *       Input: const char *server_ip: server ip
 *              uint16_t port: server port
 *      Output: void **context: context connected to the server
 *      Return: 0 if success,
 *              error code if fail
 */
int sdk_client_connect(const char *server_ip, uint16_t port, void **context)
{
    int rc = 0;
    sdk_client_context *ctx = NULL;
    
    if (!context) {
        clog_err("Invalid input context pointer");
        return CVD_EC_INVALID_ARGUMENT;
    }

    ctx = (sdk_client_context *)calloc(1, sizeof(sdk_client_context));
    if (!ctx) {
        clog_out_of_memory();
        return CVD_EC_OUT_OF_MEMORY;
    }

    /* init request timeout to SDK_CLIENT_REQUEST_TIMEOUT */
    ctx->timeout = SDK_CLIENT_REQUEST_TIMEOUT;
    ctx->port = port;
    snprintf(ctx->server_ip, sizeof(ctx->server_ip), "%s", server_ip);
    rc = pthread_mutex_init(&ctx->mutex, NULL);
    if (0 != rc) {
        clog_err("pthread_mutex_init failed, error is %d", rc);
        free(ctx);
        return CVD_EC_INTERNAL_ERROR;
    }
    rc = pthread_cond_init(&ctx->cond, NULL);
    if (0 != rc) {
        clog_err("pthread_cond_init failed, error is %d", rc);
        pthread_mutex_destroy(&ctx->mutex);
        free(ctx);
        return CVD_EC_INTERNAL_ERROR;
    }
    ctx->connect_rc = -1;
    rc = pthread_create(&ctx->tid, NULL, sdk_client_thread, (void *)ctx);
    if (0 != rc) {
        clog_err("start sdk client thread failed, error is %d", rc);
        pthread_mutex_destroy(&ctx->mutex);
        pthread_cond_destroy(&ctx->cond);
        free(ctx);
        return CVD_EC_INTERNAL_ERROR;
    }

    pthread_mutex_lock(&ctx->mutex);
    while (ctx->connect_rc == -1) {
        pthread_cond_wait(&ctx->cond, &ctx->mutex);
    }
    pthread_mutex_unlock(&ctx->mutex);

    rc = ctx->connect_rc;
    if (CVD_EC_OK != rc) {
        sdk_client_disconnect((void **)(&ctx));
    } else {
        *context = ctx;
    }
    
    return rc;
}

/**
 * Description: Set context timeout.
 *       Input: void *context: context connected to the server
 *              uint32_t timeout_ms: request timeout in milliseconds
 *      Output: None
 *      Return: None
 */
void sdk_client_set_request_timeout(void *context, uint32_t timeout_ms)
{
    sdk_client_context *ctx = (sdk_client_context *)context;
    if (ctx) {
        ctx->timeout = timeout_ms;
    }
}

/**
 * Description: Disconnect from the server.
 *       Input: void **context: context connected to the server
 *      Output: None
 *      Return: None
 */
void sdk_client_disconnect(void **context)
{
    int rc = 0;
    sdk_client_context *ctx = NULL;
    zsock_t *pair = NULL;
    if (!context) {
        clog_err("Invalid input context pointer");
        return;
    }
    
    ctx = *((sdk_client_context **)context);
    rc = pthread_kill(ctx->tid, 0);
    if (ESRCH == rc) {
        clog_info("sdk client thread not exist");
    } else {
        pair = zsock_new_pair(ctx->pair_endpoint);
        if (!pair) {
            clog_err("create zsock pair failed");
            return;
        }
        zstr_send(pair, SDK_CLIENT_PAIR_TERMINATE_MSG);
        pthread_join(ctx->tid, NULL);
        zsock_destroy(&pair);
    }
    ctx->tid = 0;
    pthread_mutex_destroy(&ctx->mutex);
    pthread_cond_destroy(&ctx->cond);
    free(ctx);
    *context = NULL;
}

/**
 * Description: Send request to server and then wait for server response.
 *       Input: void *context: context connected to the server
 *              const char *str: string to send
 *      Output: char **response: response of the server
 *      Return: 0 if success,
 *              error code if fail
 */
int sdk_client_request(void *context, const char *str, char **response)
{
    int rc = CVD_EC_OK;
    zsock_t *sock = NULL;
    zuuid_t *uuid = NULL;
    const char *uuid_str = NULL;
    sdk_client_context *ctx = (sdk_client_context *)context;
    if (!ctx) {
        clog_err("Invalid input context pointer");
        return CVD_EC_INVALID_ARGUMENT;
    }

    if (!response) {
        clog_err("Invalid response pointer");
        return CVD_EC_INVALID_ARGUMENT;
    }
    
    sock = zsock_new(ZMQ_DEALER);
    if (!sock) {
        clog_err("create dealer zsock failed");
        rc = CVD_EC_INTERNAL_ERROR;
        goto bail;
    }

    uuid = zuuid_new();
    if (!uuid) {
        clog_err("create zuuid failed");
        rc = CVD_EC_INTERNAL_ERROR;
        goto bail;
    }
    uuid_str = zuuid_str(uuid);
    clog_debug("uuid for this request is %s", uuid_str);

    rc = zmq_setsockopt(zsock_resolve(sock), ZMQ_ROUTING_ID, uuid_str, strlen(uuid_str) + 1);
    if (0 != rc) {
        clog_err("zmq_setsockopt fail with error code %d", rc);
        rc = CVD_EC_INTERNAL_ERROR;
        goto bail;
    }
    zsock_set_rcvtimeo(sock, (int)ctx->timeout);

    rc = zsock_connect(sock, "%s", ctx->in_router_endpoint);
    if (0 != rc) {
        clog_err("connect to in router failed");
        rc = CVD_EC_INTERNAL_ERROR;
        goto bail;
    }

    zstr_send(sock, str);
    clog_debug("request %s send msg: %s", uuid_str, str);
    *response = zstr_recv(sock);
    clog_debug("request %s recv msg: %s", uuid_str, *response);
    if (!(*response)) {
        clog_err("request %s recv msg failed with error code: %d", uuid_str, errno);
        rc = (errno == EAGAIN ? CVD_EC_EAGAIN : CVD_EC_INTERNAL_ERROR);
    }

bail:
    zuuid_destroy(&uuid);
    zsock_destroy(&sock);
    return rc;
}

/**
 * Description: Init sdk client module. Not threadsafe.
 *       Input: None
 *      Output: None
 *      Return: None
 */
void sdk_client_init(void)
{
    /* do not set signal handler */
    putenv("ZSYS_SIGHANDLER=false");

    /* init czmq */
    zsys_init();
}

/**
 * Description: Deinit sdk client module.
 *       Input: None
 *      Output: None
 *      Return: None
 */
void sdk_client_deinit(void)
{
    zsys_shutdown();
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
