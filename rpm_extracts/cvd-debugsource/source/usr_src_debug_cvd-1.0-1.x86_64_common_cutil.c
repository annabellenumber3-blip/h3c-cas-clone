/*****************************************************************************
  Copyright (c) 2017, new H3C Technologies Co., Ltd. All rights reserved.

          File: cutil.c
   Description: 
          Date: Apr 26, 2019
        Author: tuguoyi 14581

  History:
  DATE        NAME             DESCRIPTION
  --------------------------------------------------------------------------

*****************************************************************************/


#include <stdbool.h>
#include <unistd.h>
#include <cutil.h>
#include <errno.h>
#include <stdlib.h>
#include "cvd_defines.h"

bool cutil_file_exists(const char *filename)
{
    if (access(filename, F_OK) == 0) {
        return true;
    }
    return false;
}

/**
 * Description: parse port from argument,parse error or out of port range, set to default port
 *       Input: argument string
 *      Output: none
 *      Return: port cvd-ds listens to
 */
int parse_port_param(char *param) 
{
    char *endptr;
    long port = strtol(param, &endptr, 10);

    if (NULL == param) {
        return CVD_SERVER_DEFAULT_PORT;
    }

    if (errno == ERANGE || endptr == param || port <= 0 || port > 65535 ) {
        return CVD_SERVER_DEFAULT_PORT;
    } else {
        return port;
    }
}

