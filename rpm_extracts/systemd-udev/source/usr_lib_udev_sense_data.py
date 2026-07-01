#!/usr/bin/env python
 
import sys
import os
import re
import ctypes
import fcntl
import string
 
MEET_NEWER_SAT = 0
wwn = ctypes.c_uint64()
 
BSG_PROTOCOL_SCSI = 0           # <linux/bsg.h>
BSG_SUB_PROTOCOL_SCSI_CMD = 0   # <linux/bsg.h>
 
SG_DXFER_FROM_DEV = -3      # SCSI READ command
 
ASCII_S = 83                # 'S'
ASCII_Q = 81                # 'Q'
SG_IO = 0x2285              # <scsi/sg.h>
 
 
"""
INQUIRY Command
https://www.seagate.com/files/staticfiles/support/docs/manual/Interface%20manuals/100293068j.pdf
3.6.1 Section
"""
 
 
class inquiry_cmd(ctypes.Structure):
    _pack_ = 1
    _fields_ = [
        ("opcode", ctypes.c_ubyte),
        ("reserved", ctypes.c_ubyte),
        ("pagecode", ctypes.c_ubyte),
        ("alloc_len_3", ctypes.c_ubyte),
        ("alloc_len_4", ctypes.c_ubyte),
        ("control", ctypes.c_ubyte)
    ]
 
 
"""
ATA PASS-THROUGH (12) command
https://www.t10.org/ftp/t10/document.04/04-262r8.pdf
13.2.2 Section
"""
 
 
class ata_cmd_12(ctypes.Structure):
    _pack_ = 1
    _fields_ = [
        ("opcode", ctypes.c_ubyte),
        ("protocol", ctypes.c_ubyte),
        ("flags", ctypes.c_ubyte),
        ("features", ctypes.c_ubyte),
        ("sector_count", ctypes.c_ubyte),
        ("lba_low", ctypes.c_ubyte),
        ("lba_mid", ctypes.c_ubyte),
        ("lba_high", ctypes.c_ubyte),
        ("device", ctypes.c_ubyte),
        ("command", ctypes.c_ubyte),
        ("reserved", ctypes.c_ubyte),
        ("control", ctypes.c_ubyte)
    ]
 
 
"""
ref: include/scsi/sg.h
"""
 
 
class sgio_hdr(ctypes.Structure):
    _pack_ = 1
    _fields_ = [
        # [i] 'S' for SCSI generic (required)
        ("interface_id", ctypes.c_int),
        ("dxfer_direction", ctypes.c_int),   # [i] data transfer direction
        # [i] SCSI command length ( <= 16 bytes)
        ("cmd_len", ctypes.c_ubyte),
        ("mx_sb_len", ctypes.c_ubyte),       # [i] max length to write to sbp
        ("iovec_count", ctypes.c_ushort),    # [i] 0 implies no scatter gather
        ("dxfer_len", ctypes.c_uint),        # [i] byte count of data transfer
        # [i], [*io] points to data transfer memory
        ("dxferp", ctypes.c_void_p),
        # [i], [*i] points to command to perform
        ("cmdp", ctypes.c_void_p),
        # [i], [*o] points to sense_buffer memory
        ("sbp", ctypes.c_void_p),
        # [i] MAX_UINT->no timeout (unit: millisec)
        ("timeout", ctypes.c_uint),
        ("flags", ctypes.c_uint),            # [i] 0 -> default, see SG_FLAG...
        # [i->o] unused internally (normally)
        ("pack_id", ctypes.c_int),
        ("usr_ptr", ctypes.c_void_p),        # [i->o] unused internally
        ("status", ctypes.c_ubyte),          # [o] scsi status
        ("masked_status", ctypes.c_ubyte),   # [o] shifted, masked scsi status
        # [o] messaging level data (optional)
        ("msg_status", ctypes.c_ubyte),
        # [o] byte count actually written to sbp
        ("sb_len_wr", ctypes.c_ubyte),
        ("host_status", ctypes.c_ushort),    # [o] errors from host adapter
        ("driver_status", ctypes.c_ushort),  # [o] errors from software driver
        # [o] dxfer_len - actual_transferred
        ("resid", ctypes.c_int),
        # [o] time taken by cmd (unit: millisec)
        ("duration", ctypes.c_uint),
        ("info", ctypes.c_uint)              # [o] auxiliary information
    ]
 
 
def from_bytes(bytes_in_array, byteorder="big", signed=False):
    if byteorder == "little":
        little_ordered = list(bytes_in_array)
    elif byteorder == "big":
        little_ordered = list(reversed(bytes_in_array))
    else:
        raise ValueError("byteorder must be either 'little' or 'big'")
 
    n = sum(b << i*8 for i, b in enumerate(little_ordered))
    if signed and little_ordered and (little_ordered[-1] & 0x80):
        n -= 1 << 8*len(little_ordered)
 
    return n
 
 
