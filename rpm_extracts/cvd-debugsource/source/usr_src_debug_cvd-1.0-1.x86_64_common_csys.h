/*****************************************************************************
  Copyright (C) 2019 New H3C Technologies Inc.

         File: csys.h
  Description: csys.c header file
         Date: 2019-4-29
       Author: 

  History:
  Date        Name             Description
  --------------------------------------------------------------------------

*****************************************************************************/
#ifndef _CSYS_H_
#define _CSYS_H_

#ifdef  __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <string.h>
#include "cbuffer.h"

#define cvd_atomic_inc(ptr)        (__sync_add_and_fetch(ptr, 1))
#define cvd_atomic_dec(ptr)        (__sync_add_and_fetch(ptr, -1))
#define cvd_atomic_get(ptr)        (__sync_add_and_fetch(ptr, 0))

/*
 * Allows one or both pointers to be NULL
 */
static inline bool csys_strcmp(const char *s1, const char *s2)
{
    if (s1 == s2) {
        return true;
    }
    if (s1 == NULL || s2 == NULL) {
        return false;
    }
    return strcmp(s1, s2) == 0;
}

static inline bool csys_strncmp(const char *s1, const char *s2, size_t n)
{
    if (s1 == s2) {
        return true;
    }
    if (s1 == NULL || s2 == NULL) {
        return false;
    }
    return strncmp(s1, s2, n) == 0;
}

static inline bool csys_path_sep(int ch)
{
    return ch == '/' || ch == '\\';
}

extern int csys_set_daemon(void);
extern void csys_stop_daemon(const char *filename, int fd);
extern int csys_check_daemon(const char *filename, int *fd);
extern int csys_set_signal_callback(int sig, void (*fn)(int sig));
extern int csys_execute_cmd(const char *cmd, struct cbuffer *response);
extern bool csys_path_is_directory(const char *path);
extern int csys_mkdir(const char *dir);
extern int scnprintf(char *buf, size_t size, const char *fmt, ...);
extern char *cvd_strncpy(char *dest, const char *src, size_t size);

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

#endif  /* end of _CSYS_H_ */

