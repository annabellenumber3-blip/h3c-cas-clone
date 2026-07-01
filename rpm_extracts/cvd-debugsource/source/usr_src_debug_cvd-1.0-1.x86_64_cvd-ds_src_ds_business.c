/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_business.c
    Description: business for DS(CAS Virtual Disk Development Service)
    Date: 2019-05-13
    Author: F18671

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <pthread.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h> 
#include <openssl/evp.h>
#include <openssl/des.h>
#include <openssl/pkcs7.h>
#include <openssl/pem.h>
#include <ctype.h>
#include <openssl/bio.h>
#include "ds_business.h"
#include "cvd_mxml.h"
#include "cjson.h"
#include "clog.h"
#include "cvd_error.h"
#include "csys.h"
#include "version.h"
#include <curl/curl.h>
#include "httpauth.h"
#include <time.h>

bool ds_ip_is_legal(const char *ip_addr);
bool ds_ipv6_is_legal(const char *ip_addr);

/**
 * Description: callback function for CURLOPT_HEADERFUNCTION add by curl_easy_setopt 
 *       Input: 
 *      Output: 
 *      Return: return size * nitems
 */
static size_t ds_header_callback(char *buffer, size_t size, size_t nitems, void *userdata)
{
    char *realm = NULL;
    char *qop = NULL;
    char *nonce = NULL;
    /* userdata is set with CURLOPT_HEADERDATA */
    unauth_info *infos = (unauth_info*)userdata;

    if (0 == memcmp(buffer, "Set-Cookie:", strlen("Set-Cookie:"))) {
        sscanf(buffer, "%*s%*[^=]=%[^;]", infos->sessionid);
    }

    if (0 == memcmp(buffer, "WWW-Authenticate:", strlen("WWW-Authenticate:"))) {
        realm = strstr(buffer, "Digest realm=");
        if (realm) {
            sscanf(realm, "%*s%*[^\"]\"%[^\"]", infos->realm);
        }

        qop = strstr(buffer, "qop=");
        if (qop) {
            sscanf(qop, "%*[^\"]\"%[^\"]", infos->qop);
        }

        nonce = strstr(buffer, "nonce=");
        if (nonce) {
            sscanf(nonce, "%*[^\"]\"%[^\"]", infos->nonce);
        }
    }

    return size * nitems;
}

/**
 * Description: send unauth request to the server and get the response info
 *       Input: char *server
 *              CURL *curl
 *      Output: unauth_info *infos
 *      Return: if success return cvd_success, else return fail
 */
static int ds_get_unauth_info(char *server, CURL *curl, unauth_info *infos)
{
    CURLcode res_code = CURLE_OK;
    int rsp = 0;
    int res = CVD_EC_OK;
    char url[52] = {0};
    struct curl_slist *headers = NULL;
    
    if (!server || !curl) {
        clog_err("Err input!");
        return CVD_EC_FAILURE;
    }

    headers = curl_slist_append(headers, "accept: application/xml");
    headers = curl_slist_append(headers, "Connection: Keep-Alive");
    headers = curl_slist_append(headers, "User-Agent: Apache-HttpClient/4.1 (java 1.5)");
    
    if (curl) {
        scnprintf(url, sizeof(url), "http://%s:8080/cas/casrs/operator/test", server);
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 5);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_HEADERFUNCTION, ds_header_callback);
        curl_easy_setopt(curl, CURLOPT_HEADERDATA, infos);

        res_code = curl_easy_perform(curl);
        if (CURLE_OK != res_code) {
            clog_err("ds_get_unauth_info fail, res: %d", res_code);
            res = CVD_EC_FAILURE;
            goto exit;
        }

        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &rsp);
        if (401 != rsp) {
            clog_err("ds_get_unauth_info get other response:%d", rsp);
            res = CVD_EC_FAILURE;
            goto exit;
        }
    }
exit:
    curl_slist_free_all(headers);
    return res;
}

/**
 * Description: Generate random string for cnonce
 *       Input: int length
 *      Output: char *output
 *      Return: 0 if success, otherwise error code
 */
