/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_handle.c
    Description: handle for CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-04-18
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <gmodule.h>
#include <stdlib.h>
#include <stdio.h>
#include <pthread.h>
#include <limits.h>
#include <errno.h>
#include <gmodule.h>
#include "cjson.h"
#include "clog.h"
#include "cbuffer.h"
#include "csys.h"
#include "cvd_defines.h"
#include "cvd_error.h"
#include "ds_conf.h"
#include "ds_handle.h"
#include "cvd_defines.h"
#include "ds_business.h"
#define DS_HANDLE_PYTHON_PATH "/usr/bin/python3"
#define DS_HANDLE_EXPORT_DISK_SCRIPT_PATH "/opt/bin/cas_export_disk_tool.pyc"

typedef struct ds_clientcontext_t {
    char clientid[CVD_MAX_NAME_LEN];
    int refcount;                       /* for lifecycle management */
    pthread_mutex_t mutex;
    GList *transports;                  /* list of ds_transport */
    virConnectPtr conn;                 /*libvirt connection*/
}ds_clientcontext;
typedef int (*jrpc_func)(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
typedef struct jrpc_method_t {
    const char *name;
    jrpc_func func;
}jrpc_method;

pthread_mutex_t disk_export_mutex = PTHREAD_MUTEX_INITIALIZER;

static int ds_handle_set_loglevel(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
static int ds_handle_set_max_client_num(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
static int ds_handle_connect(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
static int ds_handle_query_storage_pool(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
static int ds_handle_query_disk_info(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
static int ds_handle_set_transport_channel(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
static int ds_handle_release_transport_channel(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error);
void ds_handle_unref_connectcontext(ds_clientcontext *context);

static GList *g_clientcontexts = NULL;
static pthread_mutex_t g_clientcontexts_mutex;
static int g_max_client_num = DS_MAX_CLIENT_NUM;
static pthread_mutex_t g_max_client_num_mutex;
static jrpc_method g_jrpc_methods[] = {
    { .name = CVD_JRPC_SET_LOGLEVEL,                 .func = ds_handle_set_loglevel },
    { .name = CVD_JRPC_SET_MAX_CLIENT_NUM,           .func = ds_handle_set_max_client_num },
    { .name = CVD_JRPC_CONNECT,                      .func = ds_handle_connect },
    { .name = CVD_JRPC_QUERY_STORAGE_POOL,           .func = ds_handle_query_storage_pool },
    { .name = CVD_JRPC_SET_TRANSPORT_CHANNEL,        .func = ds_handle_set_transport_channel },
    { .name = CVD_JRPC_RELEASE_TRANSPORT_CHANNEL,    .func = ds_handle_release_transport_channel },
    { .name = CVD_JRPC_QUERY_DISK_INFO,              .func = ds_handle_query_disk_info },
    { .name = "",                                    .func = NULL },
};

/**
 * Description: Generate error json object.
 *       Input: int code: error code
 *              const char *message: error message
 *      Output: None
 *      Return: error json object, it is the caller's responsibility to delete it.
 */
static cJSON *ds_handle_make_error_json(int code, const char *message)
{
    cJSON *jerror = NULL;
    
    jerror = cJSON_CreateObject();
    if (!jerror) {
        clog_out_of_memory();
        return NULL;
    }

    cJSON_AddNumberToObject(jerror, "code", code);
    if (message) {
        cJSON_AddStringToObject(jerror, "message", message);
    }
    return jerror;
}

/**
 * Description: ds_transport compare func.
 *       Input: const void *a: pointer to data in GList
 *              const void *b: pointer to user data
 *      Output: None
 *      Return: if the first value comes before the second, 0 if they are equal,
 *              or a positive integer if the first value comes after the second.
 */
static int ds_handle_transport_cmp(const void *a, const void *b)
{
    const ds_transport *transport = (const ds_transport *)a;
    const char *path = (const char *)b;
    return strcmp(transport->path, path);
}

/**
 * Description: Handle set-loglevel request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_set_loglevel(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int rc = 0;
    cJSON *jloglevel = NULL;
    char *params = NULL;
    (void)jid;
    (void)data;

    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_set_loglevel called, params: %s", params);

    jloglevel = cJSON_GetObjectItem(jparams, "loglevel");
    if (!jloglevel || jloglevel->type != cJSON_String) {
        clog_err("Invalid params for set-loglevel, params: %s", params);
        rc = CVD_EC_JRPC_INVALID_PARAMS;
        *error = ds_handle_make_error_json(rc, "Invalid params. Invalid method parameter(s).");
        goto exit;
    }
    
    clog_set_level2(jloglevel->valuestring);
    *result = cJSON_CreateObject();
exit:
    free(params);
    return rc;
}

/**
 * Description: Handle set-max-client-num request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_set_max_client_num(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int rc = 0;
    cJSON *jnum = NULL;
    char *params = NULL;
    (void)jid;
    (void)data;

    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_set_max_client_num called, params: %s", params);

    jnum = cJSON_GetObjectItem(jparams, "num");
    if (!jnum || jnum->type != cJSON_Number) {
        clog_err("Invalid params for set-max-client-num, params: %s", params);
        rc = CVD_EC_JRPC_INVALID_PARAMS;
        *error = ds_handle_make_error_json(rc, "Invalid params. Invalid method parameter(s).");
        goto exit;
    }
    
    pthread_mutex_lock(&g_max_client_num_mutex);
    g_max_client_num = jnum->valueint;
    pthread_mutex_unlock(&g_max_client_num_mutex);

    ds_conf_set_max_client_num(jnum->valueint);
    
    *result = cJSON_CreateObject();
exit:
    free(params);
    return rc;
}

/**
 * Description: Handle connect request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_connect(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int res = CVD_EC_FAILURE;
    cJSON *juser = NULL;
    cJSON *jpasswd = NULL;
    char cvmip[DS_IP_LEN] = {0};
    char *params = NULL;

    (void)jid;
    (void)data;

    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_connect called, params: %s", params);
    
    juser = cJSON_GetObjectItem(jparams, "username");
    jpasswd = cJSON_GetObjectItem(jparams, "passwd");
    if ((NULL == juser) || (NULL == jpasswd)) {
        res = CVD_EC_FAILURE;
        /*free context to reject other messages*/
        clog_err("Wrong parameters.");
        goto exit;
    }
    
    res = ds_get_cvmip(cvmip);
    if (CVD_EC_OK != res) {
        clog_err("Get cvm ip error.");
        goto exit;
    }

    if (!ds_connect_userpwd_author(juser->valuestring, jpasswd->valuestring, cvmip)) {
        res = CVD_EC_FAILURE;
        /*free context to reject other messages*/
        clog_err("Login in cvm error.");
        goto exit;
    }

    ds_make_connect_result(result);
    clog_debug("Succeed to connect cvm.");
exit:
    free(params);
    if (CVD_EC_OK != res || NULL == *result) {
        *error = ds_handle_make_error_json(CVD_EC_CONNECT_FAIL, DS_CONNECT_FAIL_STRING);
    }

    return res;
}

/**
 * Description: Handle query-storage-pool request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_query_storage_pool(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int res = CVD_EC_FAILURE;
    ds_clientcontext *context = (ds_clientcontext*)data;
    virStoragePoolPtr virPool = NULL;
    virConnectPtr con = NULL;
    virStorageVolPtr virVol = NULL;
    cJSON *diskpath = NULL;
    char *pool_xml = NULL;
    char *params = NULL;

    (void)jid;

    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_query_storage_pool called, params: %s", params);

    if (context->conn && ds_virtconnpool_is_conn_alive(&context->conn)) {
        con = context->conn;
    } else {
        con = ds_virtconnpool_open_conn();
        if (!con) {
            clog_err("failed to connect libvirt");
            res = CVD_EC_FAILURE;
            goto exit;
        }

        context->conn = con;
    }
    
    diskpath = cJSON_GetObjectItem(jparams, "virtual-disk");
    if (NULL == diskpath) {
        clog_err("Wrong parameters.");
        res = CVD_EC_FAILURE;
        goto exit;
    }

    virVol = virStorageVolLookupByPath(con, diskpath->valuestring);
    if (NULL == virVol) {
        clog_err("virStorageVolLookupByPath failed, path:%s", diskpath->valuestring);
        res = CVD_EC_FAILURE;
        goto exit;
    }
    
    virPool = virStoragePoolLookupByVolume(virVol);
    if (NULL == virPool) {
        clog_err("virStoragePoolLookupByVolume failed, path:%s", diskpath->valuestring);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    pool_xml = virStoragePoolGetXMLDesc(virPool, 0);
    if (NULL == pool_xml) {
        clog_err("virStoragePoolGetXMLDesc failed, path:%s", diskpath->valuestring);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    res = ds_parse_store_pool_by_xml(pool_xml, result);
    if (CVD_EC_OK != res) {
        clog_err("parse store pool error.");
        goto exit;
    }

    clog_debug("Succeed to query storage:%s", diskpath->valuestring);
exit:
    free(params);
    if (virVol) {
        virStorageVolFree(virVol);
    }
    
    if (virPool) {
        virStoragePoolFree(virPool);
    }

    if (CVD_EC_OK != res || NULL == *result) {
        *error = ds_handle_make_error_json(CVD_EC_QUEY_POOL_FAIL, DS_QEURY_POOL_FAIL_STRING);
    }

    free(pool_xml);
    
    return res;
}

/**
 * Description: Handle query-disk-info request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_query_disk_info(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int res = CVD_EC_OK;
    cJSON *diskpath = NULL;
    char cmd[DS_CHAR_LEN] = {0};
    FILE *fp = NULL;
    char buff[DS_CHAR_LEN] = {0};
    char name[DS_CHAR_LEN] = {0};
    char value[DS_CHAR_LEN] = {0};
    char *disk_info = NULL;
    char *params = NULL;

    (void)jid;
    (void)data;

    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_query_disk_info called, params: %s", params);
    
    diskpath = cJSON_GetObjectItem(jparams, "virtual-disk");
    if (NULL == diskpath) {
        clog_err("Wrong parameters.");
        res = CVD_EC_FAILURE;
        goto exit;
    }

    scnprintf(cmd, sizeof(cmd), "qemu-img info --output=json %s", diskpath->valuestring);

    fp = popen(cmd, "r");
    if (NULL == fp) {
        clog_err("failed to popen.");
        res = CVD_EC_FAILURE;
        goto exit;
    }

    disk_info = (char*)malloc(DS_BUFF_LEN);
    if (NULL == disk_info) {
        clog_err("Malloc fail.");
        res = CVD_EC_FAILURE;
        goto exit;
    }

    memset(disk_info, 0, DS_BUFF_LEN);
    
    while (NULL != fgets(buff, sizeof(buff), fp)) {
        sscanf(buff, "%s %s\n", name, value);
        strcat(disk_info, name);
        /* if it only has '{' or '[', do nothing, else when it has no '"', add 
        '"' before and after buff */
        if (('\0' != value[0]) && ('\"' != value[0]) 
            && ('{' != value[0]) && ('[' != value[0])) {
            if (',' == value[strlen(value) - 1]) {
                value[strlen(value) - 1] = '\"';
                value[strlen(value)] = ',';
            } else {
                value[strlen(value)] = '\"';
            }
            strcat(disk_info, "\"");
            strcat(disk_info, value);
        } else {
            strcat(disk_info, value);
        }
        memset(value, 0, sizeof(value));
        memset(name, 0, sizeof(name));
    }

    *result = cJSON_Parse(disk_info);
    if (NULL == *result) {
        clog_err("failed to pasre disk_info:%s.", disk_info);
        res = CVD_EC_FAILURE;
        goto exit;
    }
exit:
    free(params);
    free(disk_info);
    pclose(fp);
    fp = NULL;

    if (CVD_EC_OK != res) {
        *error = ds_handle_make_error_json(CVD_EC_QUEY_DISK_FAIL, DS_QUERY_DISK_INFO_FAIL_STRING);
    }
    
    return res;
}

/**
 * Description: Handle set-transport-channel request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_set_transport_channel(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int rc = 0;
    cJSON *jmode = NULL;
    cJSON *jvirtual_disk = NULL;
    cJSON *jsnapshot_name = NULL;
    cJSON *jflag = NULL;
    char *params = NULL;
    struct cbuffer cmd = CBUFFER_INIT;
    struct cbuffer cmd_result = CBUFFER_INIT;
    int cmd_rc = 0;
    ds_clientcontext *context = (ds_clientcontext *)data;
    ds_transport *transport = NULL;
    (void)jid;

    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_set_transport_channel called, params: %s", params);
    
    jmode = cJSON_GetObjectItem(jparams, "mode");
    jvirtual_disk = cJSON_GetObjectItem(jparams, "virtual-disk");
    jsnapshot_name = cJSON_GetObjectItem(jparams, "snapshot-name");
    jflag = cJSON_GetObjectItem(jparams, "flag");
    if (!jmode || jmode->type != cJSON_Number ||
        !jvirtual_disk || jvirtual_disk->type != cJSON_String ||
        !jflag || jflag->type != cJSON_Number) {
        clog_err("Invalid params for set-transport-channel, params: %s", params);
        rc = CVD_EC_JRPC_INVALID_PARAMS;
        *error = ds_handle_make_error_json(rc, "Invalid params. Invalid method parameter(s).");
        goto exit;
    }

    transport = (ds_transport *)calloc(1, sizeof(ds_transport));
    if (!transport) {
        clog_out_of_memory();
        rc = CVD_EC_INTERNAL_ERROR;
        *error = ds_handle_make_error_json(rc, "Out of memory.");
        goto exit;
    }

    transport->mode = jmode->valueint;
    snprintf(transport->path, sizeof(transport->path), "%s", jvirtual_disk->valuestring);
    transport->flag = jflag->valueint;

    if (jsnapshot_name && (jsnapshot_name->type == cJSON_String) && (0 != strlen(jsnapshot_name->valuestring))) {
        snprintf(transport->snap, sizeof(transport->snap), "%s", jsnapshot_name->valuestring);
        if (transport->flag & CVD_TRANSPORT_FLAG_RD) {
            cbuf_sprintf(&cmd, "%s %s export %s -s %s --read-only", 
                         DS_HANDLE_PYTHON_PATH, DS_HANDLE_EXPORT_DISK_SCRIPT_PATH, 
                         jvirtual_disk->valuestring, jsnapshot_name->valuestring);
        } else {
            cbuf_sprintf(&cmd, "%s %s export %s -s %s", 
                         DS_HANDLE_PYTHON_PATH, DS_HANDLE_EXPORT_DISK_SCRIPT_PATH, 
                         jvirtual_disk->valuestring, jsnapshot_name->valuestring);
        }
    } else {
        if (transport->flag & CVD_TRANSPORT_FLAG_RD) {
            cbuf_sprintf(&cmd, "%s %s export %s --read-only", 
                         DS_HANDLE_PYTHON_PATH, DS_HANDLE_EXPORT_DISK_SCRIPT_PATH, 
                         jvirtual_disk->valuestring);
        } else {
            cbuf_sprintf(&cmd, "%s %s export %s", 
                         DS_HANDLE_PYTHON_PATH, DS_HANDLE_EXPORT_DISK_SCRIPT_PATH, 
                         jvirtual_disk->valuestring);
        }
    }

    pthread_mutex_lock(&disk_export_mutex);
    cmd_rc = csys_execute_cmd(cbuf_content(&cmd), &cmd_result);
    pthread_mutex_unlock(&disk_export_mutex);
    clog_debug("csys_execute_cmd cmd: %s, return code: %d, errno: %d, result: %s", 
               cbuf_content(&cmd), cmd_rc, errno, cbuf_content(&cmd_result));
    if (0 != cmd_rc) {
        clog_err("csys_execute_cmd failed, cmd: %s, return code: %d, errno: %d, result: %s", 
                 cbuf_content(&cmd), cmd_rc, errno, cbuf_content(&cmd_result));
        rc = CVD_EC_EXPORT_DISK;
        *error = ds_handle_make_error_json(rc, "Export disk failed.");
        free(transport);
        goto exit;
    }

    transport->port = atoi(cbuf_content(&cmd_result));
    pthread_mutex_lock(&context->mutex);
    context->transports = g_list_prepend(context->transports, transport);
    pthread_mutex_unlock(&context->mutex);

    /* save transport to config file */
    ds_conf_add_transport(transport);
    
    *result = cJSON_CreateObject();
    cJSON_AddNumberToObject(*result, "port", transport->port);
    
exit:
    cbuf_free(&cmd);
    cbuf_free(&cmd_result);
    free(params);
    return rc;
}

/**
 * Description: Do release-transport-channel
 *       Input: ds_transport *transport
 *      Output: None
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_do_release_transport_channel(ds_transport *transport)
{
    int rc = 0;
    struct cbuffer cmd = CBUFFER_INIT;
    struct cbuffer cmd_result = CBUFFER_INIT;
    
    cbuf_sprintf(&cmd, "%s %s unexport %s -p %d", 
                 DS_HANDLE_PYTHON_PATH, DS_HANDLE_EXPORT_DISK_SCRIPT_PATH, 
                 transport->path, transport->port);
    rc = csys_execute_cmd(cbuf_content(&cmd), &cmd_result);
    clog_debug("csys_execute_cmd cmd: %s, return code: %d, errno: %d, result: %s", 
               cbuf_content(&cmd), rc, errno, cbuf_content(&cmd_result));
    if (0 != rc) {
        clog_err("csys_execute_cmd failed, cmd: %s, return code: %d, errno: %d, result: %s", 
                 cbuf_content(&cmd), rc, errno, cbuf_content(&cmd_result));
        rc = CVD_EC_UNEXPORT_DISK;
    } else {
        /* del transport from config file */
        ds_conf_del_transport(transport);
    }

    cbuf_free(&cmd);
    cbuf_free(&cmd_result);
    return rc;
}

