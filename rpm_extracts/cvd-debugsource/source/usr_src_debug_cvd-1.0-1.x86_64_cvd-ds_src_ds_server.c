/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_server.c
    Description: server for CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-04-18
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <pthread.h>
#include <gmodule.h>
#include <sys/prctl.h>
#include <czmq.h>
#include "clog.h"
#include "cvd_defines.h"
#include "csys.h"
#include "ds_server.h"

#define DS_SERVER_MAX_ENDPOINT_LEN 64
#define DS_SERVER_WORKER_NUMBER 4
#define DS_SERVER_SNDTIMEO 3000         /* Maximum time before a send operation returns with EAGAIN */
#define DS_SERVER_PEER_TIMEOUT 10000    /* Timeout in milliseconds */
#define DS_SERVER_TIMER_IVL 3000        /* Timer interval in milliseconds */
#define DS_SERVER_PEER_TIMEOUT_MSG "$TIMEOUT"
#define DS_SERVER_PEER_CLOSING_MSG "$CLOSING"
#define DS_SERVER_PAIR_TERMINATE_MSG "$TERM"
#define DS_SERVER_PAIR_ENDPOINT "inproc://pair.h3c"

enum ds_server_event_type {
    DS_SERVER_ROUTER_EVENT = 0,
    DS_SERVER_ACTOR_EVENT = 1,
};

typedef struct ds_server_peer_t {
    char clientid[CVD_MAX_NAME_LEN];            /* clientid */
    int64_t last_msg_time;                      /* last message arrive time */
}ds_server_peer;

typedef struct ds_server_context_t {
    ds_server_msg_handler msg_handler;              /* msg msg_handler */
    ds_server_disconnect_handler disconnect_handler;/* disconnect handler */
    pthread_t tid;                                  /* broker thread */
    uint16_t port;                                  /* listen port */
    int schedule_index;                             /* schedule index for actor */
    zsock_t *router;                                /* router sock */
    zactor_t *monitor;                              /* actor to monitor router event */
    zsock_t *pair;                                  /* receive terminate message */
    GList *peers;                                   /* list of ds_server_peer */
    zactor_t *actors[DS_SERVER_WORKER_NUMBER];      /* acotrs to handle msg from client */
}ds_server_context;

static ds_server_context g_ds_server_context = {NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, {NULL}};

/**
 * Description: Free three strings.
 *       Input: char *first: first string
 *              char *second: second string
 *              char *third: third string
 *      Output: None
 *      Return: None
 */
static void ds_server_free_three_strings(char *first, char *second, char *third)
{
    free(first);
    free(second);
    free(third);
}

/**
 * Description: The in pair event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the pair sock pointer
 *              void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int ds_server_pair_event(zloop_t *loop, zsock_t *reader, void *arg)
{
    int i = 0;
    char *str = NULL;
    (void)loop;
    ds_server_context *context = (ds_server_context *)arg;
    
    str = zstr_recv(reader);
    if (!str) {
        clog_warn("pair received empty msg");
        return -1;
    }
    clog_debug("pair received msg: %s", str);

    if (0 == strcmp(str, DS_SERVER_PAIR_TERMINATE_MSG)) {
        clog_info("pair received terminate msg");
        zstr_free(&str);
        /* inform monitor thread to quit */
        zactor_destroy(&context->monitor);
        /* inform actor threads to quit */
        for (i = 0; i < DS_SERVER_WORKER_NUMBER; ++i) {
            zactor_destroy(&context->actors[i]);
        }
        return -1;
    }

    zstr_free(&str);
    return 0;
}


/**
 * Description: The actor func. Each actor func is called in a isolated thread.
 *       Input: zsock_t *zpipe: pipe the communicate with the other side
 *              void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: None
 */
