/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: cli.c
    Description: command line interface of CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-06-03
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <getopt.h>
#include <errno.h>
#include <czmq.h>
#include "cjson.h"
#include "cvd_defines.h"
#include "cvd_error.h"
#include "sdk_client.h"
#include "cutil.h"

static int cli_set_loglevel(int argc, char **argv);
static int cli_set_max_client_num(int argc, char **argv);
static int cli_connect(int argc, char **argv);
static int cli_query_storage_pool(int argc, char **argv);
static int cli_set_transport_channel(int argc, char **argv);
static int cli_release_transport_channel(int argc, char **argv);

struct cli_cmd_t {
    const char *name;
    int (*handler)(int argc, char **argv);
};

static struct cli_cmd_t g_cmds[] = {
    {"set-loglevel", cli_set_loglevel},
    {"set-max-client-num", cli_set_max_client_num},
    {"connect", cli_connect},
    {"query-storage-pool", cli_query_storage_pool},
    {"set-transport-channel", cli_set_transport_channel},
    {"release-transport-channel", cli_release_transport_channel},
    {NULL, NULL},
};

static int g_cvd_server_port = CVD_SERVER_DEFAULT_PORT;
static void cli_help(void)
{
    const char *help_msg =
           "usage: cvd-cli command [command options]\n"
           "CAS Virtual Disk Development Service utility\n"
           "\n"
           "    '-h', '--help'       display this help and exit\n"
           "    '-p <port>'          specify the port to connect cvd-ds\n"
           "\n"
           "Command syntax:\n"
           "  set-loglevel -l loglevel\n"
           "  set-max-client-num -n num\n"
           "  connect -u username -p password [-d domain]\n"
           "  query-storage-pool -i image\n"
           "  set-transport-channel [-m mode] -i image [-s snap] [-f flag]\n"
           "  release-transport-channel -i image [-s snap] -p port\n"
           "\n"
           "Command parameters:\n"
           "  'image' is a full path filename\n"
           "  'snap' is a snapshot name of image\n"
           "\n"
           "Parameters to set-loglevel subcommand:\n"
           "  'loglevel' is the log level of cvd-ds, valid options are: 'debug', 'info', 'warn' and 'error'\n"
           "\n"
           "Parameters to set-max-client-num subcommand:\n"
           "  'num' is the max client number cvd-ds can serve\n"
           "\n"
           "Parameters to connect subcommand:\n"
           "  'domain' is a libvirt domain name\n"
           "\n"
           "Parameters to set-transport-channel subcommand:\n"
           "  'mode' is transport mode, 1: lan based; 2: lan free\n"
           "  'flag' is used to control how to export, 0: read write, 1: read only\n"
           "\n"
           "Parameters to release-transport-channel subcommand:\n"
           "  'port' is qemu-nbd export port\n";

    printf("%s\n", help_msg);
    exit(EXIT_SUCCESS);
}

static void cli_missing_argument(const char *option)
{
    fprintf(stderr, "missing argument for option '%s'\n", option);
    abort();
}

static void cli_unrecognized_option(const char *option)
{
    fprintf(stderr, "unrecognized option '%s'\n", option);
    abort();
}

static cJSON *cli_make_jrpc(const char *method, cJSON **jparam)
{
    cJSON *jroot = NULL;
    jroot = cJSON_CreateObject();
    cJSON_AddStringToObject(jroot, "jsonrpc", "2.0");
    cJSON_AddNumberToObject(jroot, "id", 12345);
    cJSON_AddStringToObject(jroot, "method", method);
    *jparam = cJSON_CreateObject();
    cJSON_AddItemToObject(jroot, "params", *jparam);
    return jroot;
}

static char *cli_make_set_loglevel_request(const char *loglevel)
{
    char *request = NULL;
    cJSON *jparam = NULL;
    cJSON *jroot = cli_make_jrpc("set-loglevel", &jparam);
    cJSON_AddStringToObject(jparam, "loglevel", loglevel);
    request = cJSON_PrintUnformatted(jroot);
    cJSON_Delete(jroot);
    return request;
}

