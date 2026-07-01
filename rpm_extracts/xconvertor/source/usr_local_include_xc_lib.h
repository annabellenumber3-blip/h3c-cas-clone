/* -*- mode: c; c-basic-offset: 8; -*-
 * vim: noexpandtab sw=8 ts=8 sts=0:
 *
 * xc_lib.h
 *
 *
 *
 * Copyright (C) 2021 H3C.  All rights reserved.
 */

#ifndef CAS_XC_LIB_H_
#define CAS_XC_LIB_H_

typedef struct XcImageState *XcImageState;
typedef struct XcVixDiskParams *XcVixDiskParams;
typedef struct XcVixConnection *XcVixConnection;

typedef struct {
    char *hostip;
    char *username;
    char *password;
    char *thumbprint;
    int port;
    char *vmxspec;
    char *ssmoref;
} XcVixConnectParams;

typedef struct {
    uint64_t capacity;                  // total capacity in sectors
    int numLinks;                      // number of links (i.e. base disk + redo logs)
    char *parentFileNameHint;          // parent file for a redo log
    char *uuid;                        // disk UUID
}XcVixDiskInfo;

typedef enum {
    XC_COPY_THIN_MODE       = 0x1,
    XC_COPY_THICK_MODE      = 0x2,
}XcRequestFlags;

int xc_init(void);
void xc_exit(void);

int xc_image_create(const char *filename, const char *fmt,
                       const char *base_filename, const char *base_fmt,
                       char *options, uint64_t image_size);
int xc_open_image(const char *filename, const char *fmt,
                            int oflags, XcImageState *xis);
void xc_close_image(XcImageState xis);
int xc_img_set_wio_throttle(XcImageState xis, uint64_t bps_wr, uint64_t iops_wr);

int xc_vixdisk_connect(XcVixConnection *vixconnection,
                        const XcVixConnectParams *vixparams);
void xc_vixdisk_disconnect(XcVixConnection vixconnection);
int xc_vixdisk_do_copy(XcVixDiskParams srcdisk,
                    XcImageState destdisk, uint64_t offset,
                    uint64_t bytes, int flags);
int xc_vixdisk_read(XcVixDiskParams diskparams,
            uint64_t sector_num, uint64_t nb_sectors, uint8_t *buffer);
int xc_vixdisk_query_allocated_blocks(XcVixDiskParams vixdisk,
            XcImageState xcdisk, uint64_t sector_num, uint64_t nb_sectors,
            int (*docopy)(
                XcVixDiskParams vixdisk,
                XcImageState xcdisk,
                uint64_t sector_num,
                uint64_t nb_sectors));
int xc_vixdisk_open(const XcVixConnection vixconnection,
                const char *filename,
                uint32_t oflags,
                XcVixDiskParams *diskparams);
int xc_vixdisk_close(XcVixDiskParams diskparams);
int xc_vixdisk_getinfo(XcVixDiskParams diskparams, XcVixDiskInfo *diskinfo);
int xc_vixdisklib_init(void);
void xc_vixdisklib_exit(void);

enum {
    XC_OK                                           = 0,
    XC_E_NOMEM                                      = 9001,
    XC_E_FAIL                                       = 9002,
    XC_E_CREATE_FAIL                                = 9003,
    XC_E_OPEN_FAIL                                  = 9004,
    XC_E_IO                                         = 9005,
    XC_E_SET_THROTTLE                               = 9006,

