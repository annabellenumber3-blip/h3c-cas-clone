/*****************************************************************************
   Copyright (C) 2019 New H3C Technologies Inc.

         File: csys.c
   Description: supply safe version of some system api
         Date: 2019-4-29
       Author: 

   History:
   Date        Name             Description
   --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <sys/file.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <errno.h>
#include <signal.h>
#include <limits.h>
#include <stdarg.h>
#include "csys.h"

/**
 * Description: change linux process to daemon
 *       Input: none
 *      Output: none
 *      Return: none
 */
int csys_set_daemon(void)
{
    if (daemon(0, 0) < 0) {
        perror("daemon error");
        return -1;
    }

    return 0;
}

/**
 * Description: check daemon whether is running, write daemon pid to pidfile
 *       Input: const char *filename  pid file name
 *      Output: int *fd               pid file description
 *      Return: 0 on success, ec code on failure
 */
int csys_check_daemon(const char *filename, int *fd)
{
    char buf[64];
    int pidfd = -1;
    int res = -1;

    if (!filename || !fd) {
        return -1;
    }

    pidfd = open(filename, O_RDWR | O_CREAT, S_IRUSR | S_IWUSR);
    if (pidfd < 0) {
        fprintf(stderr, "failed to open deamon file %s, err: %s\n", filename, strerror(errno));
        return -1;
    }

    res = flock(pidfd, LOCK_EX | LOCK_NB);
    if (res < 0) {
        if (errno == EWOULDBLOCK) {
            fprintf(stderr, "daemon is already running\n");
            memset(buf, 0, 64);
            res = (int)read(pidfd, buf, 64);
            if (res > 0) {
                fprintf(stderr, "daemon pid file %s is %s\n", filename, buf);
            }
        } else {
            perror("flock error");
        }

        close(pidfd);
        return -1;
    }

    /* write pid to the PID file */
    memset(buf, 0, 64);
    sprintf(buf, "%u\n", getpid());

    res = (int)write(pidfd, buf, 63);
    if (res < 0) {
        close(pidfd);
        perror("write error");
        return -1;
    }

    res = fsync(pidfd);
    if (res < 0) {
        close(pidfd);
        perror("fsync error");
        return -1;
    }

    *fd = pidfd;
    return 0;
}

/**
 * Description: stop daemon running
 *       Input: const char *filename  pid file name
 *              int fd                pid file description
 *      Output: none
 *      Return: none
 */
void csys_stop_daemon(const char *filename, int fd)
{
    if (fd >= 0) {
        close(fd);
        fd = -1;
    }

    unlink(filename);
}

/**
 * Description: set signal callback
 *       Input: int sig              signal number
 *              void (*fn)(int sig)  callback function
 *      Output: none
 *      Return: 0 on success, ec code on failure
 */
int csys_set_signal_callback(int sig, void (*fn)(int sig))
{
    struct sigaction act;

    act.sa_handler = fn;
    sigemptyset(&act.sa_mask);
    act.sa_flags = 0;

    if (sigaction(sig, &act, 0) < 0) {
        return -1;
    }

    return 0;
}

/**
 * Description: Execute shell command and save the result in the @response.
 *       Input: const char *cmd  shell command
 *              struct cbuffer *response  buffer to save response
 *      Output: None
 *      Return: 0 on success;
 *              -1 on internal error or get interrupted
 *              > 0 exit code of child process
 */
int csys_execute_cmd(const char *cmd, struct cbuffer *response)
{
    FILE *fp;
    int bytes_read = 0;
    int exit_code = 0;
    char buffer[512];

    if (!cmd || !response) {
        return -1;
    }

    cbuf_init(response);
    /* Open the command for reading. */
    fp = popen(cmd, "re");
    if (fp == NULL) {
        printf("Failed to run command[%s]\n", cmd);
        return -1;
    }

    /* Read the output of cmd */
    while ((bytes_read = (int)fread(buffer, 1, sizeof(buffer), fp)) > 0) {
        cbuf_add(response, buffer, (unsigned int)bytes_read);
    }

    /* close */
    exit_code = pclose(fp);
    if (exit_code == -1) {
        return -1;
    }

    if (WIFSIGNALED(exit_code)) {
        exit_code = -1;
    } else /*if (WIFEXITED(exit_code))*/ {
        exit_code = WEXITSTATUS(exit_code);
    }
    return exit_code;
}

/**
 * Description: check whether the path is absolute
 *       Input: const char *path  path string
 *      Output: none
 *      Return: true when path is absolute directory, otherwise return false
 */
static bool csys_path_is_absolute(const char *path)
{
    if (!path || !strlen(path)) {
        return false;
    }

    if (csys_path_sep(path[0])) {
        return true;
    }

    return false;
}

/**
 * Description: check whether path is a directory
 *       Input: const char *path  absolute path
 *      Output: none
 *      Return: true when path is directory, otherwise return false
 */
bool csys_path_is_directory(const char *path)
{
    struct stat statp;

    if (!path || !strlen(path)) {
        return false;
    }

    if (stat(path, &statp) == 0) {
        return S_ISDIR(statp.st_mode);
    } else {
        return false;
    }
}

/**
 *  Description: recursively mkdir
 *        Input: const char * dir: must be absolute directory
 *       Output: none
 *       Return: if success, CBR_EC_OK is returned;
 *               else, error code is returned, and errno will be set
 */
int csys_mkdir(const char *dir)
{
    char *p = NULL;
    char tmp[PATH_MAX] = { '\0' };
    int offset = 1;

    if (NULL == dir || strlen(dir) == 0) {
        return -1;
    }

    if (!csys_path_is_absolute(dir)) {
        return -1;
    }

    if (csys_path_is_directory(dir)) {
        return 0;
    }

    strncpy(tmp, dir, strlen(dir));
    p = strrchr(tmp, '/');
    if (p && (p - tmp == strlen(tmp) - 1)) {
        *p = '\0';
    }
    while (NULL != (p = strchr(tmp + offset, '/'))) {
        *p = '\0';
        if (!csys_path_is_directory(tmp)) {
            if (0 != mkdir(tmp, 0755)) {
                return -1;
            }
        }
        *p = '/';
        offset = (int)(p - tmp) + 1;
    }

    if (0 != mkdir(tmp, 0755)) {
        return -1;
    }
    return 0;
}

/**
 * Description: output message
 *       Input:
 *              buf*:cache
 *              size:cache length
 *      Output: none
 *      Return: failed copy the data,return 0, else return length
 */
int scnprintf(char *buf, size_t size, const char *fmt, ...)
{
    int i, res;
    va_list args;
    ssize_t ssize = (ssize_t)size;

    va_start(args, fmt);
    i = vsnprintf(buf, size, fmt, args);
    va_end(args);

    res = (i >= ssize) ? (int)(ssize - 1) : i;
    return (res > 0) ? res : 0;
}

/**
 * Description: output message
 *       Input: char *dest
 *              int maxlen
 *      Output: char *dest
 *      Return: copy dest string
 */
char *cvd_strncpy(char *dest, const char *src, size_t size)
{
    strncpy(dest, src, size - 1);
    dest[size - 1] = 0;
    return dest;
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