static int cli_set_loglevel(int argc, char **argv)
{
    int rc = 0;
    void *sock = NULL;
    const char *loglevel = NULL;
    char *request = NULL;
    char *response = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {"loglevel", required_argument, 0, 'l'},
        {0, 0, 0, 0},
    };

    while ((c = getopt_long(argc, argv, ":hl:", long_options, NULL)) != -1) {
        switch (c) {
        case ':':
            cli_missing_argument(argv[optind - 1]);
            break;
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            break;
        case 'h':
            cli_help();
            break;
        case 'l':
            loglevel = optarg;
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            break;
        }
    }

    if (!loglevel) {
        fprintf(stderr, "missing option 'loglevel'\n");
        return EINVAL;
    }

    if ((0 != strcmp(loglevel, "debug")) && (0 != strcmp(loglevel, "info")) &&
        (0 != strcmp(loglevel, "warn")) && (0 != strcmp(loglevel, "error"))) {
        fprintf(stderr, "invalid option 'loglevel': %s\n", loglevel);
        return EINVAL;
    }

    rc = sdk_client_connect("localhost", g_cvd_server_port, &sock);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "connect localhost:%d failed with error code %d\n", g_cvd_server_port, rc);
        return ENOTCONN;
    }

    request = cli_make_set_loglevel_request(loglevel);
    rc = sdk_client_request(sock, request, &response);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "request: %s, failed with error code: %d\n", request, rc);
        free(request);
        free(response);
        return EAGAIN;
    }

    fprintf(stdout, "%s\n", response);
    
    sdk_client_disconnect(&sock);
    free(request);
    free(response);
    return 0;
}

static char *cli_make_set_max_client_num_request(const char *num)
{
    char *request = NULL;
    cJSON *jparam = NULL;
    cJSON *jroot = cli_make_jrpc("set-max-client-num", &jparam);
    cJSON_AddNumberToObject(jparam, "num", atoi(num));
    request = cJSON_PrintUnformatted(jroot);
    cJSON_Delete(jroot);
    return request;
}

static bool cli_isdigit(const char *str)
{
    size_t len = 0;
    size_t i = 0;
    len = strlen(str);

    if (len == 0) {
        return false;
    }
    
    for (i = 0; i < len; ++i) {
        if (!isdigit(str[i])) {
            return false;
        }
    }
    return true;
}

static int cli_set_max_client_num(int argc, char **argv)
{
    int rc = 0;
    void *sock = NULL;
    const char *num = NULL;
    char *request = NULL;
    char *response = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {"num", required_argument, 0, 'n'},
        {0, 0, 0, 0},
    };

    while ((c = getopt_long(argc, argv, ":hn:", long_options, NULL)) != -1) {
        switch (c) {
        case ':':
            cli_missing_argument(argv[optind - 1]);
            break;
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            break;
        case 'h':
            cli_help();
            break;
        case 'n':
            num = optarg;
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            break;
        }
    }

    if (!num) {
        fprintf(stderr, "missing option 'num'\n");
        return EINVAL;
    }

    if (!cli_isdigit(num)) {
        fprintf(stderr, "invalid option 'num': %s\n", num);
        return EINVAL;
    }

    rc = sdk_client_connect("localhost", g_cvd_server_port, &sock);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "connect localhost:%d failed with error code %d\n", g_cvd_server_port, rc);
        return ENOTCONN;
    }

    request = cli_make_set_max_client_num_request(num);
    rc = sdk_client_request(sock, request, &response);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "request: %s, failed with error code: %d\n", request, rc);
        free(request);
        free(response);
        return EAGAIN;
    }

    fprintf(stdout, "%s\n", response);
    
    sdk_client_disconnect(&sock);
    free(request);
    free(response);
    return 0;
}

static char *cli_make_connect_request(const char *user, const char *password, const char *domain)
{
    char *request = NULL;
    cJSON *jparam = NULL;
    cJSON *jroot = cli_make_jrpc("connect", &jparam);
    cJSON_AddStringToObject(jparam, "username", user);
    cJSON_AddStringToObject(jparam, "passwd", password);
    if (domain) {
        cJSON_AddStringToObject(jparam, "vmname", domain);
    }
    request = cJSON_PrintUnformatted(jroot);
    cJSON_Delete(jroot);
    return request;
}

static int cli_connect(int argc, char **argv)
{
    int rc = 0;
    void *sock = NULL;
    const char *user = NULL;
    const char *password = NULL;
    const char *domain = NULL;
    char *request = NULL;
    char *response = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {"user", required_argument, 0, 'u'},
        {"password", required_argument, 0, 'p'},
        {"domain", required_argument, 0, 'd'},
        {0, 0, 0, 0},
    };

    while ((c = getopt_long(argc, argv, ":hu:p:d:", long_options, NULL)) != -1) {
        switch (c) {
        case ':':
            cli_missing_argument(argv[optind - 1]);
            break;
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            break;
        case 'h':
            cli_help();
            break;
        case 'u':
            user = optarg;
            break;
        case 'p':
            password = optarg;
            break;
        case 'd':
            domain = optarg;
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            break;
        }
    }

    if (!user) {
        fprintf(stderr, "missing option 'user'\n");
        return EINVAL;
    }
    if (!password) {
        fprintf(stderr, "missing option 'password'\n");
        return EINVAL;
    }

    rc = sdk_client_connect("localhost", g_cvd_server_port, &sock);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "connect localhost:%d failed with error code %d\n", g_cvd_server_port, rc);
        return ENOTCONN;
    }

    request = cli_make_connect_request(user, password, domain);
    rc = sdk_client_request(sock, request, &response);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "request: %s, failed with error code: %d\n", request, rc);
        free(request);
        free(response);
        return EAGAIN;
    }

    fprintf(stdout, "%s\n", response);
    
    sdk_client_disconnect(&sock);
    free(request);
    free(response);
    return 0;
}

