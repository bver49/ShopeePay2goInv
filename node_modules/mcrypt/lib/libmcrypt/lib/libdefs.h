#ifndef ILIBDEFS_H
# define ILIBDEFS_H

/* MAX_THREADS removed by Steve Underwood 1999/12/10 */

#ifdef HAVE_CONFIG_H
# include <config.h>
#endif

#ifdef HAVE_SYS_TYPES_H
# include <sys/types.h>
#endif

#ifdef WIN32
# define WIN32DLL_DEFINE __declspec( dllexport)
#else
# define WIN32DLL_DEFINE
#endif

#ifdef STDC_HEADERS
# include <stdlib.h>
# include <stdio.h>
# include <ctype.h>
# include <string.h>
#endif

#ifdef HAVE_STRINGS_H
# include <strings.h>
#endif

#ifdef HAVE_UNISTD_H
# include <unistd.h>
#endif

#ifdef HAVE_SYS_ENDIAN_H
# include <sys/endian.h>
#endif

#ifdef HAVE_BYTESWAP_H
# include <byteswap.h>
#endif

#if SIZEOF_UNSIGNED_LONG_INT == 4
 typedef unsigned long word32;
 typedef signed long sword32;
#elif SIZEOF_UNSIGNED_INT == 4
 typedef unsigned int word32;
 typedef signed int sword32;
#else
# error "Cannot find a 32 bit integer in your system, sorry."
#endif

#if SIZEOF_UNSIGNED_INT == 2
 typedef unsigned int word16;
#elif SIZEOF_UNSIGNED_SHORT_INT == 2
 typedef unsigned short word16;
#else 
# error "Cannot find a 16 bit integer in your system, sorry."
#endif

#if SIZEOF_UNSIGNED_CHAR == 1
 typedef unsigned char byte; 
#else
# error "Cannot find an 8 bit char in your system, sorry."
#endif

#ifndef HAVE_MEMMOVE
# ifdef HAVE_BCOPY
#  define memmove(d, s, n) bcopy ((s), (d), (n))
# else
#  error "Neither memmove nor bcopy exists on your system."
# endif
#endif

#ifdef USE_DMALLOC
# include <dmalloc.h>
#endif

#endif /* LIBDEFS_H */