/**
 * Description: Handle release-transport-channel request
 *       Input: cJSON *jparams: jrpc params
 *              cJSON *jid: jrpc id
 *              void *data: pointer to ds_clientcontext
 *      Output: cJSON **result: jrpc result, if no error hanppened
 *              cJSON **error: jrpc error, if error hanppened
 *      Return: 0 if success, otherwise error code
 */
static int ds_handle_release_transport_channel(cJSON *jparams, cJSON *jid, void *data, cJSON **result, cJSON **error)
{
    int rc = 0;
    cJSON *jvirtual_disk = NULL;
    cJSON *jsnapshot_name = NULL;
    cJSON *jport = NULL;
    char *params = NULL;
    ds_clientcontext *context = (ds_clientcontext *)data;
    ds_transport transport;
    GList *l = NULL;
    (void)jid;

    memset(&transport, 0, sizeof(ds_transport));
    params = cJSON_PrintUnformatted(jparams);
    clog_debug("ds_handle_release_transport_channel called, params: %s", params);
    
    jvirtual_disk = cJSON_GetObjectItem(jparams, "virtual-disk");
    jsnapshot_name = cJSON_GetObjectItem(jparams, "snapshot-name");
    jport = cJSON_GetObjectItem(jparams, "port");
    if (!jvirtual_disk || jvirtual_disk->type != cJSON_String ||
        !jport || jport->type != cJSON_Number) {
        clog_err("Invalid params for release-transport-channel, params: %s", params);
        rc = CVD_EC_JRPC_INVALID_PARAMS;
        *error = ds_handle_make_error_json(rc, "Invalid params. Invalid method parameter(s).");
        goto exit;
    }

    snprintf(transport.path, sizeof(transport.path), "%s", jvirtual_disk->valuestring);
    if (jsnapshot_name && jsnapshot_name->type == cJSON_String) {
        snprintf(transport.snap, sizeof(transport.snap), "%s", jsnapshot_name->valuestring);
    }
    transport.port = jport->valueint;
    
    rc = ds_handle_do_release_transport_channel(&transport);
    if (0 != rc) {
        *error = ds_handle_make_error_json(rc, "Unexport disk failed.");
        /* 
         * if release transport failed, do not remove ds_transport from context->transports,
         * so that it may be released when context is destroyed.
         */
        goto exit;
    }
    
    pthread_mutex_lock(&context->mutex);
    l = g_list_find_custom(context->transports, jvirtual_disk->valuestring, ds_handle_transport_cmp);
    if (!l) {
        clog_warn("cannot find transport, virtual disk: %s", jvirtual_disk->valuestring);
    } else {
        free(l->data);
        context->transports = g_list_delete_link(context->transports, l);
    }
    pthread_mutex_unlock(&context->mutex);

    *result = cJSON_CreateObject();
    
exit:
    free(params);
    return rc;
}