static int ds_gen_random_string(int length, char *output)
{
    int flag = 0;
    int i = 0;
    struct timeval tpstart;

    gettimeofday(&tpstart, NULL);
    srand(tpstart.tv_usec);

    for (i = 0; i < length - 1; i++) {
        flag = rand() % 16;
        if (flag < 10) {
            output[i] = '0' + flag;
        } else {
            output[i] = 'a' + (flag - 10);
        }
    }

    return 0;
}

/**
 * Description: Send http connection message to cvm to authorize username and password
 *       Input: char *user
 *              char *passwd
 *              char *cvmip
 *      Output: int *result
 *      Return: 0 if success, otherwise error code
 */
bool ds_connect_userpwd_author(char *user, char *passwd, char *cvmip)
{
    CURL *curl = NULL;
    CURL *curl_unauth = NULL;
    CURLcode res_code = CURLE_OK;
    bool res = true;
    unauth_info infos = {0};
    struct curl_slist *headers = NULL;
    char cookie[60] = {0};
    char host[28] = {0};
    httpauth_t auth = {0};
    char *cmd = "GET";
    char url[52] = {0};
    char response[256] = {0};
    char authorization[1024] = {0};
    char cnonce[33] = {0};
    int rsp = 0;
    
    if (!ds_ip_is_legal(cvmip) && !ds_ipv6_is_legal(cvmip)) {
        clog_err("Inlegal IP.");
        return false;
    }

    /* Send authorized message to cvm, success if receive 204 else false */
    curl_unauth = curl_easy_init();
    if (CVD_EC_OK != ds_get_unauth_info(cvmip, curl_unauth, &infos)) {
        clog_err("ds_connect_userpwd_author get auth info err.");
        res = false;
        goto exit;
    }

    /* construct header and url */
    scnprintf(cookie, sizeof(cookie), "Cookie: JSESSIONID=%s", infos.sessionid);
    scnprintf(host, sizeof(host), "Host: %s:8080", cvmip);
    scnprintf(url, sizeof(url), "http://%s:8080/cas/casrs/operator/test", cvmip);

    /* generate cnonce */
    ds_gen_random_string(sizeof(cnonce), cnonce);
    
    /* generate response: A1=<user>:<realm>:<password>, A2=<request-method>:<uri-directive-value>
    if qop is not define, response=MD5(MD5(A1):<nonce>:MD5(A2)), else 
    response=MD5(MD5(A1):<nonce>:<nc>:<cnonce>:<qop>:MD5(A2)) */
    httpauth_set_user_pwd(&auth, user, passwd);
    httpauth_set_realm_nonce(&auth, infos.realm, infos.nonce, cnonce);
    httpauth_get_response(&auth, cmd, "/cas/casrs/operator/test", infos.qop, response);
    
    scnprintf(authorization, sizeof(authorization), "Authorization: Digest username=\"%s\", "
        "realm=\"%s\", nonce=\"%s\", uri=\"/cas/casrs/operator/test\", "
        "response=\"%s\", qop=%s, nc=00000001, cnonce=\"%s\"", user,
        infos.realm, infos.nonce, response, infos.qop, cnonce);
    headers = curl_slist_append(headers, "accept: application/xml");
    headers = curl_slist_append(headers, host);
    headers = curl_slist_append(headers, "Connection: Keep-Alive");
    headers = curl_slist_append(headers, "User-Agent: Apache-HttpClient/4.1 (java 1.5)");
    headers = curl_slist_append(headers, cookie);
    headers = curl_slist_append(headers, "Cookie2: $Version=1");
    headers = curl_slist_append(headers, authorization);
    
    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 5);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        res_code = curl_easy_perform(curl);
        if (CURLE_OK != res_code) {
            clog_err("ds_connect_userpwd_author fail, res: %d", res_code);
            res = false;
            goto exit;
        }

        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &rsp);
        if (204 != rsp) {
            clog_err("ds_connect_userpwd_author get other response: %d", rsp);
            res = false;
            goto exit;
        }
    }
exit:
    curl_easy_cleanup(curl_unauth);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    return res;
}