def disk_scsi_inquiry_command(dev, buf):
    sense = ctypes.c_buffer(32)
    buf_len = ctypes.sizeof(buf)
    cdb = inquiry_cmd(opcode=0x12,
                      reserved=0,
                      pagecode=0,
                      alloc_len_3=(buf_len >> 8),
                      alloc_len_4=(buf_len & 0xff),
                      control=0)
 
    # systemd first tries to identify the disk by version 4, but failed. We directly use version3
    io_hdr = sgio_hdr(interface_id=ASCII_S, dxfer_direction=SG_DXFER_FROM_DEV,
                      cmd_len=ctypes.sizeof(cdb),
                      mx_sb_len=ctypes.sizeof(sense), iovec_count=0,
                      dxfer_len=buf_len,
                      dxferp=ctypes.cast(buf, ctypes.c_void_p),
                      cmdp=ctypes.addressof(cdb),
                      sbp=ctypes.cast(sense, ctypes.c_void_p), timeout=30 * 1000,
                      flags=0, pack_id=0, usr_ptr=None, status=0, masked_status=0,
                      msg_status=0, sb_len_wr=0, host_status=0, driver_status=0,
                      resid=0, duration=0, info=0)
 
    try:
        with open(dev, "r") as fd:
            ret = fcntl.ioctl(fd.fileno(), SG_IO, io_hdr)
            if io_hdr.status != 0 or io_hdr.host_status != 0 or io_hdr.driver_status != 0 or ret != 0:
                return False
    except OSError as err:
        return False
    except IOError as err:
        return False
 
    return True
 
 
def disk_identify_command(dev, buf):
    global MEET_NEWER_SAT
    MEET_NEWER_SAT = 0
    sense = ctypes.c_buffer(32)
    buf_len = ctypes.sizeof(buf)
    cdb = ata_cmd_12(opcode=0xa1, protocol=(4 << 1), flags=0x2e,
                     features=0, sector_count=1, lba_low=0, lba_mid=0, lba_high=0,
                     device=0 & 0x4F, command=0xEC, reserved=0, control=0)
 
    # systemd first tries to identify the disk by version 4, but failed. We directly use version3
    io_hdr = sgio_hdr(interface_id=ASCII_S, dxfer_direction=SG_DXFER_FROM_DEV,
                     cmd_len=ctypes.sizeof(cdb),
                     mx_sb_len=ctypes.sizeof(sense), iovec_count=0,
                     dxfer_len=buf_len,
                     dxferp=ctypes.cast(buf, ctypes.c_void_p),
                     cmdp=ctypes.addressof(cdb),
                     sbp=ctypes.cast(sense, ctypes.c_void_p), timeout=30 * 1000,
                     flags=0, pack_id=0, usr_ptr=None, status=0, masked_status=0,
                     msg_status=0, sb_len_wr=0, host_status=0, driver_status=0,
                     resid=0, duration=0, info=0)
 
    try:
        with open(dev, "r") as fd:
            ret = fcntl.ioctl(fd.fileno(), SG_IO, io_hdr)
            if ret != 0:
                return False
    except OSError as err:
        return False
    except IOError as err:
        return False
 
    if sense[0] == b'\x72' and sense[8] == b'\x09' and sense[9] == b'\x0c':
        return True
 
    if sense[0] == b'\x70' and sense[12] == b'\x00' and sense[13] == b'\x1d':
        MEET_NEWER_SAT = 1
        return True
 
    return False
 
 
def disk_identify(dev):
    identify = ctypes.c_buffer(512)
    inquiry_buf = ctypes.c_buffer(36)
    ret = disk_scsi_inquiry_command(dev=dev, buf=inquiry_buf)
    if not ret:
        return False
 
    peripheral_device_type = from_bytes(
        bytearray(inquiry_buf[0]), byteorder="little") & 0x1f
    if peripheral_device_type == 0x05:
        return False
 
    if not (peripheral_device_type == 0x00 or peripheral_device_type == 0x14):
        return False
 
    if not disk_identify_command(dev=dev, buf=identify):
        return False
 
    global wwn
    wwn = ctypes.c_uint64()
    identify = bytearray(identify)
    wwn = from_bytes(
        [identify[108 * 2], identify[108 * 2 + 1]], byteorder="little")
    wwn = wwn << 16
    wwn |= from_bytes(
        [identify[109 * 2], identify[109 * 2 + 1]], byteorder="little")
    wwn = wwn << 16
    wwn |= from_bytes(
        [identify[110 * 2], identify[110 * 2 + 1]], byteorder="little")
    wwn = wwn << 16
    wwn |= from_bytes(
        [identify[111 * 2], identify[111 * 2 + 1]], byteorder="little")
 
    return True
 
 
def check_ata_disk():
    ret = False
 
    for filename in os.listdir("/dev/"):
        if not re.match("sd.*[^0-9]$|sr.*", filename):
            continue
 
        if not disk_identify("/dev/"+filename):
            continue
            
        global MEET_NEWER_SAT
        if MEET_NEWER_SAT == 0:
            continue
 
        for root, dirs, files in os.walk("/dev/disk/by-id/"):
            global wwn
            wwn_id = "wwn-0x%x" % wwn
            if wwn_id not in files:
                print("The wwn_id of device(%s) will change to 0x%x" %
                    ("/dev/"+filename, wwn))
                ret = True
 
    return ret
 
 
if __name__ == "__main__":
    # exit with "1" if there is at least one disk's wwn_id will change from scsi_id to ata_id
    if check_ata_disk():
        exit(1)
    exit(0)