/**
 * Description: Free ds_transport
 *       Input: void *t: pointer to ds_transport
 *      Output: None
 *      Return: None
 */
static void ds_handle_free_transport(void *t)
{
    ds_transport *transport = (ds_transport *)t;
    ds_handle_do_release_transport_channel(transport);
    free(transport);
}

/**
 * Description: Free ds_clientcontext
 *       Input: ds_clientcontext *context
 *      Output: None
 *      Return: None
 */
static void ds_handle_do_free_clientcontext(ds_clientcontext **context)
{
    ds_clientcontext *the_context = *context;
    if (the_context) {
        pthread_mutex_destroy(&the_context->mutex);
        g_list_free_full(the_context->transports, ds_handle_free_transport);
        ds_virtconnpool_close_conn(&the_context->conn);
        free(the_context);
        *context = NULL;
    }
}

/**
 * Description: Unref ds_clientcontext
 *       Input: ds_clientcontext *context
 *      Output: None
 *      Return: None
 */
static void ds_handle_unref_clientcontext(ds_clientcontext *context)
{
    int refcount = 0;
    if (context) {
        refcount = cvd_atomic_dec(&context->refcount);
        clog_debug("ds_handle_unref_clientcontext refcount for %s is %d", context->clientid, refcount);
        if (0 == refcount) {
            ds_handle_do_free_clientcontext(&context);
        }
    }
}