static void ds_server_actor(zsock_t *zpipe, void *arg)
{
    ds_server_context *context = (ds_server_context *)arg;
    char *result = NULL;
    zmsg_t *msg = NULL;
    zframe_t *fclientid = NULL;
    zframe_t *frealclientid = NULL;
    zframe_t *fstr = NULL;
    char *clientid = NULL;
    char *realclientid = NULL;
    char *str = NULL;

    prctl(PR_SET_NAME, (unsigned long)"cvd_ds_actor");
    
    /* inform the zactor_new() func that zactor initialization is ok */
    zsock_signal (zpipe, 0);

    while (!zsys_interrupted) {
        result = NULL;
        fclientid = NULL;
        frealclientid = NULL;
        fstr = NULL;
        clientid = NULL;
        realclientid = NULL;
        str = NULL;
        /* zmsg_recv will block, if the receive is interrupted, it will return NULL */
        msg = zmsg_recv(zpipe);
        if (!msg) {
            clog_warn("actor received empty msg");
            break;
        }

        /* default actor destruct will send "$TERM" */
        if (1 == zmsg_size(msg)) {
            str = zmsg_popstr(msg);
            zmsg_destroy(&msg);
            if (0 == strcmp(str, "$TERM")) {
                clog_info("actor received $TERM");
                free(str);
                break;
            } else {
                clog_debug("actor received msg with one frame: %s", str);
                free(str);
                continue;
            }
        }
        
        fclientid = zmsg_first(msg);
        if (fclientid) {
            clientid = zframe_strdup(fclientid);
        }
        frealclientid = zmsg_next(msg);
        if (frealclientid) {
            realclientid = zframe_strdup(frealclientid);
        }
        fstr = zmsg_last(msg);
        if (fstr) {
            str = zframe_strdup(fstr);
        }
        clog_debug("actor received msg, clientid: %s, realclientid: %s, msg: %s", 
                   clientid, realclientid, str);

        if ((0 == strcmp(str, DS_SERVER_PEER_TIMEOUT_MSG)) || (0 == strcmp(str, DS_SERVER_PEER_CLOSING_MSG))) {
            if (context->disconnect_handler) {
                context->disconnect_handler(clientid);
            }
        } else if (context->msg_handler) {
            /* handle msg from client */
            context->msg_handler(clientid, str, &result);
            if (result) {
                /* msg has to be passed through router to here, so that it can be routed back to client */
                zframe_reset(fstr, result, strlen(result) + 1);
                /* zmsg_send will destroy msg if success */
                if (0 != zmsg_send(&msg, zpipe)) {
                    clog_err("actor send result failed, errno: %d, clientid: %s, realclientid: %s, msg: %s, result: %s", 
                             errno, clientid, realclientid, str, result);
                } else {
                    clog_debug("actor send result success, clientid: %s, realclientid: %s, msg: %s, result: %s", 
                               clientid, realclientid, str, result);
                }
                free(result);
            } else {
                clog_warn("actor handle msg result null, clientid: %s, realclientid: %s, msg: %s", 
                          clientid, realclientid, str);
            }
        }
        ds_server_free_three_strings(clientid, realclientid, str);
        zmsg_destroy(&msg);
    }

    clog_debug("actor exited");
}

/**
 * Description: Peer compare func.
 *       Input: const void *a: pointer to data in GList
 *              const void *b: pointer to user data
 *      Output: None
 *      Return: if the first value comes before the second, 0 if they are equal,
 *              or a positive integer if the first value comes after the second.
 */
static int ds_server_peer_cmp(const void *a, const void *b)
{
    const ds_server_peer *peer = (const ds_server_peer *)a;
    const char *clientid = (const char *)b;
    return strcmp(peer->clientid, clientid);
}

/**
 * Description: Update heartbeat time.
 *       Input: ds_server_context *context
 *              const char *clientid: client id
 *      Output: None
 *      Return: None
 */
static void ds_server_update_heartbeat(ds_server_context *context, const char *clientid)
{
    GList *l = NULL;
    ds_server_peer *peer = NULL;
    int64_t t = zclock_mono();
    
    l = g_list_find_custom(context->peers, clientid, ds_server_peer_cmp);
    if (l) {
        peer = (ds_server_peer *)(l->data);
        peer->last_msg_time = t;
    } else {
        peer = (ds_server_peer *)calloc(1, sizeof(ds_server_peer));
        if (!peer) {
            clog_out_of_memory();
            return;
        }
        context->peers = g_list_prepend(context->peers, peer);
        snprintf(peer->clientid, sizeof(peer->clientid), "%s", clientid);
        peer->last_msg_time = t;
    }
}