    /* VIX General errors */
    XC_VIX_E_FAIL                                   = 1,
    XC_VIX_E_OUT_OF_MEMORY                          = 2,
    XC_VIX_E_INVALID_ARG                            = 3,
    XC_VIX_E_FILE_NOT_FOUND                         = 4,
    XC_VIX_E_OBJECT_IS_BUSY                         = 5,
    XC_VIX_E_NOT_SUPPORTED                          = 6,
    XC_VIX_E_FILE_ERROR                             = 7,
    XC_VIX_E_DISK_FULL                              = 8,
    XC_VIX_E_INCORRECT_FILE_TYPE                    = 9,
    XC_VIX_E_CANCELLED                              = 10,
    XC_VIX_E_FILE_READ_ONLY                         = 11,
    XC_VIX_E_FILE_ALREADY_EXISTS                    = 12,
    XC_VIX_E_FILE_ACCESS_ERROR                      = 13,
    XC_VIX_E_REQUIRES_LARGE_FILES                   = 14,
    XC_VIX_E_FILE_ALREADY_LOCKED                    = 15,
    XC_VIX_E_VMDB                                   = 16,
    XC_VIX_E_NOT_SUPPORTED_ON_REMOTE_OBJECT         = 20,
    XC_VIX_E_FILE_TOO_BIG                           = 21,
    XC_VIX_E_FILE_NAME_INVALID                      = 22,
    XC_VIX_E_ALREADY_EXISTS                         = 23,
    XC_VIX_E_BUFFER_TOOSMALL                        = 24,
    XC_VIX_E_OBJECT_NOT_FOUND                       = 25,
    XC_VIX_E_HOST_NOT_CONNECTED                     = 26,
    XC_VIX_E_INVALID_UTF8_STRING                    = 27,
    XC_VIX_E_OPERATION_ALREADY_IN_PROGRESS          = 31,
    XC_VIX_E_UNFINISHED_JOB                         = 29,
    XC_VIX_E_NEED_KEY                               = 30,
    XC_VIX_E_LICENSE                                = 32,
    XC_VIX_E_VM_HOST_DISCONNECTED                   = 34,
    XC_VIX_E_AUTHENTICATION_FAIL                    = 35,
    XC_VIX_E_HOST_CONNECTION_LOST                   = 36,
    XC_VIX_E_DUPLICATE_NAME                         = 41,
    XC_VIX_E_ARGUMENT_TOO_BIG                       = 44,

    /* VIX Handle Errors */
    XC_VIX_E_INVALID_HANDLE                         = 1000,
    XC_VIX_E_NOT_SUPPORTED_ON_HANDLE_TYPE           = 1001,
    XC_VIX_E_TOO_MANY_HANDLES                       = 1002,

    /* VIX Completion Errors */
    XC_VIX_E_BAD_VM_INDEX                           = 8000,

    /* VIX Message errors */
    XC_VIX_E_INVALID_MESSAGE_HEADER                 = 10000,
    XC_VIX_E_INVALID_MESSAGE_BODY                   = 10001,

    /* VIX Disklib errors */
    XC_VIX_E_DISK_INVAL                             = 16000,
    XC_VIX_E_DISK_NOINIT                            = 16001,
    XC_VIX_E_DISK_NOIO                              = 16002,
    XC_VIX_E_DISK_PARTIALCHAIN                      = 16003,
    XC_VIX_E_DISK_NEEDSREPAIR                       = 16006,
    XC_VIX_E_DISK_OUTOFRANGE                        = 16007,
    XC_VIX_E_DISK_CID_MISMATCH                      = 16008,
    XC_VIX_E_DISK_CANTSHRINK                        = 16009,
    XC_VIX_E_DISK_PARTMISMATCH                      = 16010,
    XC_VIX_E_DISK_UNSUPPORTEDDISKVERSION            = 16011,
    XC_VIX_E_DISK_OPENPARENT                        = 16012,
    XC_VIX_E_DISK_NOTSUPPORTED                      = 16013,
    XC_VIX_E_DISK_NEEDKEY                           = 16014,
    XC_VIX_E_DISK_NOKEYOVERRIDE                     = 16015,
    XC_VIX_E_DISK_NOTENCRYPTED                      = 16016,
    XC_VIX_E_DISK_NOKEY                             = 16017,
    XC_VIX_E_DISK_INVALIDPARTITIONTABLE             = 16018,
    XC_VIX_E_DISK_NOTNORMAL                         = 16019,
    XC_VIX_E_DISK_NOTENCDESC                        = 16020,
    XC_VIX_E_DISK_NEEDVMFS                          = 16022,
    XC_VIX_E_DISK_RAWTOOBIG                         = 16024,
    XC_VIX_E_DISK_TOOMANYOPENFILES                  = 16027,
    XC_VIX_E_DISK_TOOMANYREDO                       = 16028,
    XC_VIX_E_DISK_RAWTOOSMALL                       = 16029,
    XC_VIX_E_DISK_INVALIDCHAIN                      = 16030,
    XC_VIX_E_DISK_KEY_NOTFOUND                      = 16052,
    XC_VIX_E_DISK_SUBSYSTEM_INIT_FAIL               = 16053,
    XC_VIX_E_DISK_INVALID_CONNECTION                = 16054,
    XC_VIX_E_DISK_ENCODING                          = 16061,
    XC_VIX_E_DISK_CANTREPAIR                        = 16062,
    XC_VIX_E_DISK_INVALIDDISK                       = 16063,
    XC_VIX_E_DISK_NOLICENSE                         = 16064,
    XC_VIX_E_DISK_NODEVICE                          = 16065,
    XC_VIX_E_DISK_UNSUPPORTEDDEVICE                 = 16066,
    XC_VIX_E_DISK_CAPACITY_MISMATCH                 = 16067,
    XC_VIX_E_DISK_PARENT_NOTALLOWED                 = 16068,
    XC_VIX_E_DISK_ATTACH_ROOTLINK                   = 16069,

