#ifndef _LINUX_BEAUTY_CPU_USAGE_H
#define _LINUX_BEAUTY_CPU_USAGE_H

struct beauty_cpu_usage_ctrlinfo
{
    unsigned int cmd;
    unsigned int checkinfo;
};

#define BEAUTY_CPU_IDLE_CTRL  (1)
#define BEAUTY_CPU_UNDO_IDLE_CTRL (2)
#define BEAUTY_CPU_CTRL_CHECKINFO (0xAABB)


#define F_IOCTYPE 0xBE
#define F_LOOP_IOCTL _IOWR(F_IOCTYPE, 0x0, int)
#define F_IDLE_IOCTL _IOWR(F_IOCTYPE, 0x01, int)
#define F_UNDO_IDLE_IOCTL _IOWR(F_IOCTYPE, 0x02, int)
#define BEAUTY_CPU_GET_CTRLINFO_OFFSET_IOCTL _IOWR(F_IOCTYPE, 0x03, int)


#endif
