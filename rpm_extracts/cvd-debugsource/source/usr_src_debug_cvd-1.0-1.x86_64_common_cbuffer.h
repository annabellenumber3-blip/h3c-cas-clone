/*****************************************************************************
  Copyright (C) 2017 New H3C Technologies Inc.

         File: cbuffer.h
  Description: cbuffer.c header file
         Date: 2017-9-18
       Author: wangyongqing 01206

  History:
  Date        Name             Description
  --------------------------------------------------------------------------

*****************************************************************************/
#ifndef _CBUFFER_H_
#define _CBUFFER_H_

#ifdef  __cplusplus
extern "C" {
#endif

struct cbuffer {
    unsigned int size;      /* total length */
    unsigned int used;      /* used length, include null tail */
    int error;              /* error code */
    char *content;          /* user content */
};

#define CBUFFER_INIT    { 0, 0, 0, NULL }

extern int cbuf_add(struct cbuffer *cbuf, void *data, unsigned int len);
extern char *cbuf_content(struct cbuffer *cbuf);
extern void cbuf_free(struct cbuffer *cbuf);
extern void cbuf_sprintf(struct cbuffer *cbuf, const char *format, ...);
extern unsigned int cbuf_used(struct cbuffer *cbuf);
extern void cbuf_vsprintf(struct cbuffer *cbuf, const char *format, va_list argptr);
extern void cbuf_reset(struct cbuffer *cbuf);
extern void cbuf_init(struct cbuffer *cbuf);

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */

#endif  /* end of _CBUFFER_H_ */

