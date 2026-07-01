#ifndef _SCACHE_H_
#define _SCACHE_H_

#include <sys/uio.h>
#include <stdint.h>
#include <stdio.h>
#include <pthread.h>
#include <limits.h>
#include <sys/syscall.h>

#ifdef __cplusplus
extern "C" {
#endif


#define BYTE_PER_SECTOR      (512)
#define BYTE_PER_BLK         (4096)
#define BM_AS_BLK            (0xfff)  /* 4095 */
#define SECTOR_PER_BLK       (BYTE_PER_BLK / BYTE_PER_SECTOR)
#define META_BLK_SKIP_CNT    (1)

typedef enum
{
    dev_ssd = 0,
    dev_ssd_sync,
    dev_hdd,
    dev_hdd_sync,
    dev_end
} dev_e;

typedef void (*backend_cb_f)(int32_t, void*);

typedef enum
{
    SCACHE_PRI_LOW = 0,
    SCACHE_PRI_MIDDLE = 1,
    SCACHE_PRI_HIGH = 2,
    SCACHE_PRI_CRITICAL = 3,
    SCACHE_PRI_BUT = 4,     // DO NOT exceed!
} scache_prio_e;

/* IO specific flags */
#define SCACHE_IO_O_SYNC          0x0001    /* aio with O_SYNC */
#define SCACHE_IO_F_SYNC          0x0002    /* fully sync_io */
/* IO specific flags end */


typedef void (*scache_cb_f)(int, void*);

struct _backend_s_;
typedef void (*backend_read_f)(struct _backend_s_* back,
                                  unsigned long offset,
                                  const struct iovec* iov,
                                  unsigned int iov_num,
                                  backend_cb_f cb, void* ctx,
                                  void* fgd_ctx);
typedef void (*backend_write_f)(struct _backend_s_* back,
                                  unsigned long offset,
                                  const struct iovec* iov,
                                  unsigned int iov_num,
                                  backend_cb_f cb, void* ctx,
                                  void* fgd_ctx);

typedef struct _backend_s_
{
    backend_read_f read;
    backend_write_f write;

    int64_t real_size;
    int64_t total_sectors;
    const char *dev_name;
    void* imp; //backend implementation
} backend_s;

typedef struct _scache_io_t
{
    uint64_t offset;
    uint64_t bytes;
    struct iovec *iov_array;
    unsigned int iov_num;
    uint8_t prio:3;
    uint8_t is_u_aio:1;
    uint8_t pad:4;
    uint16_t flags;

    scache_cb_f cb;
    void *sc_ctx;
    void *buf_ptr;
} scache_io_t;


extern uint32_t s_default_run_config[];
int get_run_config_size(void);

uint32_t sc_get_config_meta_stat(const void *_config);
uint64_t sc_get_config_ssd_size(const void *_config);
uint32_t sc_get_config_rd_only(const void *_config);
uint32_t sc_config_is_set_rdonly(const void *_config);

uint64_t get_bkend_dev_size(void *_sc_ins);
int write_config(int ssd_fd, void *config);
int write_meta(int ssd_fd, uint64_t ssd_size);

void sc_calc_mdata_blk_num(uint32_t total_blk_num, uint32_t *p_data_blk_num, uint32_t *p_meta_blk_num);

/*scache_s**/int scache_create(const char* ssd_name,
                backend_s* back, unsigned int blk_4k_num);


#define SCACHE_META_FREEZE_NO_NEW       0x01
#define SCACHE_META_FREEZE_NO_FLUSH     0x02
#define SCACHE_META_FREEZE_FLUSH_MAX    0x04
#define SCACHE_META_FREEZE_RDONLY       0x08

#define SCACHE_META_STR_NN_RDONLY       0x09  /* NO_NEW & RDONLY */

int32_t scache_flush_fast_set_runcfg(void *_sc_ins, int type);
void scache_flush_fast_unset_runcfg(void *_sc_ins, int type);
int32_t scache_config_change_online(void *_sc_ins, const char *item, const char *value);
int32_t scache_config_get(void *_sc_ins, const char *item, int *_config_val);

uint32_t scache_get_dirty_blk_num(void *_sc_ins);

void *scache_init(const char* ssd_name);
void scache_uninit(void *_sc_ins);

void scache_write(void *sc_ins, scache_io_t *p_sc_io, void *io_ctx);
void scache_read(void *sc_ins, scache_io_t *p_sc_io, void *io_ctx);

void scache_release(unsigned long offset, unsigned long length);


void exit_scache_threads();

void open_scache();

int get_hdd_fd(void);
int get_ssd_fd(void);
int scache_checkfile(char *filename);
void get_hit_info(char * info);


#ifdef BUILD_IN_CEPH
void cmd_handle(char* input, char* output);
#endif

#ifdef __cplusplus
}
#endif

#endif
