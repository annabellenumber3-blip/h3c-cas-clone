/*
 * Copyright 2022 Huawei Technologies Co., Ltd. All Rights Reserved.
 *
 * Licensed under the OpenSSL license (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.openssl.org/source/license.html
 */

#ifndef HEADER_SM2_H
# define HEADER_SM2_H

#include "ossl_typ.h"

# ifdef  __cplusplus
extern "C" {
# endif

int SM2_compute_key(void *out, size_t outlen,
                    int server, const char *peer_uid, int peer_uid_len,
                    const char *self_uid, int self_uid_len,
                    const EC_KEY *peer_ecdhe_key, const EC_KEY *self_ecdhe_key,
                    const EC_KEY *peer_pub_key, const EC_KEY *self_eckey,
                    const EVP_MD *md);

# ifdef  __cplusplus
}
# endif
#endif
