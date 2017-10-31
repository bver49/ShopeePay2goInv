#ifndef LIBDEFS_H
#define LIBDEFS_H
#include <libdefs.h>
#endif

/* Local Defines */

typedef struct {
    char* name;
    int (*init) (void *, const void *, int, const void *, int);
    int (*set_state) (void *, const void *, int);
    int (*get_state) (void *, void *, int*);
    int (*end) (void *);
    int (*encrypt) (void *, void *, int, int, void *, void *, void*);
    int (*decrypt) (void *, void *, int, int, void *, void *, void*);
    int (*has_iv) (void);
    int (*is_block_mode) (void);
    int (*is_block_algo_mode) (void);
    char *(*get_name) (void);
    int (*get_size) (void);
    word32 (*get_version) (void);
} mcrypt_mode_module;

typedef struct {
    char* name;
    void* set_key;
    void* encrypt;
    void* decrypt;
    int (*get_size) (void);
    int (*get_block_size) (void);
    int (*is_block_algo) (void);
    int (*get_key_size) (void);
    int (*get_algo_iv_size) (void);
    const int *(*get_supported_key_sizes) (int *);
    const char *(*get_name) (void);
    int (*self_test) (void);
    word32 (*get_version) (void);
} mcrypt_algo_module;

typedef struct {
	const mcrypt_algo_module* algo;
	const mcrypt_mode_module* mode;

	/* Holds the algorithm's internal key */
	byte *akey;

	byte *abuf; /* holds the mode's internal buffers */

	/* holds the key */
	byte *keyword_given;

} CRYPT_STREAM;

typedef CRYPT_STREAM* MCRYPT;

#define MCRYPT_FAILED 0x0

WIN32DLL_DEFINE int mcrypt_module_close(MCRYPT td);

/* frontends */

WIN32DLL_DEFINE int end_mcrypt( MCRYPT td, void *buf);
WIN32DLL_DEFINE int mcrypt_enc_get_size(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_mode_get_size(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_set_key(MCRYPT td, void *a, const void *, int c, const void *, int e);
WIN32DLL_DEFINE int mcrypt_enc_get_block_size(MCRYPT td);
WIN32DLL_DEFINE int __mcrypt_get_block_size(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_enc_get_algo_iv_size(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_enc_get_iv_size(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_enc_get_key_size(MCRYPT td);
WIN32DLL_DEFINE int* mcrypt_enc_get_supported_key_sizes(MCRYPT td, int* out_size);
WIN32DLL_DEFINE int mcrypt_enc_is_block_algorithm(MCRYPT td);
WIN32DLL_DEFINE char *mcrypt_enc_get_algorithms_name(MCRYPT td);
WIN32DLL_DEFINE int init_mcrypt(MCRYPT td, void*buf, const void *, int, const void *);
WIN32DLL_DEFINE int mcrypt(MCRYPT td, void* buf, void *a, int b);
WIN32DLL_DEFINE int mdecrypt(MCRYPT td, void* buf, void *a, int b);
WIN32DLL_DEFINE char *mcrypt_enc_get_modes_name(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_enc_is_block_mode(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_enc_mode_has_iv(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_enc_is_block_algorithm_mode(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_module_algorithm_version(const char *algorithm);
WIN32DLL_DEFINE int mcrypt_module_mode_version(const char *mode);
WIN32DLL_DEFINE int mcrypt_get_size(MCRYPT td);
WIN32DLL_DEFINE int mcrypt_algorithm_module_ok(const char *name);
WIN32DLL_DEFINE int mcrypt_mode_module_ok(const char *name);

#define MCRYPT_UNKNOWN_ERROR -1
#define MCRYPT_ALGORITHM_MODE_INCOMPATIBILITY -2
#define MCRYPT_KEY_LEN_ERROR -3
#define MCRYPT_MEMORY_ALLOCATION_ERROR -4
#define MCRYPT_UNKNOWN_MODE -5
#define MCRYPT_UNKNOWN_ALGORITHM -6


const mcrypt_mode_module* mcrypt_module_get_mode(const char* name);
const mcrypt_algo_module* mcrypt_module_get_algo(const char* name);

