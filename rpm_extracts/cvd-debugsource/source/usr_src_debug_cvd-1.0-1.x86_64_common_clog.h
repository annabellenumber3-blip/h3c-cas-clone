/*****************************************************************************
  Copyright (C) 2017 New H3C Technologies Inc.

         File: clog.h
  Description: clog.c header file
         Date: 2017-9-18
       Author: wangyongqing 01206

  History:
  Date        Name             Description
  --------------------------------------------------------------------------

*****************************************************************************/
#ifndef _CLOG_H_
#define _CLOG_H_

#ifdef  __cplusplus
extern "C"{
#endif

#include <stdbool.h>
#include <stddef.h>

enum CLOG_LEVEL_M {
    CLOG_LEVEL_DEBUG  = 0,
    CLOG_LEVEL_INFO,
    CLOG_LEVEL_WARN,
    CLOG_LEVEL_ERR,
    CLOG_LEVEL_ABORT,
    CLOG_LEVEL_EXIT,
    CLOG_MAX_LEVEL,
};

extern void clog_deinit(void);
extern int clog_init(const char *logfile);
extern void clog_output(int level, const char *filename, int line, const char *funcname, int append_syserr, const char *format, ...);
extern void clog_set_level(int level);
extern void clog_set_level2(const char *level_string);
extern void clog_enable_stdout (bool enable);

#define clog_debug(format...)   clog_output(CLOG_LEVEL_DEBUG, __FILE__, __LINE__, __func__, 0, ##format)
#define clog_info(format...)    clog_output(CLOG_LEVEL_INFO, __FILE__, __LINE__, __func__, 0, ##format)
#define clog_warn(format...)    clog_output(CLOG_LEVEL_WARN, __FILE__, __LINE__, __func__, 0, ##format)
#define clog_err(format...)     clog_output(CLOG_LEVEL_ERR, __FILE__, __LINE__, __func__, 0, ##format)
#define clog_abort(format...)   clog_output(CLOG_LEVEL_ABORT, __FILE__, __LINE__, __func__, 0, ##format)
#define clog_exit(format...)    clog_output(CLOG_LEVEL_EXIT, __FILE__, __LINE__, __func__, 0, ##format)
#define clog_sys_warn(format...)        clog_output(CLOG_LEVEL_WARN, __FILE__, __LINE__, __func__, 1, ##format)
#define clog_sys_err(format...)         clog_output(CLOG_LEVEL_ERR, __FILE__, __LINE__, __func__, 1, ##format)
#define clog_info_simple(format...)     clog_output(CLOG_LEVEL_INFO, NULL, 0, NULL, 0, ##format)
#define clog_warn_simple(format...)     clog_output(CLOG_LEVEL_WARN, NULL, 0, NULL, 0, ##format)

#define clog_out_of_memory() clog_err("out of memory")
#define clog_param_err() clog_err("parameter error")

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

#endif  /* end of _CLOG_H_ */