/**
 * Description: Send string to actor with clientid in front of it.
 *       Input: ds_server_context *context
 *              const char *clientid: client id
 *              const char *str: string to send
 *      Output: None
 *      Return: None
 */
static void ds_server_send_str_to_actor(ds_server_context *context, const char *clientid, const char *str)
{
    int rc = 0;
    void * sender = NULL;
    zmsg_t *msg = NULL;

    sender = (void *)context->actors[context->schedule_index];
    context->schedule_index = (context->schedule_index + 1) % DS_SERVER_WORKER_NUMBER;
    msg = zmsg_new();
    if (!msg) {
        clog_out_of_memory();
        return;
    }
    
    zmsg_addstr(msg, clientid);
    zmsg_addstr(msg, str);
    /* zmsg_send will destroy msg if success */
    rc = zmsg_send(&msg, sender);
    if (0 != rc) {
        clog_err("send str to actor failed with error code: %d, clientid: %s, str: %s", errno, clientid, str);
        zmsg_destroy(&msg);
    } else {
        clog_debug("send str to actor success, clientid: %s, str: %s", clientid, str);
    }
}

/**
 * Description: Handle peer cloing event.
 *       Input: ds_server_context *context
 *              const char *clientid: client id
 *      Output: None
 *      Return: None
 */
static void ds_server_handle_peer_closing(ds_server_context *context, const char *clientid)
{
    GList *l = NULL;
    
    l = g_list_find_custom(context->peers, clientid, ds_server_peer_cmp);
    if (l) {
        /* Removes the node link_ from the list and frees it. */
        free(l->data);
        context->peers = g_list_delete_link(context->peers, l);
    }

    ds_server_send_str_to_actor(context, clientid, DS_SERVER_PEER_CLOSING_MSG);
}

/**
 * Description: The common event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the router sock pointer
 *              void *arg: pointer to ds_server_context object
 *              int type: ds_server_event_type enum
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int ds_server_common_event(zloop_t *loop, zsock_t *reader, void *arg, int type)
{
    int rc = 0;
    (void)loop;
    ds_server_context *context = (ds_server_context *)arg;
    zmsg_t *msg = NULL;
    zframe_t *fclientid = NULL;
    zframe_t *frealclientid = NULL;
    zframe_t *fstr = NULL;
    char *clientid = NULL;
    char *realclientid = NULL;
    char *str = NULL;
    char *type_str = "unknown";
    void *sender = NULL;

    if (DS_SERVER_ROUTER_EVENT == type) {
        type_str = "router";
    } else if (DS_SERVER_ACTOR_EVENT == type) {
        type_str = "actor";
    }

    /* zmsg_recv will block, if the receive is interrupted, it will return NULL */
    msg = zmsg_recv(reader);
    if (!msg) {
        clog_warn("%s received empty msg", type_str);
        return -1;
    }

    fclientid = zmsg_first(msg);
    if (fclientid) {
        clientid = zframe_strdup(fclientid);
    }
    frealclientid = zmsg_next(msg);
    if (frealclientid) {
        realclientid = zframe_strdup(frealclientid);
    }
    fstr = zmsg_last(msg);
    if (fstr) {
        str = zframe_strdup(fstr);
    }
    if (!clientid || !realclientid || !str) {
        clog_err("Invalid paramenters: clienid: %p, realclientid: %p, str: %p", clientid, realclientid, str);
        ds_server_free_three_strings(clientid, realclientid, str);
        zmsg_destroy(&msg);
        return 0;
    }
    clog_debug("%s received msg, clientid: %s, realclientid: %s, msg: %s", 
               type_str, clientid, realclientid, str);

    if (DS_SERVER_ROUTER_EVENT == type) {
        if (2 == zmsg_size(msg) && (0 == strcmp(str, CVD_CLOSING))) {
            /* received closing msg from client */
            ds_server_handle_peer_closing(context, clientid);
            ds_server_free_three_strings(clientid, realclientid, str);
            zmsg_destroy(&msg);
            return 0;
        }
        sender = (void *)context->actors[context->schedule_index];
        context->schedule_index = (context->schedule_index + 1) % DS_SERVER_WORKER_NUMBER;
        type_str = "actor";
        ds_server_update_heartbeat(context, clientid);
        if (2 == zmsg_size(msg) && (0 == strcmp(str, CVD_HEARTBEAT))) {
            /* heartbeat message has no need to be sent to actor */
            ds_server_free_three_strings(clientid, realclientid, str);
            zmsg_destroy(&msg);
            return 0;
        }
    } else if (DS_SERVER_ACTOR_EVENT == type) {
        sender = (void *)context->router;
        type_str = "router";
    }
    
    /* zmsg_send will destroy msg if success */
    rc = zmsg_send(&msg, sender);
    if (0 != rc) {
        clog_err("send msg using %s failed with error code: %d, clientid: %s, realclientid: %s, msg: %s", 
                 type_str, errno, clientid, realclientid, str);
        zmsg_destroy(&msg);
    } else {
        clog_debug("send msg using %s success, clientid: %s, realclientid: %s, msg: %s", 
                   type_str, clientid, realclientid, str);
    }
    ds_server_free_three_strings(clientid, realclientid, str);
    return 0;
}

