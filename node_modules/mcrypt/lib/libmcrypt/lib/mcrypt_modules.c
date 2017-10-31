/*
 * Copyright (C) 1998,1999,2000,2001 Nikos Mavroyanopoulos
 *
 * This library is free software; you can redistribute it and/or modify it 
 * under the terms of the GNU Library General Public License as published 
 * by the Free Software Foundation; either version 2 of the License, or 
 * (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place - Suite 330,
 * Boston, MA 02111-1307, USA.
 */

#ifndef LIBDEFS_H
#define LIBDEFS_H
#include <libdefs.h>
#endif
#include <bzero.h>
#include <mcrypt_internal.h>
#include <xmemory.h>

#ifndef DEBUG
# define fputs(x, y) 
#endif

extern const mcrypt_mode_module mcrypt_mode_modules[9];
extern const mcrypt_algo_module mcrypt_algo_modules[20];

const mcrypt_algo_module* mcrypt_module_get_algo(const char* name)
{
    int size = sizeof(mcrypt_algo_modules) / sizeof(mcrypt_algo_module) - 1;
    const mcrypt_algo_module* module = NULL;

    for (module = mcrypt_algo_modules; module < mcrypt_algo_modules + size; module++) {
        if (module->name != NULL 
            && (strcmp(module->name, name) == 0)) {
            return module;
        }
    }

    return NULL;
}

const mcrypt_mode_module* mcrypt_module_get_mode(const char* name)
{
    int size = sizeof(mcrypt_mode_modules) / sizeof(mcrypt_mode_module) - 1;
    const mcrypt_mode_module* module = NULL;

    for (module = mcrypt_mode_modules; module < mcrypt_mode_modules + size; module++) {
        if (module->name != NULL 
            && (strcmp(module->name, name) == 0)) {
            return module;
        }
    }

    return NULL;
}


WIN32DLL_DEFINE
int mcrypt_module_close(MCRYPT td)
{
	if (td == NULL) {
        return MCRYPT_UNKNOWN_ERROR;
    }

	free(td);
	
	return 0;
}


WIN32DLL_DEFINE
MCRYPT mcrypt_module_open(const char *algorithm, const char *mode)
{
    MCRYPT td;
	
	td = calloc(1, sizeof(CRYPT_STREAM));
	if (td == NULL) {
        return MCRYPT_FAILED;
    }
    
    td->algo = mcrypt_module_get_algo(algorithm);
    td->mode = mcrypt_module_get_mode(mode);
    
	if (td->algo == NULL || td->mode == NULL) {
		free(td);
		return MCRYPT_FAILED;
	}

	if (mcrypt_enc_is_block_algorithm_mode(td) != mcrypt_enc_is_block_algorithm(td)) {
		mcrypt_module_close(td);
		return MCRYPT_FAILED;
	}

	return td;
}

/* Modules' frontends */

