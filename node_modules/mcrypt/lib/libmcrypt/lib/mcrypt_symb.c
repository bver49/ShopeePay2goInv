#include "mcrypt_internal.h"

/* This is automatically created. Don't touch... */

/* modes */

extern int cbc_LTX__init_mcrypt();
extern int cbc_LTX__mcrypt_set_state();
extern int cbc_LTX__mcrypt_get_state();
extern int cbc_LTX__end_mcrypt();
extern int cbc_LTX__mcrypt();
extern int cbc_LTX__mdecrypt();
extern int cbc_LTX__has_iv();
extern int cbc_LTX__is_block_mode();
extern int cbc_LTX__is_block_algorithm_mode();
extern char* cbc_LTX__mcrypt_get_modes_name();
extern int cbc_LTX__mcrypt_mode_get_size();
extern word32 cbc_LTX__mcrypt_mode_version();

extern int cfb_LTX__init_mcrypt();
extern int cfb_LTX__mcrypt_set_state();
extern int cfb_LTX__mcrypt_get_state();
extern int cfb_LTX__end_mcrypt();
extern int cfb_LTX__mcrypt();
extern int cfb_LTX__mdecrypt();
extern int cfb_LTX__has_iv();
extern int cfb_LTX__is_block_mode();
extern int cfb_LTX__is_block_algorithm_mode();
extern char* cfb_LTX__mcrypt_get_modes_name();
extern int cfb_LTX__mcrypt_mode_get_size();
extern word32 cfb_LTX__mcrypt_mode_version();

extern int ctr_LTX__init_mcrypt();
extern int ctr_LTX__mcrypt_set_state();
extern int ctr_LTX__mcrypt_get_state();
extern int ctr_LTX__end_mcrypt();
extern int ctr_LTX__mcrypt();
extern int ctr_LTX__mdecrypt();
extern int ctr_LTX__has_iv();
extern int ctr_LTX__is_block_mode();
extern int ctr_LTX__is_block_algorithm_mode();
extern char* ctr_LTX__mcrypt_get_modes_name();
extern int ctr_LTX__mcrypt_mode_get_size();
extern word32 ctr_LTX__mcrypt_mode_version();

extern int ecb_LTX__mcrypt_set_state();
extern int ecb_LTX__mcrypt_get_state();
extern int ecb_LTX__init_mcrypt();
extern int ecb_LTX__end_mcrypt();
extern int ecb_LTX__mcrypt();
extern int ecb_LTX__mdecrypt();
extern int ecb_LTX__has_iv();
extern int ecb_LTX__is_block_mode();
extern int ecb_LTX__is_block_algorithm_mode();
extern char* ecb_LTX__mcrypt_get_modes_name();
extern int ecb_LTX__mcrypt_mode_get_size();
extern word32 ecb_LTX__mcrypt_mode_version();

extern int ncfb_LTX__init_mcrypt();
extern int ncfb_LTX__mcrypt_set_state();
extern int ncfb_LTX__mcrypt_get_state();
extern int ncfb_LTX__end_mcrypt();
extern int ncfb_LTX__mcrypt();
extern int ncfb_LTX__mdecrypt();
extern int ncfb_LTX__has_iv();
extern int ncfb_LTX__is_block_mode();
extern int ncfb_LTX__is_block_algorithm_mode();
extern char* ncfb_LTX__mcrypt_get_modes_name();
extern int ncfb_LTX__mcrypt_mode_get_size();
extern word32 ncfb_LTX__mcrypt_mode_version();

extern int nofb_LTX__init_mcrypt();
extern int nofb_LTX__mcrypt_set_state();
extern int nofb_LTX__mcrypt_get_state();
extern int nofb_LTX__end_mcrypt();
extern int nofb_LTX__mcrypt();
extern int nofb_LTX__mdecrypt();
extern int nofb_LTX__has_iv();
extern int nofb_LTX__is_block_mode();
extern int nofb_LTX__is_block_algorithm_mode();
extern char* nofb_LTX__mcrypt_get_modes_name();
extern int nofb_LTX__mcrypt_mode_get_size();
extern word32 nofb_LTX__mcrypt_mode_version();

extern int ofb_LTX__init_mcrypt();
extern int ofb_LTX__mcrypt_set_state();
extern int ofb_LTX__mcrypt_get_state();
extern int ofb_LTX__end_mcrypt();
extern int ofb_LTX__mcrypt();
extern int ofb_LTX__mdecrypt();
extern int ofb_LTX__has_iv();
extern int ofb_LTX__is_block_mode();
extern int ofb_LTX__is_block_algorithm_mode();
extern char* ofb_LTX__mcrypt_get_modes_name();
extern int ofb_LTX__mcrypt_mode_get_size();
extern word32 ofb_LTX__mcrypt_mode_version();

