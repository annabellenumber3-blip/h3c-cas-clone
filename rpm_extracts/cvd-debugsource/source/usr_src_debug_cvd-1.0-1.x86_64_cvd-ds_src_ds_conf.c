/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_conf.c
    Description: config for CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-5-20
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <libconfig.h>
#include "cvd_error.h"
#include "clog.h"
#include "ds_conf.h"

typedef struct ds_conf_t {
    char filename[PATH_MAX];            
    int max_client_num;                 /* max allowed client number */
    config_t cfg;                       /* libconfig config */
    pthread_mutex_t mutex;              
}ds_conf;

static ds_conf g_ds_conf;

#define DS_CONF_TRANSPORTS_STRING   "transports"
#define DS_CONF_MODE_STRING         "mode"
#define DS_CONF_PATH_STRING         "path"
#define DS_CONF_SNAP_STRING         "snap"
#define DS_CONF_FLAG_STRING         "flag"
#define DS_CONF_PORT_STRING         "port"
#define DS_CONF_MAX_CLIENT_NUM_STRING   "max_client_num"

/**
 * Description: Init ds_conf module
 *       Input: const char *filename: config file full path
 *      Output: None
 *      Return: None
 */
void ds_conf_init(const char *filename)
{
    long max_client_num = DS_MAX_CLIENT_NUM;
    snprintf(g_ds_conf.filename, sizeof(g_ds_conf.filename), "%s", filename);
    g_ds_conf.max_client_num = DS_MAX_CLIENT_NUM;
    pthread_mutex_init(&g_ds_conf.mutex, NULL);
    config_init(&g_ds_conf.cfg);
    if(!config_read_file(&g_ds_conf.cfg, filename)) {
        clog_err("read ds config file failed, error file: %s, error line: %d, error text: %s",
                 filename, config_error_line(&g_ds_conf.cfg), config_error_text(&g_ds_conf.cfg));
        return;
    }
    if (config_lookup_int(&g_ds_conf.cfg, DS_CONF_MAX_CLIENT_NUM_STRING, &max_client_num)) {
        clog_info("max allowed client number is: %d", max_client_num);
        g_ds_conf.max_client_num = (int)max_client_num;
    } else {
        clog_err("cannot find max allowed client number config, use default: %d", g_ds_conf.max_client_num);
    }
}

/**
 * Description: Deinit ds_conf module
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_conf_deinit(void)
{
    pthread_mutex_destroy(&g_ds_conf.mutex);
    config_destroy(&g_ds_conf.cfg);
}

/**
 * Description: Add one transport and write the updated transports to config file
 *       Input: ds_transport *transport: pointer to ds_transport
 *      Output: None
 *      Return: 0 if success, otherwise error code
 */
int ds_conf_add_transport(ds_transport *transport)
{
    int rc = 0;
    config_setting_t *croot = NULL;
    config_setting_t *ctransports = NULL;
    config_setting_t *ctransport = NULL;
    config_setting_t *csetting = NULL;
    
    if (!transport) {
        clog_err("invalid input parameter.");
        return CVD_EC_INVALID_ARGUMENT;
    }
    
    pthread_mutex_lock(&g_ds_conf.mutex);
    croot = config_root_setting(&g_ds_conf.cfg);
    ctransports = config_setting_get_member(croot, DS_CONF_TRANSPORTS_STRING);
    if (!ctransports) {
        ctransports = config_setting_add(croot, DS_CONF_TRANSPORTS_STRING, CONFIG_TYPE_LIST);
    }
    ctransport = config_setting_add(ctransports, NULL, CONFIG_TYPE_GROUP);
    
    csetting = config_setting_add(ctransport, DS_CONF_MODE_STRING, CONFIG_TYPE_INT);
    config_setting_set_int(csetting, transport->mode);
    csetting = config_setting_add(ctransport, DS_CONF_PATH_STRING, CONFIG_TYPE_STRING);
    config_setting_set_string(csetting, transport->path);
    if (transport->snap[0] != '\0') {
        csetting = config_setting_add(ctransport, DS_CONF_SNAP_STRING, CONFIG_TYPE_STRING);
        config_setting_set_string(csetting, transport->snap);
    } 
    csetting = config_setting_add(ctransport, DS_CONF_FLAG_STRING, CONFIG_TYPE_INT);
    config_setting_set_int(csetting, transport->flag);
    csetting = config_setting_add(ctransport, DS_CONF_PORT_STRING, CONFIG_TYPE_INT);
    config_setting_set_int(csetting, transport->port);

    if (!config_write_file(&g_ds_conf.cfg, g_ds_conf.filename)) {
        clog_err("write config file failed when add transport, filename: %s", g_ds_conf.filename);
        rc = CVD_EC_IO;
    } else {
        clog_info("write config success when add transport");
    }
    pthread_mutex_unlock(&g_ds_conf.mutex);
    return rc;
}

/**
 * Description: Del one transport and write the updated transports to config file
 *       Input: ds_transport *transport: pointer to ds_transport
 *      Output: None
 *      Return: 0 if success, otherwise error code
 */