WIN32DLL_DEFINE
int mcrypt_get_size(MCRYPT td)
{
	if (td->algo->get_size != NULL) {
        return td->algo->get_size();
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_mode_get_size(MCRYPT td)
{
	if (td->mode->get_size != NULL) {
        return td->mode->get_size();
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_set_key(MCRYPT td, void *a, const void *key, int keysize, const void *iv, int e)
{
	int (*__mcrypt_set_key_stream) (void *, const void *, int, const void *, int);
	int (*__mcrypt_set_key_block) (void *, const void *, int);

	if (mcrypt_enc_is_block_algorithm(td) == 0) {
		/* stream */
		__mcrypt_set_key_stream = td->algo->set_key;
		if (__mcrypt_set_key_stream == NULL) {
			return -2;
		}
		return __mcrypt_set_key_stream(a, key, keysize, iv, e);
	} else {
		__mcrypt_set_key_block = td->algo->set_key;
		if (__mcrypt_set_key_block == NULL) {
			return -2;
		}
		return __mcrypt_set_key_block(a, key, keysize);
	}
}

WIN32DLL_DEFINE
int mcrypt_enc_set_state(MCRYPT td, const void *iv, int size)
{
	if (td->mode->set_state != NULL) {
        return td->mode->set_state(td->abuf, iv, size);
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_enc_get_state(MCRYPT td, void *iv, int *size)
{
	if (td->mode->get_state != NULL) {
        return td->mode->get_state(td->abuf, iv, size);
	}

	return MCRYPT_UNKNOWN_ERROR;
}


WIN32DLL_DEFINE
int mcrypt_enc_get_block_size(MCRYPT td)
{
    if (td->algo->get_block_size != NULL) {
        return td->algo->get_block_size();
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_get_algo_iv_size(MCRYPT td)
{
	if (td->algo->get_algo_iv_size != NULL) {
        return td->algo->get_algo_iv_size();
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_enc_get_iv_size(MCRYPT td)
{
	if (mcrypt_enc_is_block_algorithm_mode(td) == 1) {
		return mcrypt_enc_get_block_size(td);
	} else {
		return mcrypt_get_algo_iv_size(td);
	}
}

WIN32DLL_DEFINE
int mcrypt_enc_get_key_size(MCRYPT td)
{
	if (td->algo->get_key_size != NULL) {
        return td->algo->get_key_size();		
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int *mcrypt_enc_get_supported_key_sizes(MCRYPT td, int *len)
{
	const int *size;
    int *ret;

	if (td->algo->get_supported_key_sizes == NULL) {
		*len = 0;
		return NULL;
	}

	size = td->algo->get_supported_key_sizes(len);

	ret = NULL;
	if (size != NULL && (*len) != 0) {
		ret = malloc( sizeof(int)*(*len));

		if (ret == NULL) {
            return NULL;
        }

		memcpy(ret, size, sizeof(int)*(*len));
	}

	return ret;
}

WIN32DLL_DEFINE
int mcrypt_enc_is_block_algorithm(MCRYPT td)
{
	if (td->algo->is_block_algo != NULL) {
        return td->algo->is_block_algo();
		
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
char *mcrypt_enc_get_algorithms_name(MCRYPT td)
{
	if (td->algo->get_name != NULL) {
        return strdup(td->algo->get_name());		
	}

	return NULL;
}

WIN32DLL_DEFINE
int init_mcrypt(MCRYPT td, void *buf, const void *key, int keysize, const void *iv)
{
	if (td->mode->init != NULL) {
        return td->mode->init(buf, key, keysize, iv, mcrypt_enc_get_block_size(td));
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int end_mcrypt(MCRYPT td, void *buf)
{
	if (td->mode->end != NULL) {
        return td->mode->end(buf);
	}

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt(MCRYPT td, void *buf, void *a, int b)
{
    if (td->mode->encrypt != NULL) {
        return td->mode->encrypt(buf, a, b, mcrypt_enc_get_block_size(td), td->akey,
		       td->algo->encrypt, td->algo->decrypt);
    }

	return MCRYPT_FAILED;
}

WIN32DLL_DEFINE
int mdecrypt(MCRYPT td, void *buf, void *a, int b)
{
    if (td->mode->decrypt != NULL) {
        return td->mode->decrypt(buf, a, b, mcrypt_enc_get_block_size(td),
			 td->akey, td->algo->encrypt, td->algo->decrypt);
    }

	return MCRYPT_FAILED;
}

WIN32DLL_DEFINE
char *mcrypt_enc_get_modes_name(MCRYPT td)
{
    if (td->mode->get_name != NULL) {
        return strdup(td->mode->get_name());
    }

	return NULL;
}

WIN32DLL_DEFINE
int mcrypt_enc_is_block_mode(MCRYPT td)
{
    if (td->mode->is_block_mode != NULL) {
        return td->mode->is_block_mode();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_enc_mode_has_iv(MCRYPT td)
{
    if (td->mode->has_iv != NULL) {
        return td->mode->has_iv();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_enc_is_block_algorithm_mode(MCRYPT td)
{
    if (td->mode->is_block_algo_mode != NULL) {
        return td->mode->is_block_algo_mode();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_enc_self_test(MCRYPT td)
{
    if (td->algo->self_test != NULL) {
        return td->algo->self_test();
    }

	return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_self_test(const char *algorithm)
{
    const mcrypt_algo_module* module = NULL;

    if (algorithm == NULL) {
        return MCRYPT_UNKNOWN_ERROR;
    }
    
    module = mcrypt_module_get_algo(algorithm);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}
    
    if (module->self_test != NULL) {
        return module->self_test();
    }
    
    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_algorithm_version(const char *algorithm)
{
	const mcrypt_algo_module* module = NULL;

    if (algorithm == NULL) {
        return MCRYPT_UNKNOWN_ERROR;
    }
    
    module = mcrypt_module_get_algo(algorithm);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}
    
    if (module->get_version != NULL) {
        return module->get_version();
    }
    
    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_mode_version(const char *mode)
{
	const mcrypt_mode_module* module = NULL;

	if (mode == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    module = mcrypt_module_get_mode(mode);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    if (module->get_version != NULL) {
        return module->get_version();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_is_block_algorithm(const char *algorithm)
{
	const mcrypt_algo_module* module = NULL;

    if (algorithm == NULL) {
        return MCRYPT_UNKNOWN_ERROR;
    }
    
    module = mcrypt_module_get_algo(algorithm);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}
    
    if (module->is_block_algo != NULL) {
        return module->is_block_algo();
    }
    
    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_is_block_algorithm_mode(const char *mode)
{
	const mcrypt_mode_module* module = NULL;

	if (mode == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    module = mcrypt_module_get_mode(mode);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    if (module->is_block_algo_mode != NULL) {
        return module->is_block_algo_mode();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_is_block_mode(const char *mode)
{
    const mcrypt_mode_module* module = NULL;

	if (mode == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    module = mcrypt_module_get_mode(mode);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    if (module->is_block_mode != NULL) {
        return module->is_block_mode();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_get_algo_block_size(const char *algorithm)
{
	const mcrypt_algo_module* module = NULL;

    if (algorithm == NULL) {
        return MCRYPT_UNKNOWN_ERROR;
    }
    
    module = mcrypt_module_get_algo(algorithm);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}
    
    if (module->get_block_size != NULL) {
        return module->get_block_size();
    }
    
    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int mcrypt_module_get_algo_key_size(const char *algorithm)
{
	const mcrypt_algo_module* module = NULL;

    if (algorithm == NULL) {
        return MCRYPT_UNKNOWN_ERROR;
    }
    
    module = mcrypt_module_get_algo(algorithm);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}
    
    if (module->get_key_size != NULL) {
        return module->get_key_size();
    }
    
    return MCRYPT_UNKNOWN_ERROR;
}

WIN32DLL_DEFINE
int *mcrypt_module_get_algo_supported_key_sizes(const char *algorithm, int *len)
{
    const mcrypt_algo_module* module = NULL;
    const int *size;
	int *ret_size;

    if (algorithm == NULL) {
        *len = 0;
        return NULL;
    }

    module = mcrypt_module_get_algo(algorithm);

	if ((module == NULL) || (module->get_supported_key_sizes == NULL)) {
		*len = 0;
        return NULL;
	}

	ret_size = NULL;
	size = module->get_supported_key_sizes(len);
    
	if (*len != 0 && size != NULL) {
		ret_size = malloc((*len) * sizeof(int));

		if (ret_size != NULL) {
			memcpy(ret_size, size, (*len)*sizeof(int));
		}
	} else {
        *len = 0;
    }

	return ret_size;
}