extern int stream_LTX__init_mcrypt();
extern int stream_LTX__mcrypt_set_state();
extern int stream_LTX__mcrypt_get_state();
extern int stream_LTX__end_mcrypt();
extern int stream_LTX__mcrypt();
extern int stream_LTX__mdecrypt();
extern int stream_LTX__has_iv();
extern int stream_LTX__is_block_mode();
extern int stream_LTX__is_block_algorithm_mode();
extern char* stream_LTX__mcrypt_get_modes_name();
extern int stream_LTX__mcrypt_mode_get_size();
extern word32 stream_LTX__mcrypt_mode_version();

/* algorithms */

extern int cast_128_LTX__mcrypt_set_key();
extern void cast_128_LTX__mcrypt_encrypt();
extern void cast_128_LTX__mcrypt_decrypt();
extern int cast_128_LTX__mcrypt_get_size();
extern int cast_128_LTX__mcrypt_get_block_size();
extern int cast_128_LTX__is_block_algorithm();
extern int cast_128_LTX__mcrypt_get_key_size();
extern const int* cast_128_LTX__mcrypt_get_supported_key_sizes();
extern const char* cast_128_LTX__mcrypt_get_algorithms_name();
extern int cast_128_LTX__mcrypt_self_test();
extern word32 cast_128_LTX__mcrypt_algorithm_version();

extern int gost_LTX__mcrypt_set_key();
extern void gost_LTX__mcrypt_encrypt();
extern void gost_LTX__mcrypt_decrypt();
extern int gost_LTX__mcrypt_get_size();
extern int gost_LTX__mcrypt_get_block_size();
extern int gost_LTX__is_block_algorithm();
extern int gost_LTX__mcrypt_get_key_size();
extern const int* gost_LTX__mcrypt_get_supported_key_sizes();
extern const char* gost_LTX__mcrypt_get_algorithms_name();
extern int gost_LTX__mcrypt_self_test();
extern word32 gost_LTX__mcrypt_algorithm_version();

extern int rijndael_128_LTX__mcrypt_set_key();
extern void rijndael_128_LTX__mcrypt_encrypt();
extern void rijndael_128_LTX__mcrypt_decrypt();
extern int rijndael_128_LTX__mcrypt_get_size();
extern int rijndael_128_LTX__mcrypt_get_block_size();
extern int rijndael_128_LTX__is_block_algorithm();
extern int rijndael_128_LTX__mcrypt_get_key_size();
extern const int* rijndael_128_LTX__mcrypt_get_supported_key_sizes();
extern const char* rijndael_128_LTX__mcrypt_get_algorithms_name();
extern int rijndael_128_LTX__mcrypt_self_test();
extern word32 rijndael_128_LTX__mcrypt_algorithm_version();

extern int twofish_LTX__mcrypt_set_key();
extern void twofish_LTX__mcrypt_encrypt();
extern void twofish_LTX__mcrypt_decrypt();
extern int twofish_LTX__mcrypt_get_size();
extern int twofish_LTX__mcrypt_get_block_size();
extern int twofish_LTX__is_block_algorithm();
extern int twofish_LTX__mcrypt_get_key_size();
extern const int* twofish_LTX__mcrypt_get_supported_key_sizes();
extern const char* twofish_LTX__mcrypt_get_algorithms_name();
extern int twofish_LTX__mcrypt_self_test();
extern word32 twofish_LTX__mcrypt_algorithm_version();

extern int arcfour_LTX__mcrypt_set_key();
extern void arcfour_LTX__mcrypt_encrypt();
extern void arcfour_LTX__mcrypt_decrypt();
extern int arcfour_LTX__mcrypt_get_size();
extern int arcfour_LTX__mcrypt_get_block_size();
extern int arcfour_LTX__is_block_algorithm();
extern int arcfour_LTX__mcrypt_get_key_size();
extern int arcfour_LTX__mcrypt_get_algo_iv_size();
extern const int* arcfour_LTX__mcrypt_get_supported_key_sizes();
extern const char* arcfour_LTX__mcrypt_get_algorithms_name();
extern int arcfour_LTX__mcrypt_self_test();
extern word32 arcfour_LTX__mcrypt_algorithm_version();

