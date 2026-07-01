/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_conf.h
    Description: config for CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-5-20
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifndef __DS_CONF_H__
#define __DS_CONF_H__

#ifdef  __cplusplus
extern "C" {
#endif

#include <limits.h>
#include <gmodule.h>
#include "cvd_defines.h"

#define DS_MAX_CLIENT_NUM      64

typedef struct ds_transport_t {
    int mode;                           /* 1: LAN_BASED; 2: LAN_FREE, for now we only support lan base nbd */
    char path[PATH_MAX];                /* exported path */
    char snap[CVD_MAX_NAME_LEN];        /* snapshot name */
    int flag;                           /* 1: read-only; 2: read-write */
    int port;                           /* nbd port */
}ds_transport;

extern void ds_conf_init(const char *filename);
extern void ds_conf_deinit(void);
/* add one transport and write the updated transports to config file */
extern int ds_conf_add_transport(ds_transport *transport);
/* del one transport and write the updated transports to config file */
extern int ds_conf_del_transport(ds_transport *transport);
/* The caller should free the list */
extern GList *ds_conf_get_transports(void);
extern void ds_conf_clear_transports(void);
extern int ds_conf_get_max_client_num(void);
extern void ds_conf_set_max_client_num(int num);

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

#endif  /* end of __DS_CONF_H__ */