/**
 * Description: The actor result event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the actor pipe sock pointer
 *              void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int ds_server_actor_result(zloop_t *loop, zsock_t *reader, void *arg)
{
    return ds_server_common_event(loop, reader, arg, DS_SERVER_ACTOR_EVENT);
}

/**
 * Description: The router event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the router sock pointer
 *              void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int ds_server_router_event(zloop_t *loop, zsock_t *reader, void *arg)
{
    return ds_server_common_event(loop, reader, arg, DS_SERVER_ROUTER_EVENT);
}

/**
 * Description: The monitor event callback. Called in the router thread.
 *       Input: zloop_t *loop: zloop pointer
 *              zsock_t *reader: the monitor sock pointer
 *              void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int ds_server_monitor_event(zloop_t *loop, zsock_t *reader, void *arg)
{
    (void)arg;
    (void)loop;
    zmsg_t *msg = NULL;
    zframe_t *fevent = NULL;
    zframe_t *fvalue = NULL;
    zframe_t *fendpoint = NULL;
    char *event = NULL;
    char *value = NULL;
    char *endpoint = NULL;

    /* zmsg_recv will block, if the receive is interrupted, it will return NULL */
    msg = zmsg_recv(reader);
    if (!msg) {
        clog_warn("monitor received empty msg");
        return -1;
    }
    
    fevent = zmsg_first(msg);
    if (fevent) {
        event = zframe_strdup(fevent);
    }
    fvalue = zmsg_next(msg);
    if (fvalue) {
        value = zframe_strdup(fvalue);
    }
    fendpoint = zmsg_last(msg);
    if (fendpoint) {
        endpoint = zframe_strdup(fendpoint);
    }
    clog_debug("monitor event: %s, value: %s, endpoint: %s", event, value, endpoint);

    free(endpoint);
    free(value);
    free(event);
    zmsg_destroy(&msg);
    return 0;
}

/**
 * Description: Check timeout for each peer. Called in the loop thread.
 *       Input: ds_server_peer *peer
 *              ds_server_context *context
 *      Output: None
 *      Return: Return true if the peer is timeout.
 */
static bool ds_server_check_timeout(ds_server_peer *peer, ds_server_context *context)
{
    int64_t now = zclock_mono();
    
    if (now - peer->last_msg_time > DS_SERVER_PEER_TIMEOUT) {
        clog_warn("peer timeout, clientid: %s, now: %lld, last time: %lld", 
                  peer->clientid, now, peer->last_msg_time);
        ds_server_send_str_to_actor(context, peer->clientid, DS_SERVER_PEER_TIMEOUT_MSG);
        return true;
    }
    return false;
}