static char *cli_make_query_storage_pool_request(const char *image)
{
    char *request = NULL;
    cJSON *jparam = NULL;
    cJSON *jroot = cli_make_jrpc("query-storage-pool", &jparam);
    cJSON_AddStringToObject(jparam, "virtual-disk", image);
    request = cJSON_PrintUnformatted(jroot);
    cJSON_Delete(jroot);
    return request;
}

static int cli_query_storage_pool(int argc, char **argv)
{
    int rc = 0;
    void *sock = NULL;
    const char *image = NULL;
    char *request = NULL;
    char *response = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {"image", required_argument, 0, 'i'},
        {0, 0, 0, 0},
    };

    while ((c = getopt_long(argc, argv, ":hi:", long_options, NULL)) != -1) {
        switch (c) {
        case ':':
            cli_missing_argument(argv[optind - 1]);
            break;
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            break;
        case 'h':
            cli_help();
            break;
        case 'i':
            image = optarg;
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            break;
        }
    }

    if (!image) {
        fprintf(stderr, "missing option 'image'\n");
        return EINVAL;
    }

    rc = sdk_client_connect("localhost", g_cvd_server_port, &sock);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "connect localhost:%d failed with error code %d\n", g_cvd_server_port, rc);
        return ENOTCONN;
    }

    request = cli_make_query_storage_pool_request(image);
    rc = sdk_client_request(sock, request, &response);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "request: %s, failed with error code: %d\n", request, rc);
        free(request);
        free(response);
        return EAGAIN;
    }

    fprintf(stdout, "%s\n", response);
    
    sdk_client_disconnect(&sock);
    free(request);
    free(response);
    return 0;
}

static char *cli_make_set_transport_channel_request(
             const char *mode, const char *image, const char *snap, const char *flag)
{
    char *request = NULL;
    cJSON *jparam = NULL;
    cJSON *jroot = cli_make_jrpc("set-transport-channel", &jparam);
    cJSON_AddNumberToObject(jparam, "mode", mode ? atoi(mode) : 1);
    cJSON_AddStringToObject(jparam, "virtual-disk", image);
    if (snap) {
        cJSON_AddStringToObject(jparam, "snapshot-name", snap);
    }
    cJSON_AddNumberToObject(jparam, "flag", flag ? atoi(flag) : 0);
    request = cJSON_PrintUnformatted(jroot);
    cJSON_Delete(jroot);
    return request;
}
static int cli_set_transport_channel(int argc, char **argv)
{
    int rc = 0;
    void *sock = NULL;
    const char *mode = NULL;
    const char *image = NULL;
    const char *snap = NULL;
    const char *flag = NULL;
    char *request = NULL;
    char *response = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {"mode", required_argument, 0, 'm'},
        {"image", required_argument, 0, 'i'},
        {"snap", required_argument, 0, 's'},
        {"flag", required_argument, 0, 'f'},
        {0, 0, 0, 0},
    };

    while ((c = getopt_long(argc, argv, ":hu:p:d:", long_options, NULL)) != -1) {
        switch (c) {
        case ':':
            cli_missing_argument(argv[optind - 1]);
            break;
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            break;
        case 'h':
            cli_help();
            break;
        case 'm':
            mode = optarg;
            break;
        case 'i':
            image = optarg;
            break;
        case 's':
            snap = optarg;
            break;
        case 'f':
            flag = optarg;
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            break;
        }
    }

    if (!image) {
        fprintf(stderr, "missing option 'image'\n");
        return EINVAL;
    }
    if (mode && (strlen(mode) != 1) && ((mode[0] != '1') || (mode[0] != '2'))) {
        fprintf(stderr, "invalid option 'mode': %s\n", mode);
        return EINVAL;
    }

    if (flag && (strlen(flag) != 1) && ((flag[0] != '0') || (flag[0] != '1'))) {
        fprintf(stderr, "invalid option 'flag': %s\n", flag);
        return EINVAL;
    }

    rc = sdk_client_connect("localhost", g_cvd_server_port, &sock);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "connect localhost:%d failed with error code %d\n", g_cvd_server_port, rc);
        return ENOTCONN;
    }

    request = cli_make_set_transport_channel_request(mode, image, snap, flag);
    rc = sdk_client_request(sock, request, &response);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "request: %s, failed with error code: %d\n", request, rc);
        free(request);
        free(response);
        return EAGAIN;
    }

    fprintf(stdout, "%s\n", response);
    
    sdk_client_disconnect(&sock);
    free(request);
    free(response);
    return 0;
}