/**
 * Description: Unref connect ds_clientcontext
 *       Input: ds_clientcontext *context
 *      Output: None
 *      Return: None
 */
void ds_handle_unref_connectcontext(ds_clientcontext *context)
{
    ds_handle_unref_clientcontext(context);
}

/**
 * Description: Ref ds_clientcontext
 *       Input: ds_clientcontext *context
 *      Output: None
 *      Return: None
 */
static void ds_handle_ref_clientcontext(ds_clientcontext *context)
{
    int refcount = 0;
    if (context) {
        refcount = cvd_atomic_inc(&context->refcount);
        clog_debug("ds_handle_ref_clientcontext refcount for %s is %d", context->clientid, refcount);
    }
}

/**
 * Description: Unref ds_clientcontext
 *       Input: ds_clientcontext *context
 *      Output: None
 *      Return: None
 */
static void ds_handle_put_clientcontext(ds_clientcontext *context)
{
    ds_handle_unref_clientcontext(context);
}

/**
 * Description: Client context compare func.
 *       Input: const void *a: pointer to data in GList
 *              const void *b: pointer to user data
 *      Output: None
 *      Return: if the first value comes before the second, 0 if they are equal,
 *              or a positive integer if the first value comes after the second.
 */
static int ds_handle_clientcontext_cmp(const void *a, const void *b)
{
    const ds_clientcontext *context = (const ds_clientcontext *)a;
    const char *clientid = (const char *)b;
    return strcmp(context->clientid, clientid);
}