/**
 * Description: The server timer event callback. Called in the loop thread.
 *       Input: zloop_t *loop: zloop pointer
 *              int timer_id: timer id
 *              void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: return -1 to end the reactor
 */
static int ds_server_timer_event(zloop_t *loop, int timer_id, void *arg)
{
    ds_server_context *context = (ds_server_context *)arg;
    (void)loop;
    (void)timer_id;
    GList *next = NULL;
    GList *l = context->peers;
    
    while (l != NULL) {
        next = l->next;
        if (ds_server_check_timeout((ds_server_peer *)l->data, context)) {
            free(l->data);
            /* Removes the node link_ from the list and frees it. */
            context->peers = g_list_delete_link(context->peers, l);
        }
        l = next;
    }
    
    return 0;
}

/**
 * Description: The main loop of ds server. It waits for incoming request
 *              and assign it to the worker thread.
 *       Input: void *arg: pointer to ds_server_context object
 *              bool inthread: if called in thread
 *      Output: None
 *      Return: NULL
 */
static void ds_server_do_loop(ds_server_context *context, bool inthread)
{
    char endpoint[DS_SERVER_MAX_ENDPOINT_LEN] = {0};
    sprintf(endpoint, "tcp://*:%u", context->port);
    int i = 0;
    zloop_t *loop = NULL;

    if (inthread) {
        prctl(PR_SET_NAME, (unsigned long)"cvd_ds_server");
    }
    
    loop = zloop_new();
    if (!loop) {
        clog_err("create zloop failed");
        goto exit;
    }

    context->pair = zsock_new(ZMQ_PAIR);
    if (!context->pair) {
        clog_err("create zsock pair failed");
        goto exit;
    }
    if (-1 == zsock_bind(context->pair, DS_SERVER_PAIR_ENDPOINT)) {
        clog_err("zsock_bind pair failed");
        goto exit;
    }
    zloop_reader(loop, context->pair, ds_server_pair_event, (void *)context);
    zloop_reader_set_tolerant(loop, context->pair);

    context->router = zsock_new(ZMQ_ROUTER);
    if (!context->router) {
        clog_err("create zsock router failed");
        goto exit;
    }
    zsock_set_router_mandatory(context->router, 1);
    zsock_set_sndtimeo(context->router, DS_SERVER_SNDTIMEO);

    context->monitor = zactor_new(zmonitor, context->router);
    if (!context->monitor) {
        clog_err("create monitor actor failed");
        goto exit;
    }
    zloop_reader(loop, zsock_resolve(context->monitor), ds_server_monitor_event, (void *)context);
    zloop_reader_set_tolerant(loop, zsock_resolve(context->monitor));
    /* listen all events */
    zstr_sendx (context->monitor, "LISTEN", "ALL", NULL);
    /* start monitoring */
    zstr_sendx (context->monitor, "START", NULL);
    zsock_wait (context->monitor);

    if (-1 == zsock_bind(context->router, "%s", endpoint)) {
        clog_err("bind router to %s failed", endpoint);
        goto exit;
    }
    zloop_reader(loop, context->router, ds_server_router_event, (void *)context);
    zloop_reader_set_tolerant(loop, context->router);

    for (i = 0; i < DS_SERVER_WORKER_NUMBER; ++i) {
        context->actors[i] = zactor_new(ds_server_actor, (void *)context);
        if (!(context->actors[i])) {
            clog_err("create actor %d failed", i);
            goto exit;
        }
        zloop_reader(loop, zsock_resolve(context->actors[i]), ds_server_actor_result, (void *)context);
        zloop_reader_set_tolerant(loop, zsock_resolve(context->actors[i]));
    }

    zloop_timer(loop, DS_SERVER_TIMER_IVL, 0, ds_server_timer_event, (void *)context);
    
    clog_info("ds server started");
    /* zloop_start() will block until cancel request arrived */
    zloop_start(loop);
    clog_info("zloop exited");
    
exit:
    zloop_destroy(&loop);
    zsock_destroy(&context->pair);
    zsock_destroy(&context->router);
    zactor_destroy(&context->monitor);
    for (i = 0; i < DS_SERVER_WORKER_NUMBER; ++i) {
        zactor_destroy(&(context->actors[i]));
    }
    clog_info("ds server thread exited");
}

