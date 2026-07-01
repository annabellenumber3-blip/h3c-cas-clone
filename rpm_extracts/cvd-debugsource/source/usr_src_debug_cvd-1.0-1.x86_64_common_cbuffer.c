/*****************************************************************************
  Copyright (C) 2017 New H3C Technologies Inc.

         File: cbuffer.c
  Description: support auto growth buffer operation api
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
#include <stdarg.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include "cbuffer.h"

/**
 * Description: set buffer error code
 *       Input: struct cbuffer *cbuf  buffer point
 *              int error             error code
 *      Output: none
 *      Return: none
 */
static void cbuf_set_error(struct cbuffer *cbuf, int error)
{
    if (cbuf) {
        cbuf->error = error;
    }
}

/**
 * Description: grow buffer length
 *       Input: struct cbuffer *cbuf  buffer point
 *              unsigned int len      grow length
 *      Output: none
 *      Return: 0 on success, ec code on failure
 */
static int cbuf_grow(struct cbuffer *cbuf, unsigned int len)
{
    unsigned int new_size = 0;
    char *new_ptr = NULL;

    if (!cbuf || (0 == len)) {
        return -1;
    }

    if (cbuf->error) {
        return -1;
    }

    if ((len + cbuf->used) < cbuf->size) {
        return 0;
    }

    new_size = cbuf->used + len + 512;

    if (!cbuf->content) {
        new_ptr = (char *)calloc(1, new_size);
        if (!new_ptr) {
            cbuf_set_error(cbuf, errno);
            return -1;
        }
        cbuf->content = new_ptr;
    } else {
        new_ptr = (char *)realloc(cbuf->content, new_size);
        if (!new_ptr) {
            cbuf_set_error(cbuf, errno);
            return -1;
        }
        cbuf->content = new_ptr;
        memset(cbuf->content + cbuf->used, 0, new_size - cbuf->used);
    }

    cbuf->size = new_size;
    return 0;
}

/**
 * Description: add data to buffer
 *       Input: struct cbuffer *cbuf  buffer point
 *              void *data            data point
 *              unsigned int len      data length
 *      Output: none
 *      Return: 0 on success, ec code on failure
 */
int cbuf_add(struct cbuffer *cbuf, void *data, unsigned int len)
{
    unsigned int need_size = 0;
    int res;

    if (!cbuf || !data || 0 == len) {
        return -1;
    }

    need_size = len + 1;
    res = cbuf_grow(cbuf, need_size);
    if (0 != res) {
        return res;
    }

    memcpy(cbuf->content + cbuf->used, data, len);
    cbuf->used += len;
    cbuf->content[cbuf->used] = '\0';

    return 0;
}

/**
 * Description: using cbuffer to achieve vsprintf function
 *       Input: struct cbuffer *cbuf  buffer point
 *              const char *format    string format
 *              va_list argptr        variable argument
 *      Output: none
 *      Return: none
 */
void cbuf_vsprintf(struct cbuffer *cbuf, const char *format, va_list argptr)
{
    int count = 0;
    size_t size = 0;
    int res;
    va_list copy;

    if (!cbuf) {
        return;
    }

    if (0 == cbuf->size) {
        res = cbuf_grow(cbuf, 256);
        if (0 != res) {
            return;
        }
    }

    va_copy(copy, argptr);

    size = cbuf->size - cbuf->used;
    count = vsnprintf(cbuf->content + cbuf->used, size, format, copy);
    if (count < 0) {
        cbuf_set_error(cbuf, errno);
        va_end(copy);
        return;
    }
    va_end(copy);

    /* grow buffer if necessary and retry */
    if ((unsigned int)count >= size) {
        unsigned int grow_size = 0;
        cbuf->content[cbuf->used] = 0;

        grow_size = (count + 1 > 512) ? (unsigned int)count + 1 : 512;
        res = cbuf_grow(cbuf, grow_size);
        if (0 != res) {
            return;
        }

        size = cbuf->size - cbuf->used;
        count = vsnprintf(cbuf->content + cbuf->used, size, format, argptr);
        if (count < 0) {
            cbuf_set_error(cbuf, errno);
            va_end(argptr);
            return;
        }
    }
    va_end(argptr);

    cbuf->used += count;
}

/**
 * Description: using cbuffer to achieve sprintf function
 *       Input: struct cbuffer *cbuf  buffer point
 *              const char *format    string format
 *              ...
 *      Output: none
 *      Return: none
 */
void cbuf_sprintf(struct cbuffer *cbuf, const char *format, ...)
{
    va_list argptr;

    va_start(argptr, format);
    cbuf_vsprintf(cbuf, format, argptr);
    va_end(argptr);
}

/**
 * Description: get buffer content
 *       Input: struct cbuffer *cbuf  buffer point
 *      Output: none
 *      Return: content point
 */
char *cbuf_content(struct cbuffer *cbuf)
{
    if (!cbuf || (0 != cbuf->error)) {
        return NULL;
    }

    return cbuf->used ? cbuf->content : "";
}

/**
 * Description: get buffer used length
 *       Input: struct cbuffer *cbuf  buffer point
 *      Output: none
 *      Return: used length
 */
unsigned int cbuf_used(struct cbuffer *cbuf)
{
    if (!cbuf) {
        return 0;
    }

    return cbuf->used;
}

/**
 * Description: free buffer content and reset
 *       Input: struct cbuffer *cbuf  buffer point
 *      Output: none
 *      Return: none
 */
void cbuf_free(struct cbuffer *cbuf)
{
    if (!cbuf) {
        return;
    }

    if (cbuf->content) {
        free(cbuf->content);
        cbuf->content = NULL;
    }

    memset(cbuf, 0, sizeof(struct cbuffer));
}

/**
 * Description: Reset buffer content
 *              Only reset content, do not free buffer structure
 *       Input: struct cbuffer *cbuf  buffer point
 *      Output: None
 *      Return: None
 */
void cbuf_reset(struct cbuffer *cbuf)
{
    if (!cbuf) {
        return;
    }

    if (cbuf->content) {
        memset(cbuf->content, 0, cbuf->size);
    }
    cbuf->used = 0;
}

/**
 * Description: initialize cbuffer
 *       Input: struct cbuffer *cbuf  point to cbuffer
 *      Output: none
 *      Return: none
 */
void cbuf_init(struct cbuffer *cbuf)
{
    if (!cbuf) {
        return;
    }

    memset(cbuf, 0, sizeof(struct cbuffer));
}


#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

