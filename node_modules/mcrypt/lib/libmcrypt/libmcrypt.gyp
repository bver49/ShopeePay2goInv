{
    'targets': [
        {
            'target_name': 'libmcrypt',
            'type': 'static_library',
            'defines': [
                'STDC_HEADERS',
                'VERSION="2.5.8"'
            ],
            'include_dirs': [
                '.',
                'lib/',
                'include/'
            ],
            'conditions': [
                ['OS=="linux"', {
                        'defines': [
                            'HAVE_BYTESWAP_H',
                            'HAVE_BZERO',
                            'HAVE_MEMMOVE',
                            'HAVE_MEMSET',
                            'HAVE_MLOCK',
                            'HAVE_STRINGS_H',
                            'HAVE_SYS_MMAN_H',
                            'HAVE_SYS_TYPES_H',
                            'HAVE_UNISTD_H',
                            'SIZEOF_UNSIGNED_CHAR=1',
                            'SIZEOF_UNSIGNED_INT=4',
                            'SIZEOF_UNSIGNED_LONG_INT=8',
                            'SIZEOF_UNSIGNED_SHORT_INT=2'
                        ]
                    }
                ],
                ['OS=="mac"', {
                        'defines': [
                            'HAVE_BZERO',
                            'HAVE_MEMMOVE',
                            'HAVE_MEMSET',
                            'HAVE_MLOCK',
                            'HAVE_STRINGS_H',
                            'HAVE_SYS_MMAN_H',
                            'HAVE_SYS_TYPES_H',
                            'HAVE_UNISTD_H',
                            'SIZEOF_UNSIGNED_CHAR=1',
                            'SIZEOF_UNSIGNED_INT=4',
                            'SIZEOF_UNSIGNED_LONG_INT=8',
                            'SIZEOF_UNSIGNED_SHORT_INT=2'
                        ]
                    }
                ],
                ['OS=="freebsd"', {
                        'defines': [
                            'HAVE_BZERO',
                            'HAVE_MEMMOVE',
                            'HAVE_MEMSET',
                            'HAVE_MLOCK',
                            'HAVE_STRINGS_H',
                            'HAVE_SYS_MMAN_H',
                            'HAVE_SYS_TYPES_H',
                            'HAVE_UNISTD_H',
                            'SIZEOF_UNSIGNED_CHAR=1',
                            'SIZEOF_UNSIGNED_INT=4',
                            'SIZEOF_UNSIGNED_LONG_INT=8',
                            'SIZEOF_UNSIGNED_SHORT_INT=2'
                        ]
                    }
                ],
                ['OS=="win"', {
                        'defines': [
                            'WIN32',
                            'HAVE_BZERO',
                            'HAVE_MEMMOVE',
                            'HAVE_MEMSET',
                            'HAVE_SYS_TYPES_H',
                            'SIZEOF_UNSIGNED_CHAR=1',
                            'SIZEOF_UNSIGNED_INT=4',
                            'SIZEOF_UNSIGNED_LONG_INT=8',
                            'SIZEOF_UNSIGNED_SHORT_INT=2'
                        ]
                    }
                ]
            ],
            'sources': [
                'modules/algorithms/3-way.c',
                'modules/algorithms/arcfour.c',
                'modules/algorithms/blowfish.c',
                'modules/algorithms/blowfish-compat.c',
                'modules/algorithms/cast-128.c',
                'modules/algorithms/cast-256.c',
                'modules/algorithms/des.c',
                'modules/algorithms/enigma.c',
                'modules/algorithms/gost.c',
                'modules/algorithms/loki97.c',
                'modules/algorithms/panama.c',
                'modules/algorithms/rc2.c',
                'modules/algorithms/rijndael-128.c',
                'modules/algorithms/rijndael-192.c',
                'modules/algorithms/rijndael-256.c',
                'modules/algorithms/safer64.c',
                'modules/algorithms/safer128.c',
                'modules/algorithms/saferplus.c',
                'modules/algorithms/serpent.c',
                'modules/algorithms/tripledes.c',
                'modules/algorithms/twofish.c',
                'modules/algorithms/wake.c',
                'modules/algorithms/xtea.c',
                'modules/modes/cbc.c',
                'modules/modes/cfb.c',
                'modules/modes/ctr.c',
                'modules/modes/ecb.c',
                'modules/modes/ncfb.c',
                'modules/modes/nofb.c',
                'modules/modes/ofb.c',
                'modules/modes/stream.c',
                'lib/bzero.c', 
                'lib/mcrypt.c', 
                'lib/mcrypt_extra.c', 
                'lib/mcrypt_modules.c', 
                'lib/mcrypt_symb.c', 
                'lib/xmemory.c'
            ]
        }
    ]
}