extern int cast_256_LTX__mcrypt_set_key();
extern void cast_256_LTX__mcrypt_encrypt();
extern void cast_256_LTX__mcrypt_decrypt();
extern int cast_256_LTX__mcrypt_get_size();
extern int cast_256_LTX__mcrypt_get_block_size();
extern int cast_256_LTX__is_block_algorithm();
extern int cast_256_LTX__mcrypt_get_key_size();
extern const int* cast_256_LTX__mcrypt_get_supported_key_sizes();
extern const char* cast_256_LTX__mcrypt_get_algorithms_name();
extern int cast_256_LTX__mcrypt_self_test();
extern word32 cast_256_LTX__mcrypt_algorithm_version();

extern int loki97_LTX__mcrypt_set_key();
extern void loki97_LTX__mcrypt_encrypt();
extern void loki97_LTX__mcrypt_decrypt();
extern int loki97_LTX__mcrypt_get_size();
extern int loki97_LTX__mcrypt_get_block_size();
extern int loki97_LTX__is_block_algorithm();
extern int loki97_LTX__mcrypt_get_key_size();
extern const int* loki97_LTX__mcrypt_get_supported_key_sizes();
extern const char* loki97_LTX__mcrypt_get_algorithms_name();
extern int loki97_LTX__mcrypt_self_test();
extern word32 loki97_LTX__mcrypt_algorithm_version();

extern int rijndael_192_LTX__mcrypt_set_key();
extern void rijndael_192_LTX__mcrypt_encrypt();
extern void rijndael_192_LTX__mcrypt_decrypt();
extern int rijndael_192_LTX__mcrypt_get_size();
extern int rijndael_192_LTX__mcrypt_get_block_size();
extern int rijndael_192_LTX__is_block_algorithm();
extern int rijndael_192_LTX__mcrypt_get_key_size();
extern const int* rijndael_192_LTX__mcrypt_get_supported_key_sizes();
extern const char* rijndael_192_LTX__mcrypt_get_algorithms_name();
extern int rijndael_192_LTX__mcrypt_self_test();
extern word32 rijndael_192_LTX__mcrypt_algorithm_version();

extern int saferplus_LTX__mcrypt_set_key();
extern void saferplus_LTX__mcrypt_encrypt();
extern void saferplus_LTX__mcrypt_decrypt();
extern int saferplus_LTX__mcrypt_get_size();
extern int saferplus_LTX__mcrypt_get_block_size();
extern int saferplus_LTX__is_block_algorithm();
extern int saferplus_LTX__mcrypt_get_key_size();
extern const int* saferplus_LTX__mcrypt_get_supported_key_sizes();
extern const char* saferplus_LTX__mcrypt_get_algorithms_name();
extern int saferplus_LTX__mcrypt_self_test();
extern word32 saferplus_LTX__mcrypt_algorithm_version();

extern int wake_LTX__mcrypt_set_key();
extern void wake_LTX__mcrypt_encrypt();
extern void wake_LTX__mcrypt_decrypt();
extern int wake_LTX__mcrypt_get_size();
extern int wake_LTX__mcrypt_get_block_size();
extern int wake_LTX__is_block_algorithm();
extern int wake_LTX__mcrypt_get_key_size();
extern int wake_LTX__mcrypt_get_algo_iv_size();
extern const int* wake_LTX__mcrypt_get_supported_key_sizes();
extern const char* wake_LTX__mcrypt_get_algorithms_name();
extern int wake_LTX__mcrypt_self_test();
extern word32 wake_LTX__mcrypt_algorithm_version();

extern int blowfish_compat_LTX__mcrypt_set_key();
extern void blowfish_compat_LTX__mcrypt_encrypt();
extern void blowfish_compat_LTX__mcrypt_decrypt();
extern int blowfish_compat_LTX__mcrypt_get_size();
extern int blowfish_compat_LTX__mcrypt_get_block_size();
extern int blowfish_compat_LTX__is_block_algorithm();
extern int blowfish_compat_LTX__mcrypt_get_key_size();
extern const int* blowfish_compat_LTX__mcrypt_get_supported_key_sizes();
extern const char* blowfish_compat_LTX__mcrypt_get_algorithms_name();
extern int blowfish_compat_LTX__mcrypt_self_test();
extern word32 blowfish_compat_LTX__mcrypt_algorithm_version();

extern int des_LTX__mcrypt_set_key();
extern void des_LTX__mcrypt_encrypt();
extern void des_LTX__mcrypt_decrypt();
extern int des_LTX__mcrypt_get_size();
extern int des_LTX__mcrypt_get_block_size();
extern int des_LTX__is_block_algorithm();
extern int des_LTX__mcrypt_get_key_size();
extern const int* des_LTX__mcrypt_get_supported_key_sizes();
extern const char* des_LTX__mcrypt_get_algorithms_name();
extern int des_LTX__mcrypt_self_test();
extern word32 des_LTX__mcrypt_algorithm_version();

