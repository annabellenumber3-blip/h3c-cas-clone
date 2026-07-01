/*****************************************************************************
  Copyright (C) 2017 New H3C Technologies Inc.

         File: clog.c
  Description: message log api
         Date: 2017-9-18
       Author: wangyongqing 01206

  History:
  Date        Name             Description
  --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <limits.h>
#include <pthread.h>
#include <syslog.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <libgen.h>
#include "cbuffer.h"
#include "clog.h"

#define CLOG_TIMESTAMP_STR_LEN    \
    (4 + 1 + 2 + 1 + 2 + 1 + 2 + 1 + 2 + 1 + 2 + 1 + 3 + 1)

struct clog_config_t {
    FILE *fp;                               /* logger file handle */
    char filename[PATH_MAX];                /* logger file name */
    pthread_mutex_t fd_lock;                /* lock for mutex write */
    int level;                              /* logger level */
};


struct clog_level_info {
    int level;
    const char *title;
};

static struct clog_level_info clog_levels[] = {
        {.level = CLOG_LEVEL_DEBUG, .title = "debug"},
        {.level = CLOG_LEVEL_INFO, .title = "info"},
        {.level = CLOG_LEVEL_WARN, .title = "warn"},
        {.level = CLOG_LEVEL_ERR, .title = "error"},
        {.level = CLOG_LEVEL_ABORT, .title = "abort"},
        {.level = CLOG_LEVEL_EXIT, .title = "exit"},
        {.level = CLOG_MAX_LEVEL, .title = "unknown"},
};

static bool clog_initialized = false;
struct clog_config_t clog_config;
static bool clog_to_stdout = false;

/**
 * Description: convert clog level to string
 *       Input: int level  clog level
 *      Output: none
 *      Return: level name
 */
static const char *clog_level_string(int level)
{
    if (level > CLOG_MAX_LEVEL) {
        level = CLOG_MAX_LEVEL;
    }
    return clog_levels[level].title;
}

/**
 * Description: convert clog level to syslog level
 *       Input: int level  clog level
 *      Output: none
 *      Return: syslog level
 */
static int clog_level_syslog(int level)
{
    switch (level) {
    case CLOG_LEVEL_DEBUG:
        return LOG_DEBUG;
    case CLOG_LEVEL_INFO:
        return LOG_INFO;
    case CLOG_LEVEL_WARN:
        return LOG_WARNING;
    case CLOG_LEVEL_ERR:
        return LOG_ERR;
    case CLOG_LEVEL_ABORT:
        return LOG_CRIT;
    case CLOG_LEVEL_EXIT:
        return LOG_CRIT;
    default:
        return LOG_ERR;
    }
}

/**
 * Description: enable stdout print
 *       Input: bool enable  if ture, enable stdout print
 *      Output: none
 *      Return: none
 */
void clog_enable_stdout(bool enable)
{
    clog_to_stdout = enable;
}

/**
 * Description: initialize daemon logger
 *       Input: const char *logfile  logger file name
 *      Output: none
 *      Return: 0 on success, ec code on failure
 */
int clog_init(const char *logfile)
{
    int res;
    struct stat statp;
    char *dir = NULL;

    if (!logfile) {
        return -1;
    }

    clog_config.level = CLOG_LEVEL_INFO;
    res = pthread_mutex_init(&clog_config.fd_lock, NULL);
    if (res < 0) {
        perror("pthread_mutex_init failed");
        return -1;
    }

    snprintf(clog_config.filename, sizeof(clog_config.filename), "%s", logfile);
    dir = dirname(clog_config.filename);
    /* create default logger path */
    res = stat(dir, &statp);
    if (0 == res) {
        if (!S_ISDIR(statp.st_mode)) {
            unlink(dir);
            res = mkdir(dir, 0755);
        }
    } else {
        res = mkdir(dir, 0755);
    }
    if (res < 0) {
        perror("mkdir failed");
        pthread_mutex_destroy(&clog_config.fd_lock);
        return -1;
    }

    /* dirname() may change the content, so copy it again */
    snprintf(clog_config.filename, sizeof(clog_config.filename), "%s", logfile);
    clog_config.fp = NULL;
    clog_initialized = true;

    return 0;
}

/**
 * Description: deinitialized logger
 *       Input: none
 *      Output: none
 *      Return: none
 */
void clog_deinit(void)
{
    pthread_mutex_destroy(&clog_config.fd_lock);
    if (clog_config.fp) {
        fclose(clog_config.fp);
        clog_config.fp = NULL;
    }
    clog_initialized = false;
}

/**
 * Description: modify logger level
 *       Input: int level  logger level
 *      Output: none
 *      Return: none
 */
void clog_set_level(int level)
{
    clog_info("set log level: %d(0:debug, 1:info, 2:warn, 3:err)", level);
    if (level >= CLOG_MAX_LEVEL) {
        return;
    }
    clog_config.level = level;
}

/**
 * Description: modify logger level
 *       Input: const char *level_string logger level string
 *      Output: none
 *      Return: none
 */