int ds_conf_del_transport(ds_transport *transport)
{
    int rc = 0;
    config_setting_t *croot = NULL;
    config_setting_t *ctransports = NULL;
    config_setting_t *ctransport = NULL;
    int count = 0;
    int i = 0;
    const char *path = NULL;
    if (!transport) {
        clog_err("invalid input parameter.");
        return CVD_EC_INVALID_ARGUMENT;
    }
    
    pthread_mutex_lock(&g_ds_conf.mutex);
    croot = config_root_setting(&g_ds_conf.cfg);
    ctransports = config_setting_get_member(croot, DS_CONF_TRANSPORTS_STRING);
    if (!ctransports) {
        clog_err("no transports config member found");
        rc = CVD_EC_INTERNAL_ERROR;
        goto exit;
    }

    count = config_setting_length(ctransports);
    for (i = 0; i < count; ++i) {
        ctransport = config_setting_get_elem(ctransports, (unsigned int)i);
        if (!config_setting_lookup_string(ctransport, DS_CONF_PATH_STRING, &path)) {
            continue;
        }
        if (path && transport->path && (0 == strcmp(path, transport->path))) {
            break;
        }
    }

    if ((count > 0) && (i != count)) {
        config_setting_remove_elem(ctransports, (unsigned int)i);
        if (!config_write_file(&g_ds_conf.cfg, g_ds_conf.filename)) {
            clog_err("write config file failed when del transport, filename: %s", g_ds_conf.filename);
            rc = CVD_EC_IO;
        } else {
            clog_info("write config success when del transport");
        }
    } else {
        clog_warn("cannot find such transport, path: %s", transport->path);
    }
exit:
    pthread_mutex_unlock(&g_ds_conf.mutex);
    return rc;

}

/**
 * Description: Get transport list. The caller should free the list.
 *       Input: None
 *      Output: None
 *      Return: GList *: transport list
 */
GList *ds_conf_get_transports(void)
{
    GList *transports = NULL;
    config_setting_t *croot = NULL;
    config_setting_t *ctransports = NULL;
    config_setting_t *ctransport = NULL;
    int count = 0;
    int i = 0;
    long mode = 0;
    const char *path = NULL;
    const char *snap = NULL;
    long flag = 0;
    long port = 0;
    ds_transport *transport = NULL;
    
    pthread_mutex_lock(&g_ds_conf.mutex);
    croot = config_root_setting(&g_ds_conf.cfg);
    ctransports = config_setting_get_member(croot, DS_CONF_TRANSPORTS_STRING);
    if (ctransports) {
        count = config_setting_length(ctransports);
        for (i = 0; i < count; ++i) {
            ctransport = config_setting_get_elem(ctransports, (unsigned int)i);
            if (!(config_setting_lookup_int(ctransport, DS_CONF_MODE_STRING, &mode) 
                  && config_setting_lookup_string(ctransport, DS_CONF_PATH_STRING, &path) 
                  && config_setting_lookup_int(ctransport, DS_CONF_FLAG_STRING, &flag) 
                  && config_setting_lookup_int(ctransport, DS_CONF_PORT_STRING, &port))) {
                continue;
            }
            transport = (ds_transport *)calloc(1, sizeof(ds_transport));
            if (!transport) {
                clog_out_of_memory();
                goto exit;
            }
            transport->mode = (int)mode;
            snprintf(transport->path, sizeof(transport->path), "%s", path);
            if (config_setting_lookup_string(ctransport, DS_CONF_SNAP_STRING, &snap)) {
                snprintf(transport->snap, sizeof(transport->snap), "%s", snap);
            }
            transport->flag = (int)flag;
            transport->port = (int)port;

            transports = g_list_prepend(transports, transport);
        }
    }
    
exit:
    pthread_mutex_unlock(&g_ds_conf.mutex);
    return transports;
}

/**
 * Description: Clear transports config.
 *       Input: None
 *      Output: None
 *      Return: None
 */
void ds_conf_clear_transports(void)
{
    config_setting_t *croot = NULL;
    pthread_mutex_lock(&g_ds_conf.mutex);
    croot = config_root_setting(&g_ds_conf.cfg);
    if (!config_setting_remove(croot, DS_CONF_TRANSPORTS_STRING)) {
        clog_err("remove transports config member failed");
    } else {
        clog_info("remove transports config member success");
        if (!config_write_file(&g_ds_conf.cfg, g_ds_conf.filename)) {
            clog_err("write config file failed when clear transports, filename: %s", g_ds_conf.filename);
        } else {
            clog_info("write config success when clear transports");
        }
    }
    pthread_mutex_unlock(&g_ds_conf.mutex);
}

/**
 * Description: Get max allowed client number.
 *       Input: None
 *      Output: None
 *      Return: Max allowed client number
 */
int ds_conf_get_max_client_num(void)
{
    int max_client_num = DS_MAX_CLIENT_NUM;
    pthread_mutex_lock(&g_ds_conf.mutex);
    max_client_num = g_ds_conf.max_client_num;
    pthread_mutex_unlock(&g_ds_conf.mutex);
    return max_client_num;
}

/**
 * Description: Set max allowed client number.
 *       Input: int num
 *      Output: None
 *      Return: None
 */
void ds_conf_set_max_client_num(int num)
{
    config_setting_t *croot = NULL;
    config_setting_t *csetting = NULL;
    
    pthread_mutex_lock(&g_ds_conf.mutex);
    g_ds_conf.max_client_num = num;
    croot = config_root_setting(&g_ds_conf.cfg);
    csetting = config_setting_get_member(croot, DS_CONF_MAX_CLIENT_NUM_STRING);
    if (!csetting) {
        csetting = config_setting_add(croot, DS_CONF_MAX_CLIENT_NUM_STRING, CONFIG_TYPE_INT);
    }
    config_setting_set_int(csetting, num);

    if (!config_write_file(&g_ds_conf.cfg, g_ds_conf.filename)) {
        clog_err("write config file failed when add transport, filename: %s", g_ds_conf.filename);
    } else {
        clog_info("write config success when add transport");
    }
    pthread_mutex_unlock(&g_ds_conf.mutex);
    
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