extern int rijndael_256_LTX__mcrypt_set_key();
extern void rijndael_256_LTX__mcrypt_encrypt();
extern void rijndael_256_LTX__mcrypt_decrypt();
extern int rijndael_256_LTX__mcrypt_get_size();
extern int rijndael_256_LTX__mcrypt_get_block_size();
extern int rijndael_256_LTX__is_block_algorithm();
extern int rijndael_256_LTX__mcrypt_get_key_size();
extern const int* rijndael_256_LTX__mcrypt_get_supported_key_sizes();
extern const char* rijndael_256_LTX__mcrypt_get_algorithms_name();
extern int rijndael_256_LTX__mcrypt_self_test();
extern word32 rijndael_256_LTX__mcrypt_algorithm_version();

extern int serpent_LTX__mcrypt_set_key();
extern void serpent_LTX__mcrypt_encrypt();
extern void serpent_LTX__mcrypt_decrypt();
extern int serpent_LTX__mcrypt_get_size();
extern int serpent_LTX__mcrypt_get_block_size();
extern int serpent_LTX__is_block_algorithm();
extern int serpent_LTX__mcrypt_get_key_size();
extern const int* serpent_LTX__mcrypt_get_supported_key_sizes();
extern const char* serpent_LTX__mcrypt_get_algorithms_name();
extern int serpent_LTX__mcrypt_self_test();
extern word32 serpent_LTX__mcrypt_algorithm_version();

extern int xtea_LTX__mcrypt_set_key();
extern void xtea_LTX__mcrypt_encrypt();
extern void xtea_LTX__mcrypt_decrypt();
extern int xtea_LTX__mcrypt_get_size();
extern int xtea_LTX__mcrypt_get_block_size();
extern int xtea_LTX__is_block_algorithm();
extern int xtea_LTX__mcrypt_get_key_size();
extern const int* xtea_LTX__mcrypt_get_supported_key_sizes();
extern const char* xtea_LTX__mcrypt_get_algorithms_name();
extern int xtea_LTX__mcrypt_self_test();
extern word32 xtea_LTX__mcrypt_algorithm_version();

extern int blowfish_LTX__mcrypt_set_key();
extern void blowfish_LTX__mcrypt_encrypt();
extern void blowfish_LTX__mcrypt_decrypt();
extern int blowfish_LTX__mcrypt_get_size();
extern int blowfish_LTX__mcrypt_get_block_size();
extern int blowfish_LTX__is_block_algorithm();
extern int blowfish_LTX__mcrypt_get_key_size();
extern const int* blowfish_LTX__mcrypt_get_supported_key_sizes();
extern const char* blowfish_LTX__mcrypt_get_algorithms_name();
extern int blowfish_LTX__mcrypt_self_test();
extern word32 blowfish_LTX__mcrypt_algorithm_version();

extern int enigma_LTX__mcrypt_set_key();
extern void enigma_LTX__mcrypt_encrypt();
extern void enigma_LTX__mcrypt_decrypt();
extern int enigma_LTX__mcrypt_get_size();
extern int enigma_LTX__mcrypt_get_block_size();
extern int enigma_LTX__is_block_algorithm();
extern int enigma_LTX__mcrypt_get_key_size();
extern int enigma_LTX__mcrypt_get_algo_iv_size();
extern const int* enigma_LTX__mcrypt_get_supported_key_sizes();
extern const char* enigma_LTX__mcrypt_get_algorithms_name();
extern int enigma_LTX__mcrypt_self_test();
extern word32 enigma_LTX__mcrypt_algorithm_version();

extern int rc2_LTX__mcrypt_set_key();
extern void rc2_LTX__mcrypt_encrypt();
extern void rc2_LTX__mcrypt_decrypt();
extern int rc2_LTX__mcrypt_get_size();
extern int rc2_LTX__mcrypt_get_block_size();
extern int rc2_LTX__is_block_algorithm();
extern int rc2_LTX__mcrypt_get_key_size();
extern const int* rc2_LTX__mcrypt_get_supported_key_sizes();
extern const char* rc2_LTX__mcrypt_get_algorithms_name();
extern int rc2_LTX__mcrypt_self_test();
extern word32 rc2_LTX__mcrypt_algorithm_version();