/**
 * Description: make store pool info
 *       Input: char *pool_type
 *              const char *path
 *      Output: None
 *      Return: if success return cJSON result, else return NULL
 */
static void ds_make_store_pool_result(const char *pool_type, const char *path, cJSON **result)
{
    cJSON *jpool = NULL;
    char *restr = NULL;
    
    *result = cJSON_CreateObject();
    if (!(*result)) {
        clog_out_of_memory();
        return;
    }

    jpool = cJSON_CreateObject();
    if (!(jpool)) {
        clog_out_of_memory();
        cJSON_Delete(*result);
        *result = NULL;
        return;
    }
    
    cJSON_AddStringToObject(jpool, "type", pool_type);
    cJSON_AddStringToObject(jpool, "target-path", path);
    cJSON_AddItemToObject(*result, "pool", jpool);
    restr = cJSON_PrintUnformatted(*result);

    /* result string will be freed by the server */
    clog_debug("ds_make_store_pool_info result: %s", restr);
    free(restr);
}

/**
 * Description: make store pool info
 *       Input: char *pool_type
 *              const char *name
 *              const char *path
 *      Output: cJSON **result
 *      Return: if success return cvd_success, else return fail
 */
int ds_parse_store_pool_by_xml(char *pool_xml, cJSON **result)
{
    int res = CVD_EC_OK;
    char *xml_head = NULL;
    char *xml_root = NULL;
    char *xml_name = NULL;
    char *xml_target = NULL;
    char *xml_path = NULL;
    const char *pool_type = NULL;
    const char *path = NULL;

    xml_root = cvd_opaque_string2xml2(pool_xml, &xml_head);
    if (!xml_root) {
        clog_err("string2xml failed, xml:%s", pool_xml);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    pool_type = cvd_get_node_attr(xml_root, "type");
    if (!pool_type) {
        clog_err("failed to get store type, xml:%s", pool_xml);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    xml_name = cvd_find_xml_node(xml_root, "name", NULL, NULL);
    if (!xml_name) {
        clog_err("failed to get store name, xml:%s", pool_xml);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    xml_target = cvd_find_xml_node(xml_root, "target", NULL, NULL);
    if (!xml_target) {
        clog_err("failed to get target node, xml:%s", pool_xml);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    xml_path = cvd_find_xml_node(xml_target, "path", NULL, NULL);
    if (!xml_path) {
        clog_err("failed to get target path, xml:%s", pool_xml);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    path = cvd_get_node_opaque_value(xml_path);
    if (!path || path[0] == '\0') {
        clog_err("target path empty, xml:%s", pool_xml);
        res = CVD_EC_FAILURE;
        goto exit;
    }

    ds_make_store_pool_result(pool_type, path, result);
    
exit:
    if (xml_head) {
        cvd_del_xml_node(xml_head);
        xml_head = NULL;
    }
    
    return res;
}

/**
 * Description: Try to open a new libvirt connection.
 *       Input: void
 *      Output: None
 *      Return: A non-NULL virConnectPtr on success;
 *              NULL on failure
 */
virConnectPtr ds_virtconnpool_open_conn(void)
{
    virConnectPtr conn = NULL;

    if (virInitialize() < 0) {
        clog_err("virInitialize failed");
        return conn;
    }

    /* register default libvirt event implement */
    if (virEventRegisterDefaultImpl() < 0) {
        clog_err("failed to register default event implementation");
        return conn;
    }
    
    if (0 != setenv("LIBVIRT_CONNECT_OPEN_TIMEOUT", "10", 1)) {
        clog_warn("Failed to set environment variable for libvirtd");
    }

    conn = virConnectOpen(NULL);
    if (conn) {
        if (virConnectSetKeepAlive(conn, 10, 6) < 0) {
            clog_err("Failed to set keep-alive option for libvirt connection");
            ds_virtconnpool_close_conn(&conn);
        }
    }
    
    return conn;
}

/**
 * Description: Check if the connection is alive or dead
 *       Input: virConnectPtr *conn      the connection to be checked
 *      Output: None
 *      Return: true if it's alive;
 *              false if not
 */
bool ds_virtconnpool_is_conn_alive(virConnectPtr *conn)
{
    if (*conn) {
        unsigned long hy_ver = 0;

        if (0 == virConnectGetVersion(*conn, &hy_ver)) {
            return true;
        }

        ds_virtconnpool_close_conn(conn);
    }

    return false;
}

/**
 * Description: Close libvirt connection.
 *       Input: void
 *      Output: None
 *      Return: A non-NULL virConnectPtr on success;
 *              NULL on failure
 */
void ds_virtconnpool_close_conn(virConnectPtr *conn)
{
    if (*conn) {
        virConnectClose(*conn);
        *conn = NULL;
    }
}

/**
 * Description: Check if ipv4 is legal
 *       Input: None
 *      Output: None
 *      Return: true if success, false if error
 */
bool ds_ip_is_legal(const char *ip_addr)
{
    bool res = false;
    int ret = 0;
    struct in_addr addr_in4;

    if (ip_addr) {
        ret = inet_pton(AF_INET, ip_addr, (void*)&addr_in4);
        if (ret > 0) {/* judge IPv4 address legitimacy */
            res = true;
        }
    }

    return res;
}

/**
 * Description: Check if ipv6 is legal
 *       Input: None
 *      Output: None
 *      Return: true if success, false if error
 */
bool ds_ipv6_is_legal(const char *ip_addr)
{
    bool res = false;
    int ret = 0;
    struct in6_addr addr_in6;

    if (ip_addr) {
        ret = inet_pton(AF_INET6, ip_addr, (void*)&addr_in6);
        if (ret > 0) {/* judge IPv6 address legitimacy */
            res = true;
        }
    }

    return res;
}


/**
 * Description: Get cvm ip
 *       Input: None
 *      Output: char **cvmip
 *      Return: 0 if success, otherwise error code
 */
int ds_get_cvmip(char *cvmip)
{
    FILE *fp = NULL;
    char *file_path = "/etc/cvk/cvm_info.conf";
    char buff_line[DS_CHAR_LEN] = {0};
    char line_name[DS_NAME_LEN] = {0};
    char *line_value = NULL;
    
    fp = fopen(file_path, "r+");
    if (!fp) {
        clog_err("Failed to open file:%s", file_path);
        return CVD_EC_FAILURE;
    }

    while (NULL != fgets(buff_line, DS_CHAR_LEN, fp)) {
        if ('\n' == buff_line[(strlen(buff_line) - 1)]) {
            buff_line[(strlen(buff_line) - 1)] = '\0';
        }

        sscanf(buff_line, "%[^=]", line_name);

        line_value = strstr(buff_line, "=");
        if (!line_value || ('\0' == *line_value)) {
            continue;
        }
        line_value++;

        if (0 == strcmp(line_name, "address")) {
            scnprintf(cvmip, DS_IP_LEN, "%s", line_value);
            break;
        }
    }

    fclose(fp);
    fp = NULL;

    if (!ds_ip_is_legal(cvmip) && !ds_ipv6_is_legal(cvmip)) {
        clog_err("cvm info ip address inlegal.");
        return CVD_EC_FAILURE;
    }

    return CVD_EC_OK;
}

/**
 * Description: make connect result
 *       Input: None
 *      Output: cJSON **result
 *      Return: None
 */
void ds_make_connect_result(cJSON **result)
{
    cJSON *jversion = NULL;
    int maj_value = 0;
    int min_value = 0;
    int mic_value = 0;
        
    *result = cJSON_CreateObject();
    if (!(*result)) {
        clog_out_of_memory();
        return;
    }

    jversion = cJSON_CreateObject();
    if (!(jversion)) {
        clog_out_of_memory();
        cJSON_Delete(*result);
        *result = NULL;
        return;
    }
    
    sscanf(VERSION, "%d.%d.%d", &maj_value, &min_value, &mic_value);

    cJSON_AddNumberToObject(jversion, "major", maj_value);
    cJSON_AddNumberToObject(jversion, "minor", min_value);
    cJSON_AddNumberToObject(jversion, "micro", mic_value);
    cJSON_AddItemToObject(*result, "version", jversion);
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