/**
 * Description: The main thread of ds server. It waits for incoming request
 *              and assign it to the worker thread.
 *       Input: void *arg: pointer to ds_server_context object
 *      Output: None
 *      Return: NULL
 */
static void *ds_server_thread(void * arg)
{
    ds_server_context *context = (ds_server_context *)arg;
    ds_server_do_loop(context, true);
    return NULL;
}

/**
 * Description: Start to serve and listen on the specified port number
 *       Input: uint16_t port: the port number that will be listened on
 *      Output: None
 *      Return: 0 if succeed;
 *              -1 if failed;
 */
int ds_server_start_nowait(uint16_t port)
{
    int rc = 0;
    if (g_ds_server_context.tid) {
        clog_warn("ds server already started");
        return 0;
    }

    g_ds_server_context.port = port;
    rc = pthread_create(&g_ds_server_context.tid, NULL, ds_server_thread, (void *)&g_ds_server_context);
    if (0 != rc) {
        clog_err("start ds server thread failed, error is %d", rc);
        return -1;
    }

    return 0;
}

/**
 * Description: Start to serve and listen on the specified port number, then loop
 *       Input: uint16_t port: the port number that will be listened on
 *      Output: None
 *      Return: None
 */
void ds_server_loop(uint16_t port)
{
    g_ds_server_context.port = port;
    ds_server_do_loop(&g_ds_server_context, false);
}

/**
 * Description: Stop to serve
 *       Input: bool nowait: not to wait for thread stop
 *      Output: None
 *      Return: None
 */
static void ds_server_do_stop(bool nowait)
{
    int rc = 0;
    zsock_t *pair = NULL;
    
    /* set zsys_interrupted and wait for thread exit */
    zsys_interrupted = true;
    pair = zsock_new_pair(DS_SERVER_PAIR_ENDPOINT);
    if (!pair) {
        clog_err("create zsock pair failed");
        return;
    }
    zstr_send(pair, DS_SERVER_PAIR_TERMINATE_MSG);
    zsock_destroy(&pair);
    
    if (g_ds_server_context.tid) {
        rc = pthread_kill(g_ds_server_context.tid, 0);
        if (ESRCH == rc) {
            clog_info("ds server thread not exist");
        } else {
            if (!nowait) {
                pthread_join(g_ds_server_context.tid, NULL);
            }
        }
        g_ds_server_context.tid = 0;
    }
    clog_info("ds server stopped %s", nowait ? "no wait" : "");
}

/**
 * Description: Stop to serve
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_server_stop(void)
{
    ds_server_do_stop(false);
}

/**
 * Description: Stop to serve, but no wait
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_server_stop_nowait(void)
{
    ds_server_do_stop(true);
}

/**
 * Description: Set handler
 *       Input: ds_server_msg_handler msg_handler: msg handler
 *              ds_server_disconnect_handler disconnect_handler: disconnect handler
 *      Output: None
 *      Return: None
 */
void ds_server_set_handler(ds_server_msg_handler msg_handler, ds_server_disconnect_handler disconnect_handler)
{
    g_ds_server_context.msg_handler = msg_handler;
    g_ds_server_context.disconnect_handler = disconnect_handler;
}

/**
 * Description: Init ds server
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_server_init(void)
{
    /* do not set signal handler */
    putenv("ZSYS_SIGHANDLER=false");

    /* init czmq */
    zsys_init();
}

/**
 * Description: Deinit ds server
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_server_deinit(void)
{
    g_list_free_full(g_ds_server_context.peers, free);
    zsys_shutdown();
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