/**
 * Description: Free ds_clientcontext
 *       Input: void *context
 *      Output: None
 *      Return: None
 */
static void ds_handle_free_clientcontext(void *context)
{
    ds_handle_unref_clientcontext((ds_clientcontext *)context);
}

/**
 * Description: Ds handle module init
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_handle_init(void)
{
    GList *transports = NULL;
    pthread_mutex_init(&g_clientcontexts_mutex, NULL);
    pthread_mutex_init(&g_max_client_num_mutex, NULL);

    g_max_client_num = ds_conf_get_max_client_num();
    
    /* release transport channel when cvd-ds daemon restart */
    transports = ds_conf_get_transports();
    g_list_free_full(transports, ds_handle_free_transport);
    ds_conf_clear_transports();
}

/**
 * Description: Ds handle module deinit
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_handle_deinit(void)
{
    pthread_mutex_destroy(&g_clientcontexts_mutex);
    pthread_mutex_destroy(&g_max_client_num_mutex);
    g_list_free_full(g_clientcontexts, ds_handle_free_clientcontext);
    g_clientcontexts = NULL;
}

/**
 * Description: Handle error
 *       Input: cJSON *jid: json-rpc id
 *              int code: error code
 *              char *message: error message
 *      Output: char **result: json-rpc response string
 *      Return: None
 */