static char *cli_make_release_transport_channel_request(
             const char *image, const char *snap, const char *port)
{
    char *request = NULL;
    cJSON *jparam = NULL;
    cJSON *jroot = cli_make_jrpc("release-transport-channel", &jparam);
    cJSON_AddStringToObject(jparam, "virtual-disk", image);
    if (snap) {
        cJSON_AddStringToObject(jparam, "snapshot-name", snap);
    }
    cJSON_AddNumberToObject(jparam, "port", atoi(port));
    request = cJSON_PrintUnformatted(jroot);
    cJSON_Delete(jroot);
    return request;
}

static int cli_release_transport_channel(int argc, char **argv)
{
    int rc = 0;
    void *sock = NULL;
    const char *image = NULL;
    const char *snap = NULL;
    const char *port = NULL;
    char *request = NULL;
    char *response = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {"image", required_argument, 0, 'i'},
        {"snap", required_argument, 0, 's'},
        {"port", required_argument, 0, 'p'},
        {0, 0, 0, 0},
    };

    while ((c = getopt_long(argc, argv, ":hu:p:d:", long_options, NULL)) != -1) {
        switch (c) {
        case ':':
            cli_missing_argument(argv[optind - 1]);
            break;
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            break;
        case 'h':
            cli_help();
            break;
        case 'i':
            image = optarg;
            break;
        case 's':
            snap = optarg;
            break;
        case 'p':
            port = optarg;
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            break;
        }
    }

    if (!image) {
        fprintf(stderr, "missing option 'image'\n");
        return EINVAL;
    }

    if (!port) {
        fprintf(stderr, "missing option 'port'\n");
        return EINVAL;
    }

    rc = sdk_client_connect("localhost", g_cvd_server_port, &sock);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "connect localhost:%d failed with error code %d\n", g_cvd_server_port, rc);
        return ENOTCONN;
    }

    request = cli_make_release_transport_channel_request(image, snap, port);
    rc = sdk_client_request(sock, request, &response);
    if (CVD_EC_OK != rc) {
        fprintf(stderr, "request: %s, failed with error code: %d\n", request, rc);
        free(request);
        free(response);
        return EAGAIN;
    }

    fprintf(stdout, "%s\n", response);
    
    sdk_client_disconnect(&sock);
    free(request);
    free(response);
    return 0;
}

/**
 * Description: main function
 *       Input: int argc
 *              char *argv[]
 *      Output: none
 *      Return:
 */
int main(int argc, char *argv[])
{
    int rc = 0;
    struct cli_cmd_t *cmd;
    const char *cmdname = NULL;
    int c = 0;
    static const struct option long_options[] = {
        {"help", no_argument, 0, 'h'},
        {0, 0, 0, 0}
    };

    if (argc == 1) {
        cli_help();
        return 0;
    }

    zsys_set_logstream(NULL);
    sdk_client_init();

    while ((c = getopt_long(argc, argv, "+:hp:", long_options, NULL)) != -1) {
        switch (c) {
        case '?':
            cli_unrecognized_option(argv[optind - 1]);
            goto exit;
        case 'h':
            cli_help();
            goto exit;
        case 'p':
            g_cvd_server_port = parse_port_param(argv[optind - 1]);
            break;
        default:
            cli_unrecognized_option(argv[optind - 1]);
            goto exit;
        }
    }

    cmdname = argv[optind];
    /* reset getopt_long scanning */
    argc -= optind;
    if (argc < 1) {
        goto exit;
    }
    argv += optind;
    optind = 0;

    for (cmd = g_cmds; cmd->name != NULL; cmd++) {
        if (0 == strcmp(cmdname, cmd->name)) {
            rc = cmd->handler(argc, argv);
            goto exit;
        }
    }
    
    fprintf(stderr, "Command not found: %s\n", cmdname);
    sdk_client_deinit();
    abort();
    
exit:
    sdk_client_deinit();
    return rc;
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
