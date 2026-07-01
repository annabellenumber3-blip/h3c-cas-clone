/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_business.h
    Description: business for DS(CAS Virtual Disk Development Service)
    Date: 2019-05-13
    Author: f18671

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifndef __DS_BUSINESS_H__
#define __DS_BUSINESS_H__

#ifdef  __cplusplus
extern "C" {
#endif

#include <libvirt/libvirt.h>
#include <stdbool.h>
#include "cjson.h"

#define DS_STORAGE_PATH_LEN        120
#define DS_IP_LEN                  46
#define DS_CHAR_LEN                256
#define DS_NAME_LEN                64
#define DS_BUFF_LEN                4096
#define ILLEGALSOCKET              -1

#define SUCCESS_STATUS_CODE        200

#define DS_CONNECT_FAIL_STRING              "connect fail"
#define DS_QEURY_POOL_FAIL_STRING           "query pool fail"
#define DS_QUERY_DISK_INFO_FAIL_STRING      "query disk info fail"

#define HTTP_STRING \
"POST /cas/spring_check?encrypt=true&lang=cn&name=%s&password=%s HTTP/1.1\r\n\
Host: %s:8080\r\n\
accept: application/xml\r\n\
Content-Type: application/x-www-form-urlencoded\r\n\
User-Agent: Apache-HttpClient/4.1 (java 1.5)\r\n\
\r\n\
\r\n\r\n"

typedef struct unauth_info_s {
    char sessionid[40];
    char realm[256];
    char qop[12];
    char nonce[256];
}unauth_info;

int ds_parse_store_pool_by_xml(char *pool_xml, cJSON **result);
virConnectPtr ds_virtconnpool_open_conn(void);
bool ds_virtconnpool_is_conn_alive(virConnectPtr *conn);
void ds_virtconnpool_close_conn(virConnectPtr *conn);
int ds_get_cvmip(char *cvmip);
bool ds_connect_userpwd_author(char *user, char *passwd, char *cvmip);
void ds_make_connect_result(cJSON **result);

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

#endif  /* end of __DS_BUSINESS_H__ */