void clog_set_level2(const char *level_string)
{
    int i = 0;
    for (i = 0; i < CLOG_MAX_LEVEL; i++) {
        if (!strcasecmp(clog_levels[i].title, level_string)) {
            clog_set_level(clog_levels[i].level);
            return;
        }
    }
}

/**
 * Description: convert time now to string
 *       Input: char *buf  buffer point
 *      Output: char *buf  hold string of time
 *      Return: 0 on success, ec code on failure
 */
static int clog_time_string_now(char *buf)
{
    struct timeval tv;
    struct tm *now;

    if (!buf) {
        return -1;
    }

    gettimeofday(&tv, NULL);
    now = localtime(&(tv.tv_sec));

    now->tm_year += 1900;
    now->tm_mon += 1;

    snprintf(buf, CLOG_TIMESTAMP_STR_LEN, "%4d-%02d-%02d %02d:%02d:%02d.%03ld",
              now->tm_year, now->tm_mon, now->tm_mday,
              now->tm_hour, now->tm_min, now->tm_sec, (tv.tv_usec) / 1000);

    return 0;
}

/**
 * Description: get filename part of a path
 *       Input: const char *path  absolute path
 *      Output: none
 *      Return: filename part of a path
 */
static const char *clog_get_basename(const char *path)
{
    const char *filename = NULL;

    if (!path || !strlen(path)) {
        return NULL;
    }

    filename = strrchr(path, '/');
    if (filename) {
        filename += 1;
    } else {
        filename = path;
    }

    return filename;
}

/**
 * Description: write message to logger file
 *       Input: int level             logger level
 *              const char *filename  c file name
 *              int line              line
 *              const char *funcname  function name
 *              int append_syserr     whether need to append system error message to the end of log or not
 *              const char *format    format string
 *              va_list argptr        variable argument
 *      Output: none
 *      Return: none
 */
static void clog_tologfile(int level, const char *filename, int line, const char *funcname, int append_syserr, const char *format, va_list argptr)
{
    char timestamp[CLOG_TIMESTAMP_STR_LEN];
    struct cbuffer cbuf = CBUFFER_INIT;
    (void)funcname;

    if (!format) {
        return;
    }

    /* when not initialized, write to syslog */
    if (!clog_initialized) {
        cbuf_vsprintf(&cbuf, format, argptr);
        syslog(clog_level_syslog(level), "%s\n", cbuf_content(&cbuf));
        if (clog_to_stdout) {
            fprintf(stdout, "%s\n", cbuf_content(&cbuf));
            fflush(stdout);
        }
        goto cleanup;
    }

    clog_time_string_now(timestamp);
    if (filename) {
        /* logger head format: timestamp threadID level [filename:funcname:line] */
        cbuf_sprintf(&cbuf, "%s %lu %s [%s: %d]: ",
                     timestamp, syscall(SYS_gettid), clog_level_string(level), clog_get_basename(filename), line);
    } else {
        cbuf_sprintf(&cbuf, "%s %s: ", timestamp, clog_level_string(level));  /* logger head format: timestamp level */
    }
    cbuf_vsprintf(&cbuf, format, argptr);
    if (append_syserr) {
        cbuf_sprintf(&cbuf, ", err: %s", strerror(errno));
    }

    if (clog_to_stdout) {
        fprintf(stdout, "%s\n", cbuf_content(&cbuf));
        fflush(stdout);
    }

    if (!clog_config.fp) {
        clog_config.fp = fopen(clog_config.filename, "a+");
        if (!clog_config.fp) {
            goto cleanup;
        }
    }

    /* reopen file when not exist */
    if (access(clog_config.filename, F_OK) < 0) {
        pthread_mutex_lock(&clog_config.fd_lock);
        if (clog_config.fp) {
            fclose(clog_config.fp);
            clog_config.fp = NULL;
        }

        clog_config.fp = fopen(clog_config.filename, "a+");
        if (!clog_config.fp) {
            pthread_mutex_unlock(&clog_config.fd_lock);
            goto cleanup;
        }
        pthread_mutex_unlock(&clog_config.fd_lock);
    }

    fprintf(clog_config.fp, "%s\n", cbuf_content(&cbuf));
    fflush(clog_config.fp);

cleanup:
    cbuf_free(&cbuf);
    return;
}

/**
 * Description: output message
 *       Input: int level             logger level
 *              const char *filename  c file name
 *              int line              line
 *              const char *funcname  function name
 *              int append_syserr     whether need to append system error message to the end of log or not
 *              const char *format    format string
 *              ...
 *      Output: none
 *      Return: none
 */
void clog_output(int level, const char *filename, int line, const char *funcname, int append_syserr, const char *format, ...)
{
    va_list args;

    if (level < clog_config.level) {
        return;
    }

    va_start(args, format);
    clog_tologfile(level, filename, line, funcname, append_syserr, format, args);
    va_end(args);

    if (CLOG_LEVEL_ABORT == level) {
        char *p = 0;
        p[0] = 0;   /* generate segmentation violation */
    } else if (CLOG_LEVEL_EXIT == level) {
        exit(-1);
    }
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

