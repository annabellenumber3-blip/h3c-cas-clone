/*****************************************************************************
    Copyright (C) 2019 New H3C Technologies Inc.

    File: ds_main.c
    Description: main of CVD-DS(CAS Virtual Disk Development Service)
    Date: 2019-04-29
    Author: w14407

    History:
    Date        Name             Description
    --------------------------------------------------------------------------

*****************************************************************************/
#ifdef  __cplusplus
extern "C" {
#endif

#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include "cvd_defines.h"
#include "version.h"
#include "clog.h"
#include "csys.h"
#include "ds_server.h"
#include "ds_handle.h"
#include "ds_conf.h"
#include "cutil.h"

static char ds_name[CVD_MAX_NAME_LEN];
static char ds_pidfile[PATH_MAX];
static int ds_pidfile_fd = -1;

/**
 * Description: singal callback function
 *       Input: int signo  signal No.
 *      Output: none
 *      Return: none
 */
static void ds_server_signal_cb(int signo)
{
    clog_warn("cvd-ds got signal %d", signo);
    ds_server_stop_nowait();
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
    int opt;
    int rc = 0;
    bool set_daemon = true;
    int cvd_server_port = CVD_SERVER_DEFAULT_PORT;

    while ((opt = getopt(argc, argv, "dp:")) != -1) {
        switch (opt) {
        case 'd':
            set_daemon = false;
            break;
        case 'p':
            cvd_server_port = parse_port_param(optarg);
            break;
        default:
            break;
        }
    }
    if (set_daemon) {
        rc = csys_set_daemon();
        if (0 != rc) {
            return -1;
        }
    }

    snprintf(ds_name, sizeof(ds_name), "cvd-ds");
    snprintf(ds_pidfile, PATH_MAX, "/var/run/%s.pid", ds_name);
    rc = csys_check_daemon(ds_pidfile, &ds_pidfile_fd);
    if (0 != rc) {
        return -1;
    }

    /* do not modify the following module's init sequence unless you know what you are doing */
    rc = clog_init("/var/log/cvd/cvd-ds.log");
    if (0 != rc) {
        goto exit;
    }
    clog_enable_stdout(false);
    clog_set_level(CLOG_LEVEL_INFO);

    clog_info(SOFTWARE_VERSION " daemon %s started, build date: %s", ds_name, __DATE__);

    if (0 != csys_mkdir("/etc/cvd")) {
        clog_err("make config dir failed");
    }

    /* ds_conf_init must be called before ds_handle_init */
    ds_conf_init("/etc/cvd/cvd-ds.conf");
    
    ds_handle_init();
    
    ds_server_init();
    
    ds_server_set_handler(ds_handle_msg, ds_handle_peer_disconnect);

    csys_set_signal_callback(SIGINT, ds_server_signal_cb);
    csys_set_signal_callback(SIGTERM, ds_server_signal_cb);
    csys_set_signal_callback(SIGHUP, ds_server_signal_cb);

    /* loop here */
    ds_server_loop(cvd_server_port);

    ds_server_deinit();

    ds_handle_deinit();

    ds_conf_deinit();

    clog_info(SOFTWARE_VERSION " daemon %s exit", ds_name);
    clog_deinit();
exit:
    csys_stop_daemon(ds_pidfile, ds_pidfile_fd);
    return rc;
}

#ifdef  __cplusplus
}
#endif  /* end of __cplusplus */