static void ds_handle_error(cJSON *jid, int code, char *message, char **result)
{
    cJSON *jroot = NULL;
    cJSON *jerror = NULL;
    cJSON *jid_copy = NULL;
    
    jroot = cJSON_CreateObject();
    if (!jroot) {
        clog_out_of_memory();
        goto exit;
    }

    jerror = ds_handle_make_error_json(code, message);
    if (!jerror) {
        goto exit;
    }
    cJSON_AddItemToObject(jroot, "error", jerror);

    if (jid && (jid->type == cJSON_String || jid->type == cJSON_Number)) {
        jid_copy = cJSON_Duplicate(jid, 1);
        if (!jid_copy) {
            clog_out_of_memory();
            goto exit;
        }
        cJSON_AddItemToObject(jroot, "id", jid_copy);
    } else {
        cJSON_AddNullToObject(jroot, "id");
    }
    cJSON_AddStringToObject(jroot, "jsonrpc", "2.0");

    /* result string will be freed by ds_server */
    *result = cJSON_PrintUnformatted(jroot);
    clog_debug("ds_handle_error result: %s", *result);
exit:
    cJSON_Delete(jroot);
}

/**
 * Description: Handle result
 *       Input: cJSON *jid: json-rpc id
 *              cJSON *jresult: handle result
 *      Output: char **result: json-rpc response string
 *      Return: None
 */
