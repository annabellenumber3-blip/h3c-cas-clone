/*****************************************************************************
  Copyright (c) 2017, new H3C Technologies Co., Ltd. All rights reserved.

          File: httpauth.h
   Description: 
          Date: Aug 20, 2019
        Author: fengxiaojun 18671

  History:
  DATE        NAME             DESCRIPTION
  --------------------------------------------------------------------------

*****************************************************************************/
#ifndef HTTPAUTH_H_
#define HTTPAUTH_H_
#ifdef __cplusplus
    extern "C"{
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define USERLEN 128
#define REALMLEN 256

typedef struct httpauth_t{
    char username[USERLEN];
    char password[USERLEN];
    char realm[REALMLEN];
    char nonce[REALMLEN];
    char cnonce[REALMLEN];
}httpauth_t;

void to_hex(char *in, int len, unsigned char *out);
void md5(const uint8_t *initial_msg, size_t initial_len, uint8_t *digest);

int httpauth_set_user_pwd(httpauth_t *auth, char *username, char *password);
int httpauth_set_realm_nonce(httpauth_t *auth, char *realm, char *nonce, char *cnonce);
int httpauth_get_response(httpauth_t *auth, char *cmd, char *url, char* qop, char *response);

#ifdef __cplusplus
} /* end of __cplusplus */
#endif
#endif /* HTTPAUTH_H_ */