extern int tripledes_LTX__mcrypt_set_key();
extern void tripledes_LTX__mcrypt_encrypt();
extern void tripledes_LTX__mcrypt_decrypt();
extern int tripledes_LTX__mcrypt_get_size();
extern int tripledes_LTX__mcrypt_get_block_size();
extern int tripledes_LTX__is_block_algorithm();
extern int tripledes_LTX__mcrypt_get_key_size();
extern const int* tripledes_LTX__mcrypt_get_supported_key_sizes();
extern const char* tripledes_LTX__mcrypt_get_algorithms_name();
extern int tripledes_LTX__mcrypt_self_test();
extern word32 tripledes_LTX__mcrypt_algorithm_version();

const mcrypt_mode_module mcrypt_mode_modules[] = {
    {"cbc", 
        cbc_LTX__init_mcrypt,
        cbc_LTX__mcrypt_set_state,
        cbc_LTX__mcrypt_get_state,
        cbc_LTX__end_mcrypt,
        cbc_LTX__mcrypt,
        cbc_LTX__mdecrypt,
        cbc_LTX__has_iv,
        cbc_LTX__is_block_mode,
        cbc_LTX__is_block_algorithm_mode,
        cbc_LTX__mcrypt_get_modes_name,
        cbc_LTX__mcrypt_mode_get_size,
        cbc_LTX__mcrypt_mode_version
    },
    {"cfb", 
        cfb_LTX__init_mcrypt,
        cfb_LTX__mcrypt_set_state,
        cfb_LTX__mcrypt_get_state,
        cfb_LTX__end_mcrypt,
        cfb_LTX__mcrypt,
        cfb_LTX__mdecrypt,
        cfb_LTX__has_iv,
        cfb_LTX__is_block_mode,
        cfb_LTX__is_block_algorithm_mode,
        cfb_LTX__mcrypt_get_modes_name,
        cfb_LTX__mcrypt_mode_get_size,
        cfb_LTX__mcrypt_mode_version
    }, 
    {"ctr", 
        ctr_LTX__init_mcrypt,
        ctr_LTX__mcrypt_set_state,
        ctr_LTX__mcrypt_get_state,
        ctr_LTX__end_mcrypt,
        ctr_LTX__mcrypt,
        ctr_LTX__mdecrypt,
        ctr_LTX__has_iv,
        ctr_LTX__is_block_mode,
        ctr_LTX__is_block_algorithm_mode,
        ctr_LTX__mcrypt_get_modes_name,
        ctr_LTX__mcrypt_mode_get_size,
        ctr_LTX__mcrypt_mode_version
    }, 
    {"ecb", 
        ecb_LTX__init_mcrypt,
        ecb_LTX__mcrypt_set_state,
        ecb_LTX__mcrypt_get_state,
        ecb_LTX__end_mcrypt,
        ecb_LTX__mcrypt,
        ecb_LTX__mdecrypt,
        ecb_LTX__has_iv,
        ecb_LTX__is_block_mode,
        ecb_LTX__is_block_algorithm_mode,
        ecb_LTX__mcrypt_get_modes_name,
        ecb_LTX__mcrypt_mode_get_size,
        ecb_LTX__mcrypt_mode_version
    }, 
	{"ncfb", 
        ncfb_LTX__init_mcrypt,
        ncfb_LTX__mcrypt_set_state,
        ncfb_LTX__mcrypt_get_state,
        ncfb_LTX__end_mcrypt,
        ncfb_LTX__mcrypt,
        ncfb_LTX__mdecrypt,
        ncfb_LTX__has_iv,
        ncfb_LTX__is_block_mode,
        ncfb_LTX__is_block_algorithm_mode,
        ncfb_LTX__mcrypt_get_modes_name,
        ncfb_LTX__mcrypt_mode_get_size,
        ncfb_LTX__mcrypt_mode_version 
    },
    {"nofb", 
        nofb_LTX__init_mcrypt,
        nofb_LTX__mcrypt_set_state,
        nofb_LTX__mcrypt_get_state,
        nofb_LTX__end_mcrypt,
        nofb_LTX__mcrypt,
        nofb_LTX__mdecrypt,
        nofb_LTX__has_iv,
        nofb_LTX__is_block_mode,
        nofb_LTX__is_block_algorithm_mode,
        nofb_LTX__mcrypt_get_modes_name,
        nofb_LTX__mcrypt_mode_get_size,
        nofb_LTX__mcrypt_mode_version
    },
    {"ofb", 
        ofb_LTX__init_mcrypt,
        ofb_LTX__mcrypt_set_state,
        ofb_LTX__mcrypt_get_state,
        ofb_LTX__end_mcrypt,
        ofb_LTX__mcrypt,
        ofb_LTX__mdecrypt,
        ofb_LTX__has_iv,
        ofb_LTX__is_block_mode,
        ofb_LTX__is_block_algorithm_mode,
        ofb_LTX__mcrypt_get_modes_name,
        ofb_LTX__mcrypt_mode_get_size,
        ofb_LTX__mcrypt_mode_version
    },
    {"stream", 
        stream_LTX__init_mcrypt,
        stream_LTX__mcrypt_set_state,
        stream_LTX__mcrypt_get_state,
        stream_LTX__end_mcrypt,
        stream_LTX__mcrypt,
        stream_LTX__mdecrypt,
        stream_LTX__has_iv,
        stream_LTX__is_block_mode,
        stream_LTX__is_block_algorithm_mode,
        stream_LTX__mcrypt_get_modes_name,
        stream_LTX__mcrypt_mode_get_size,
        stream_LTX__mcrypt_mode_version
    },
    {NULL, 
        NULL, NULL, NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, NULL, NULL
    }
};

