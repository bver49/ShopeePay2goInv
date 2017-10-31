/* 
 * Copyright (C) 1998,1999,2001 Nikos Mavroyanopoulos 
 *
 * This library is free software; you can redistribute it and/or modify it under the terms of the
 * GNU Library General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any
 * later version.
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

/* $Id: mcrypt_extra.c,v 1.26 2002/12/17 10:53:34 nmav Exp $ */

#include <libdefs.h>
#include <bzero.h>
#include <xmemory.h>
#include <mcrypt_internal.h>


extern const mcrypt_mode_module mcrypt_mode_modules[9];
extern const mcrypt_algo_module mcrypt_algo_modules[20];

/* ok */
WIN32DLL_DEFINE
char **mcrypt_list_algorithms(int *size)
{
	char **algos = NULL;
	int i = 0;

	*size = sizeof(mcrypt_algo_modules) / sizeof(mcrypt_algo_module) - 1;
    algos = malloc(sizeof(char*) * (*size));

    if (algos == NULL) {
        return NULL;
    }

    for (i = 0; i < *size; i++) {
        algos[i] = strdup(mcrypt_algo_modules[i].name);
    }

    return algos;
}

/* ok */
WIN32DLL_DEFINE
char **mcrypt_list_modes(int *size)
{
	char **modes = NULL;
	int i = 0;

	*size = sizeof(mcrypt_mode_modules) / sizeof(mcrypt_mode_module) - 1;
    modes = malloc(sizeof(char*) * (*size));

    if (modes == NULL) {
        return NULL;
    }

    for (i = 0; i < *size; i++) {
        modes[i] = strdup(mcrypt_mode_modules[i].name);
    }

    return modes;
}

/* ok */
WIN32DLL_DEFINE
void mcrypt_free_p(char **p, int size)
{
	int i;

	for (i = 0; i < size; i++) {
		free(p[i]);
	}
	free(p);
}

/* ok */
WIN32DLL_DEFINE
int mcrypt_algorithm_module_ok(const char *name)
{
	const mcrypt_algo_module* module = NULL;

	if (name == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    module = mcrypt_module_get_algo(name);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    if (module->get_version != NULL) {
        return module->get_version();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

/* ok */
WIN32DLL_DEFINE
int mcrypt_mode_module_ok(const char *name)
{
	const mcrypt_mode_module* module = NULL;

	if (name == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    module = mcrypt_module_get_mode(name);

	if (module == NULL) {
		return MCRYPT_UNKNOWN_ERROR;
	}

    if (module->get_version != NULL) {
        return module->get_version();
    }

    return MCRYPT_UNKNOWN_ERROR;
}

/* Taken from libgcrypt */

static const char *parse_version_number(const char *s, int *number)
{
	int val = 0;

	if (*s == '0' && isdigit(s[1]))
		return NULL;	/* leading zeros are not allowed */
	for (; isdigit(*s); s++) {
		val *= 10;
		val += *s - '0';
	}
	*number = val;
	return val < 0 ? NULL : s;
}


static const char *parse_version_string(const char *s, int *major,
					int *minor, int *micro)
{
	s = parse_version_number(s, major);
	if (!s || *s != '.')
		return NULL;
	s++;
	s = parse_version_number(s, minor);
	if (!s || *s != '.')
		return NULL;
	s++;
	s = parse_version_number(s, micro);
	if (!s)
		return NULL;
	return s;		/* patchlevel */
}

/****************
 * Check that the the version of the library is at minimum the requested one
 * and return the version string; return NULL if the condition is not
 * satisfied.  If a NULL is passed to this function, no check is done,
 * but the version string is simply returned.
 */
const char *mcrypt_check_version(const char *req_version)
{
	const char *ver = VERSION;
	int my_major, my_minor, my_micro;
	int rq_major, rq_minor, rq_micro;
	const char *my_plvl, *rq_plvl;

	if (!req_version)
		return ver;

	my_plvl =
	    parse_version_string(ver, &my_major, &my_minor, &my_micro);
	if (!my_plvl)
		return NULL;	/* very strange our own version is bogus */
	rq_plvl = parse_version_string(req_version, &rq_major, &rq_minor,
				       &rq_micro);
	if (!rq_plvl)
		return NULL;	/* req version string is invalid */

	if (my_major > rq_major
	    || (my_major == rq_major && my_minor > rq_minor)
	    || (my_major == rq_major && my_minor == rq_minor
		&& my_micro > rq_micro)
	    || (my_major == rq_major && my_minor == rq_minor
		&& my_micro == rq_micro
		&& strcmp(my_plvl, rq_plvl) >= 0)) {
		return ver;
	}
	return NULL;
}