static void ds_handle_result(cJSON *jid, cJSON *jresult, char **result)
{
    cJSON *jroot = NULL;
    cJSON *jid_copy = NULL;
    cJSON *jresult_copy = NULL;

    jroot = cJSON_CreateObject();
    if (!jroot) {
        clog_out_of_memory();
        goto exit;
    }
    cJSON_AddStringToObject(jroot, "jsonrpc", "2.0");

    jid_copy = cJSON_Duplicate(jid, 1);
    if (!jid_copy) {
        clog_out_of_memory();
        goto exit;
    }
    cJSON_AddItemToObject(jroot, "id", jid_copy);

    jresult_copy = cJSON_Duplicate(jresult, 1);
    if (!jresult_copy) {
        clog_out_of_memory();
        goto exit;
    }
    cJSON_AddItemToObject(jroot, "result", jresult_copy);

    /* result string will be freed by the server */
    *result = cJSON_PrintUnformatted(jroot);
    clog_debug("ds_handle_result result: %s", *result);
exit:
    cJSON_Delete(jroot);
}

/**
 * Description: Create ds_clientcontext
 *       Input: const char *clientid
 *      Output: None
 *      Return: pointer to ds_clientcontext
 */
static ds_clientcontext *ds_handle_create_clientcontext(const char *clientid)
{
    ds_clientcontext *context = NULL;
    context = (ds_clientcontext *)calloc(1, sizeof(ds_clientcontext));
    if (!context) {
        clog_out_of_memory();
        return NULL;
    }

    /* refcount init to 0 */
    context->refcount = 0;
    snprintf(context->clientid, sizeof(context->clientid), "%s", clientid);
    pthread_mutex_init(&context->mutex, NULL);
    
    return context;
}

/**
 * Description: Get ds_clientcontext, create it if not exist
 *       Input: const char *clientid
 *              cJSON *jid: jrpc id json
 *      Output: char **result: handle result
 *      Return: pointer to ds_clientcontext
 */
static ds_clientcontext *ds_handle_get_or_create_clientcontext(const char *clientid, cJSON *jid, char **result)
{
    int max_client_num = 0;
    unsigned int clientcontext_num = 0; 
    ds_clientcontext *context = NULL;
    GList *l = NULL;
    
    pthread_mutex_lock(&g_max_client_num_mutex);
    max_client_num = g_max_client_num;
    pthread_mutex_unlock(&g_max_client_num_mutex);
    
    pthread_mutex_lock(&g_clientcontexts_mutex);
    l = g_list_find_custom(g_clientcontexts, clientid, ds_handle_clientcontext_cmp);
    if (l) {
        context = (ds_clientcontext *)(l->data);
    } else {
        clientcontext_num = g_list_length(g_clientcontexts);
        if ((int)clientcontext_num >= max_client_num) {
            clog_warn("client num reached threashorld, client id: %s, clientcontext number: %d, max client number: %d", 
                      clientid, clientcontext_num, max_client_num);
            ds_handle_error(jid, CVD_EC_OVER_MAX_CONNECTION, "Over max connection.", result);
            goto exit;
        }
        clog_info("ds_clientcontext not exist, going to create it, clientid: %s", clientid);
        context = ds_handle_create_clientcontext(clientid);
        if (context) {
            g_clientcontexts = g_list_prepend(g_clientcontexts, context);
            /* g_clientcontexts holds one reference */
            ds_handle_ref_clientcontext(context);
            clog_info("ds_clientcontext created, clientid: %s", clientid);
        } else {
            clog_err("create clientcontext failed, clientid: %s", clientid);
            ds_handle_error(jid, CVD_EC_OUT_OF_MEMORY, "Out of memory.", result);
        }
    }
exit:
    /* the return holds one reference */
    ds_handle_ref_clientcontext(context);
    pthread_mutex_unlock(&g_clientcontexts_mutex);
    return context;
}