    /* VIX Remoting Errors. */
    XC_VIX_E_CANNOT_CONNECT_TO_HOST                 = 18000,
    XC_VIX_E_NOT_FOR_REMOTE_HOST                    = 18001,
    XC_VIX_E_INVALID_HOSTNAME_SPECIFICATION         = 18002,

    /* Guest Errors */
    XC_VIX_E_GUEST_VOLUMES_NOT_FROZEN               = 20000,
    XC_VIX_E_NOT_A_FILE                             = 20001,
    XC_VIX_E_NOT_A_DIRECTORY                        = 20002,
    XC_VIX_E_NO_SUCH_PROCESS                        = 20003,
    XC_VIX_E_FILE_NAME_TOO_LONG                     = 20004,
    XC_VIX_E_OPERATION_DISABLED                     = 20005,

    /* VIX Wrapper Errors */
    XC_VIX_E_WRAPPER_WORKSTATION_NOT_INSTALLED      = 22001,
    XC_VIX_E_WRAPPER_VERSION_NOT_FOUND              = 22002,
    XC_VIX_E_WRAPPER_SERVICEPROVIDER_NOT_FOUND      = 22003,
    XC_VIX_E_WRAPPER_PLAYER_NOT_INSTALLED           = 22004,
    XC_VIX_E_WRAPPER_RUNTIME_NOT_INSTALLED          = 22005,
    XC_VIX_E_WRAPPER_MULTIPLE_SERVICEPROVIDERS      = 22006,

    /* VIX Success on operation that completes asynchronously */
    XC_VIX_ASYNC                                    = 25000,

    /* VIX Async errors */
    XC_VIX_E_ASYNC_MIXEDMODE_UNSUPPORTED            = 26000,

    /* VIX Network Errors */
    XC_VIX_E_NET_HTTP_UNSUPPORTED_PROTOCOL     = 30001,
    XC_VIX_E_NET_HTTP_URL_MALFORMAT            = 30003,
    XC_VIX_E_NET_HTTP_COULDNT_RESOLVE_PROXY    = 30005,
    XC_VIX_E_NET_HTTP_COULDNT_RESOLVE_HOST     = 30006,
    XC_VIX_E_NET_HTTP_COULDNT_CONNECT          = 30007,
    XC_VIX_E_NET_HTTP_HTTP_RETURNED_ERROR      = 30022,
    XC_VIX_E_NET_HTTP_OPERATION_TIMEDOUT       = 30028,
    XC_VIX_E_NET_HTTP_SSL_CONNECT_ERROR        = 30035,
    XC_VIX_E_NET_HTTP_TOO_MANY_REDIRECTS       = 30047,
    XC_VIX_E_NET_HTTP_TRANSFER                 = 30200,
    XC_VIX_E_NET_HTTP_SSL_SECURITY             = 30201,
    XC_VIX_E_NET_HTTP_GENERIC                  = 30202,
};

#endif /* CAS_XC_LIB_H_ */
