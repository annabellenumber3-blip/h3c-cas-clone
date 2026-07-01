/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_server.h
    Description: server for CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-04-18
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifndef __DS_SERVER_H__
#define __DS_SERVER_H__

#ifdef  __cplusplus
extern "C" {
#endif

#include <stdint.h>

/* ds server msg handler
 * char *clientid: client id
 * char *msg: msg from client
 * char **result: handle result send back to client, ds_server will free *result malloced by the user
 * return code: not used
*/
typedef int (*ds_server_msg_handler) (char *clientid, char *msg, char **result);

/* ds server disconnect handler, called when client disconnected
 * const char *clientid: clientid
 * return code: not used
*/
typedef int (*ds_server_disconnect_handler)(const char *clientid);

void ds_server_init(void);
void ds_server_set_handler(ds_server_msg_handler msg_handler, ds_server_disconnect_handler disconnect_handler);
int ds_server_start_nowait(uint16_t port);
void ds_server_loop(uint16_t port);
void ds_server_stop(void);
void ds_server_stop_nowait(void);
void ds_server_deinit(void);

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

#endif  /* end of __DS_SERVER_H__ */