/**
 * Description: Handle client msg
 *       Input: char *clientid: client id
 *              char *msg: client message
 *      Output: char **result: handle result
 *      Return: Not used
 */
int ds_handle_msg(char *clientid, char *msg, char **result)
{
    cJSON *jroot = NULL;
    cJSON *jversion = NULL;
    cJSON *jmethod = NULL;
    cJSON *jparams = NULL;
    cJSON *jid = NULL;
    ds_clientcontext *context = NULL;
    int i = 0;
    bool found = false;
    int rc = 0;
    cJSON *jresult = NULL;
    cJSON *jerror = NULL;
    cJSON *jerror_message = NULL;

    jroot = cJSON_Parse(msg);
    if (!jroot) {
        clog_err("Json parse error, clientid: %s, msg: %s", clientid, msg);
        ds_handle_error(NULL, CVD_EC_JRPC_PARSE_ERROR, 
                        "Parse error. Invalid JSON was received by the server.", result);
        goto exit;
    }

    jversion = cJSON_GetObjectItem(jroot, "jsonrpc");
    jmethod = cJSON_GetObjectItem(jroot, "method");
    jparams = cJSON_GetObjectItem(jroot, "params");
    jid = cJSON_GetObjectItem(jroot, "id");
    if (!jversion || jversion->type != cJSON_String || 
        !jmethod || jmethod->type != cJSON_String || 
        !jid || (jid->type != cJSON_String && jid->type != cJSON_Number)) {
        clog_err("Invalid request, clientid: %s, msg: %s", clientid, msg);
        ds_handle_error(jid, CVD_EC_JRPC_INVALID_REQUEST, 
                        "Invalid Request. The JSON sent is not a valid Request object.", result);
        goto exit;
    }

    for (i = 0; g_jrpc_methods[i].name[0] != 0; ++i) {
        if (0 == strcmp(g_jrpc_methods[i].name, jmethod->valuestring)) {
            found = true;
            break;
        }
    }
    if (!found) {
        clog_err("Method not found, clientid: %s, msg: %s", clientid, msg);
        ds_handle_error(jid, CVD_EC_JRPC_METHOD_NOT_FOUND, "Method not found.", result);
        goto exit;
    }
    
    context = ds_handle_get_or_create_clientcontext(clientid, jid, result);
    if (!context) {
        clog_err("ds_handle_get_or_create_clientcontext failed, clientid: %s, msg: %s", 
                 clientid, msg);
        goto exit;
    }

    rc = g_jrpc_methods[i].func(jparams, jid, (void *)context, &jresult, &jerror);
    if (0 != rc) {
        jerror_message = cJSON_GetObjectItem(jerror, "message");
        ds_handle_error(jid, rc, jerror_message->valuestring, result);
        clog_err("jrpc error, clientid: %s, msg: %s, error_code: %d, error_message: %s", 
                 clientid, msg, rc, jerror_message->valuestring);
    } else {
        ds_handle_result(jid, jresult, result);
    }

exit:
    cJSON_Delete(jroot);
    cJSON_Delete(jerror);
    cJSON_Delete(jresult);
    ds_handle_put_clientcontext(context);
    return 0;
}

/**
 * Description: Handle client disconnect event
 *       Input: const char *clientid
 *      Output: None
 *      Return: Not used
 */
int ds_handle_peer_disconnect(const char *clientid)
{
    GList *l = NULL;
    clog_info("clientid %s disconnected", clientid);
    pthread_mutex_lock(&g_clientcontexts_mutex);
    l = g_list_find_custom(g_clientcontexts, clientid, ds_handle_clientcontext_cmp);
    if (!l) {
        clog_warn("cannot find client context, clientid: %s", clientid);
    } else {
        ds_handle_free_clientcontext(l->data);
        g_clientcontexts = g_list_delete_link(g_clientcontexts, l);
    }
    pthread_mutex_unlock(&g_clientcontexts_mutex);
    return 0;
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