const mcrypt_algo_module mcrypt_algo_modules[] = {
    {"cast-128", 
        cast_128_LTX__mcrypt_set_key,
        cast_128_LTX__mcrypt_encrypt,
        cast_128_LTX__mcrypt_decrypt,
        cast_128_LTX__mcrypt_get_size,
        cast_128_LTX__mcrypt_get_block_size,
        cast_128_LTX__is_block_algorithm,
        cast_128_LTX__mcrypt_get_key_size,
        NULL,
        cast_128_LTX__mcrypt_get_supported_key_sizes,
        cast_128_LTX__mcrypt_get_algorithms_name,
        cast_128_LTX__mcrypt_self_test,
        cast_128_LTX__mcrypt_algorithm_version
    },
    {"gost", 
        gost_LTX__mcrypt_set_key,
        gost_LTX__mcrypt_encrypt,
        gost_LTX__mcrypt_decrypt,
        gost_LTX__mcrypt_get_size,
        gost_LTX__mcrypt_get_block_size,
        gost_LTX__is_block_algorithm,
        gost_LTX__mcrypt_get_key_size,
        NULL,
        gost_LTX__mcrypt_get_supported_key_sizes,
        gost_LTX__mcrypt_get_algorithms_name,
        gost_LTX__mcrypt_self_test,
        gost_LTX__mcrypt_algorithm_version 
    },
    {"rijndael-128", 
        rijndael_128_LTX__mcrypt_set_key,
        rijndael_128_LTX__mcrypt_encrypt,
        rijndael_128_LTX__mcrypt_decrypt,
        rijndael_128_LTX__mcrypt_get_size,
        rijndael_128_LTX__mcrypt_get_block_size,
        rijndael_128_LTX__is_block_algorithm,
        rijndael_128_LTX__mcrypt_get_key_size,
        NULL,
        rijndael_128_LTX__mcrypt_get_supported_key_sizes,
        rijndael_128_LTX__mcrypt_get_algorithms_name,
        rijndael_128_LTX__mcrypt_self_test,
        rijndael_128_LTX__mcrypt_algorithm_version
    },
    {"twofish", 
        twofish_LTX__mcrypt_set_key,
        twofish_LTX__mcrypt_encrypt,
        twofish_LTX__mcrypt_decrypt,
        twofish_LTX__mcrypt_get_size,
        twofish_LTX__mcrypt_get_block_size,
        twofish_LTX__is_block_algorithm,
        twofish_LTX__mcrypt_get_key_size,
        NULL,
        twofish_LTX__mcrypt_get_supported_key_sizes,
        twofish_LTX__mcrypt_get_algorithms_name,
        twofish_LTX__mcrypt_self_test,
        twofish_LTX__mcrypt_algorithm_version
    },
    {"arcfour", 
        arcfour_LTX__mcrypt_set_key,
        arcfour_LTX__mcrypt_encrypt,
        arcfour_LTX__mcrypt_decrypt,
        arcfour_LTX__mcrypt_get_size,
        arcfour_LTX__mcrypt_get_block_size,
        arcfour_LTX__is_block_algorithm,
        arcfour_LTX__mcrypt_get_key_size,
        arcfour_LTX__mcrypt_get_algo_iv_size,
        arcfour_LTX__mcrypt_get_supported_key_sizes,
        arcfour_LTX__mcrypt_get_algorithms_name,
        arcfour_LTX__mcrypt_self_test,
        arcfour_LTX__mcrypt_algorithm_version
    },
    {"cast-256", 
        cast_256_LTX__mcrypt_set_key,
        cast_256_LTX__mcrypt_encrypt,
        cast_256_LTX__mcrypt_decrypt,
        cast_256_LTX__mcrypt_get_size,
        cast_256_LTX__mcrypt_get_block_size,
        cast_256_LTX__is_block_algorithm,
        cast_256_LTX__mcrypt_get_key_size,
        NULL,
        cast_256_LTX__mcrypt_get_supported_key_sizes,
        cast_256_LTX__mcrypt_get_algorithms_name,
        cast_256_LTX__mcrypt_self_test,
        cast_256_LTX__mcrypt_algorithm_version
    },
    {"loki97", 
        loki97_LTX__mcrypt_set_key,
        loki97_LTX__mcrypt_encrypt,
        loki97_LTX__mcrypt_decrypt,
        loki97_LTX__mcrypt_get_size,
        loki97_LTX__mcrypt_get_block_size,
        loki97_LTX__is_block_algorithm,
        loki97_LTX__mcrypt_get_key_size,
        NULL,
        loki97_LTX__mcrypt_get_supported_key_sizes,
        loki97_LTX__mcrypt_get_algorithms_name,
        loki97_LTX__mcrypt_self_test,
        loki97_LTX__mcrypt_algorithm_version
    },
    {"rijndael-192", 
        rijndael_192_LTX__mcrypt_set_key,
        rijndael_192_LTX__mcrypt_encrypt,
        rijndael_192_LTX__mcrypt_decrypt,
        rijndael_192_LTX__mcrypt_get_size,
        rijndael_192_LTX__mcrypt_get_block_size,
        rijndael_192_LTX__is_block_algorithm,
        rijndael_192_LTX__mcrypt_get_key_size,
        NULL,
        rijndael_192_LTX__mcrypt_get_supported_key_sizes,
        rijndael_192_LTX__mcrypt_get_algorithms_name,
        rijndael_192_LTX__mcrypt_self_test,
        rijndael_192_LTX__mcrypt_algorithm_version
    },
    {"saferplus", 
        saferplus_LTX__mcrypt_set_key,
        saferplus_LTX__mcrypt_encrypt,
        saferplus_LTX__mcrypt_decrypt,
        saferplus_LTX__mcrypt_get_size,
        saferplus_LTX__mcrypt_get_block_size,
        saferplus_LTX__is_block_algorithm,
        saferplus_LTX__mcrypt_get_key_size,
        NULL,
        saferplus_LTX__mcrypt_get_supported_key_sizes,
        saferplus_LTX__mcrypt_get_algorithms_name,
        saferplus_LTX__mcrypt_self_test,
        saferplus_LTX__mcrypt_algorithm_version
    },
    {"wake", 
        wake_LTX__mcrypt_set_key,
        wake_LTX__mcrypt_encrypt,
        wake_LTX__mcrypt_decrypt,
        wake_LTX__mcrypt_get_size,
        wake_LTX__mcrypt_get_block_size,
        wake_LTX__is_block_algorithm,
        wake_LTX__mcrypt_get_key_size,
        wake_LTX__mcrypt_get_algo_iv_size,
        wake_LTX__mcrypt_get_supported_key_sizes,
        wake_LTX__mcrypt_get_algorithms_name,
        wake_LTX__mcrypt_self_test,
        wake_LTX__mcrypt_algorithm_version
    },
    {"blowfish-compat", 
        blowfish_compat_LTX__mcrypt_set_key,
        blowfish_compat_LTX__mcrypt_encrypt,
        blowfish_compat_LTX__mcrypt_decrypt,
        blowfish_compat_LTX__mcrypt_get_size,
        blowfish_compat_LTX__mcrypt_get_block_size,
        blowfish_compat_LTX__is_block_algorithm,
        blowfish_compat_LTX__mcrypt_get_key_size,
        NULL,
        blowfish_compat_LTX__mcrypt_get_supported_key_sizes,
        blowfish_compat_LTX__mcrypt_get_algorithms_name,
        blowfish_compat_LTX__mcrypt_self_test,
        blowfish_compat_LTX__mcrypt_algorithm_version
    },
    {"des", 
        des_LTX__mcrypt_set_key,
        des_LTX__mcrypt_encrypt,
        des_LTX__mcrypt_decrypt,
        des_LTX__mcrypt_get_size,
        des_LTX__mcrypt_get_block_size,
        des_LTX__is_block_algorithm,
        des_LTX__mcrypt_get_key_size,
        NULL,
        des_LTX__mcrypt_get_supported_key_sizes,
        des_LTX__mcrypt_get_algorithms_name,
        des_LTX__mcrypt_self_test,
        des_LTX__mcrypt_algorithm_version
    },
    {"rijndael-256", 
        rijndael_256_LTX__mcrypt_set_key,
        rijndael_256_LTX__mcrypt_encrypt,
        rijndael_256_LTX__mcrypt_decrypt,
        rijndael_256_LTX__mcrypt_get_size,
        rijndael_256_LTX__mcrypt_get_block_size,
        rijndael_256_LTX__is_block_algorithm,
        rijndael_256_LTX__mcrypt_get_key_size,
        NULL,
        rijndael_256_LTX__mcrypt_get_supported_key_sizes,
        rijndael_256_LTX__mcrypt_get_algorithms_name,
        rijndael_256_LTX__mcrypt_self_test,
        rijndael_256_LTX__mcrypt_algorithm_version
    },
    {"serpent", 
        serpent_LTX__mcrypt_set_key,
        serpent_LTX__mcrypt_encrypt,
        serpent_LTX__mcrypt_decrypt,
        serpent_LTX__mcrypt_get_size,
        serpent_LTX__mcrypt_get_block_size,
        serpent_LTX__is_block_algorithm,
        serpent_LTX__mcrypt_get_key_size,
        NULL,
        serpent_LTX__mcrypt_get_supported_key_sizes,
        serpent_LTX__mcrypt_get_algorithms_name,
        serpent_LTX__mcrypt_self_test,
        serpent_LTX__mcrypt_algorithm_version
    },
    {"xtea", 
        xtea_LTX__mcrypt_set_key,
        xtea_LTX__mcrypt_encrypt,
        xtea_LTX__mcrypt_decrypt,
        xtea_LTX__mcrypt_get_size,
        xtea_LTX__mcrypt_get_block_size,
        xtea_LTX__is_block_algorithm,
        xtea_LTX__mcrypt_get_key_size,
        NULL,
        xtea_LTX__mcrypt_get_supported_key_sizes,
        xtea_LTX__mcrypt_get_algorithms_name,
        xtea_LTX__mcrypt_self_test,
        xtea_LTX__mcrypt_algorithm_version
    },
    {"blowfish", 
        blowfish_LTX__mcrypt_set_key,
        blowfish_LTX__mcrypt_encrypt,
        blowfish_LTX__mcrypt_decrypt,
        blowfish_LTX__mcrypt_get_size,
        blowfish_LTX__mcrypt_get_block_size,
        blowfish_LTX__is_block_algorithm,
        blowfish_LTX__mcrypt_get_key_size,
        NULL,
        blowfish_LTX__mcrypt_get_supported_key_sizes,
        blowfish_LTX__mcrypt_get_algorithms_name,
        blowfish_LTX__mcrypt_self_test,
        blowfish_LTX__mcrypt_algorithm_version
    },
    {"enigma", 
        enigma_LTX__mcrypt_set_key,
        enigma_LTX__mcrypt_encrypt,
        enigma_LTX__mcrypt_decrypt,
        enigma_LTX__mcrypt_get_size,
        enigma_LTX__mcrypt_get_block_size,
        enigma_LTX__is_block_algorithm,
        enigma_LTX__mcrypt_get_key_size,
        enigma_LTX__mcrypt_get_algo_iv_size,
        enigma_LTX__mcrypt_get_supported_key_sizes,
        enigma_LTX__mcrypt_get_algorithms_name,
        enigma_LTX__mcrypt_self_test,
        enigma_LTX__mcrypt_algorithm_version
    },
    {"rc2", 
        rc2_LTX__mcrypt_set_key,
        rc2_LTX__mcrypt_encrypt,
        rc2_LTX__mcrypt_decrypt,
        rc2_LTX__mcrypt_get_size,
        rc2_LTX__mcrypt_get_block_size,
        rc2_LTX__is_block_algorithm,
        rc2_LTX__mcrypt_get_key_size,
        NULL,
        rc2_LTX__mcrypt_get_supported_key_sizes,
        rc2_LTX__mcrypt_get_algorithms_name,
        rc2_LTX__mcrypt_self_test,
        rc2_LTX__mcrypt_algorithm_version
    },
    {"tripledes", 
        tripledes_LTX__mcrypt_set_key,
        tripledes_LTX__mcrypt_encrypt,
        tripledes_LTX__mcrypt_decrypt,
        tripledes_LTX__mcrypt_get_size,
        tripledes_LTX__mcrypt_get_block_size,
        tripledes_LTX__is_block_algorithm,
        tripledes_LTX__mcrypt_get_key_size,
        NULL,
        tripledes_LTX__mcrypt_get_supported_key_sizes,
        tripledes_LTX__mcrypt_get_algorithms_name,
        tripledes_LTX__mcrypt_self_test,
        tripledes_LTX__mcrypt_algorithm_version
    },
    {NULL, 
        NULL, NULL, NULL, NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, NULL, NULL
    }
};

