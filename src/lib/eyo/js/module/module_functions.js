/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview functions module. Automatically generated by `python3 bin/helpers/modulebot.py --no-suffix functions through npm run eyo:module`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('module')

eYo.provide('Module.functions', new eYo.module.Dflt('functions', 'https://docs.python.org/3.6/library/functions.html'))

;(() => {
  /* Singleton constructor */
  var Item = eYo.module.functions.Item = function (model) {
    eYo.module.Item.Call(this, model)
  }
  eYo.inherits(Item, eYo.module.Item)

  /**
  * module
  */
  Item.prototype.module = eYo.module.functions

  Object.defineProperties(Item.prototype, {
    url: {
      get() {
        return this.href
          ? this.module.url + this.href
          : this.module.url
      }
    }
  })

  eYo.module.functions.data_ = {
    categories: [
      'built-in-functions'
    ],
    types: [
      'function',
      'class'
    ],
    items: [
      new Item({
        name: '__import__',
        class: '',
        category: 0,
        type_: 0,
        href: '#__import__',
        stmt: true,
        ary: 5,
        mandatory: 1,
        arguments: [
          {
            name: 'name'
          },
          {
            name: 'globals',
            default: 'None'
          },
          {
            name: 'locals',
            default: 'None'
          },
          {
            name: 'fromlist',
            default: '()'
          },
          {
            name: 'level',
            default: 0
          }
        ]
      }),
      new Item({
        name: 'abs',
        class: '',
        category: 0,
        type_: 0,
        href: '#abs',
        ary: 1,
        arguments: [
          {
            name: 'x'
          }
        ]
      }),
      new Item({
        name: 'all',
        class: '',
        category: 0,
        type_: 0,
        href: '#all',
        ary: 1,
        arguments: [
          {
            name: 'iterable'
          }
        ]
      }),
      new Item({
        name: 'any',
        class: '',
        category: 0,
        type_: 0,
        href: '#any',
        ary: 1,
        arguments: [
          {
            name: 'iterable'
          }
        ]
      }),
      new Item({
        name: 'ascii',
        class: '',
        category: 0,
        type_: 0,
        href: '#ascii',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'bin',
        class: '',
        category: 0,
        type_: 0,
        href: '#bin',
        ary: 1,
        arguments: [
          {
            name: 'x'
          }
        ]
      }),
      new Item({
        name: 'bool',
        class: '',
        category: 0,
        type_: 1,
        href: '#bool',
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'x',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'bytearray',
        category: 0,
        type_: 1,
        ary: 3,
        mandatory: 0,
        arguments: [
          {
            name: 'source',
            optional: true
          },
          {
            name: 'encoding',
            optional: true
          },
          {
            name: 'errors',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'bytes',
        category: 0,
        type_: 1,
        ary: 3,
        mandatory: 0,
        arguments: [
          {
            name: 'source',
            optional: true
          },
          {
            name: 'encoding',
            optional: true
          },
          {
            name: 'errors',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'callable',
        class: '',
        category: 0,
        type_: 0,
        href: '#callable',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'chr',
        class: '',
        category: 0,
        type_: 0,
        href: '#chr',
        ary: 1,
        arguments: [
          {
            name: 'i'
          }
        ]
      }),
      new Item({
        name: 'classmethod',
        class: '@',
        holder: '',
        category: 0,
        type_: 0,
        href: '#classmethod',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'compile',
        class: '',
        category: 0,
        type_: 0,
        href: '#compile',
        ary: 6,
        mandatory: 3,
        arguments: [
          {
            name: 'source'
          },
          {
            name: 'filename'
          },
          {
            name: 'mode'
          },
          {
            name: 'flags',
            default: 0
          },
          {
            name: 'dont_inherit',
            default: 'False'
          },
          {
            name: 'optimize',
            default: -1
          }
        ]
      }),
      new Item({
        name: 'complex',
        class: '',
        category: 0,
        type_: 1,
        href: '#complex',
        ary: 2,
        mandatory: 0,
        arguments: [
          {
            name: 'real',
            optional: true
          },
          {
            name: 'imag',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'delattr',
        class: '',
        category: 0,
        type_: 0,
        href: '#delattr',
        ary: 2,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'name'
          }
        ]
      }),
      new Item({
        name: 'dict',
        category: 0,
        type_: 1,
        stmt: true,
        signatures: [
          {
            ary: Infinity,
            mandatory: 1,
            arguments: [
              {
                name: 'mapping'
              },
              {
                name: '**kwarg',
                optional: true
              }
            ]
          },
          {
            ary: Infinity,
            mandatory: 1,
            arguments: [
              {
                name: 'iterable'
              },
              {
                name: '**kwarg',
                optional: true
              }
            ]
          }
        ],
        ary: Infinity,
        mandatory: 0,
        arguments: [
          {
            name: '**kwarg',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'dir',
        class: '',
        category: 0,
        type_: 0,
        href: '#dir',
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'object',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'divmod',
        class: '',
        category: 0,
        type_: 0,
        href: '#divmod',
        ary: 2,
        arguments: [
          {
            name: 'a'
          },
          {
            name: 'b'
          }
        ]
      }),
      new Item({
        name: 'enumerate',
        class: '',
        category: 0,
        type_: 0,
        href: '#enumerate',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'iterable'
          },
          {
            name: 'start',
            default: 0
          }
        ]
      }),
      new Item({
        name: 'eval',
        class: '',
        category: 0,
        type_: 0,
        href: '#eval',
        ary: 3,
        mandatory: 1,
        arguments: [
          {
            name: 'expression'
          },
          {
            name: 'globals',
            default: 'None'
          },
          {
            name: 'locals',
            default: 'None'
          }
        ]
      }),
      new Item({
        name: 'exec',
        class: '',
        category: 0,
        type_: 0,
        href: '#exec',
        stmt: true,
        ary: 3,
        mandatory: 1,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'globals',
            optional: true
          },
          {
            name: 'locals',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'filter',
        class: '',
        category: 0,
        type_: 0,
        href: '#filter',
        ary: 2,
        arguments: [
          {
            name: 'function'
          },
          {
            name: 'iterable'
          }
        ]
      }),
      new Item({
        name: 'float',
        class: '',
        category: 0,
        type_: 1,
        href: '#float',
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'x',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'format',
        class: '',
        category: 0,
        type_: 0,
        href: '#format',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'value'
          },
          {
            name: 'format_spec',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'frozenset',
        category: 0,
        type_: 1,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'iterable',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'getattr',
        class: '',
        category: 0,
        type_: 0,
        href: '#getattr',
        ary: 3,
        mandatory: 2,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'name'
          },
          {
            name: 'default',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'globals',
        class: '',
        category: 0,
        type_: 0,
        href: '#globals',
        ary: 0
      }),
      new Item({
        name: 'hasattr',
        class: '',
        category: 0,
        type_: 0,
        href: '#hasattr',
        ary: 2,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'name'
          }
        ]
      }),
      new Item({
        name: 'hash',
        class: '',
        category: 0,
        type_: 0,
        href: '#hash',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'help',
        class: '',
        category: 0,
        type_: 0,
        href: '#help',
        stmt: true,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'object',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'hex',
        class: '',
        category: 0,
        type_: 0,
        href: '#hex',
        ary: 1,
        arguments: [
          {
            name: 'x'
          }
        ]
      }),
      new Item({
        name: 'id',
        class: '',
        category: 0,
        type_: 0,
        href: '#id',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'input',
        class: '',
        category: 0,
        type_: 0,
        href: '#input',
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'prompt',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'int',
        class: '',
        category: 0,
        type_: 1,
        href: '#int',
        signatures: [
          {
            ary: 2,
            mandatory: 1,
            arguments: [
              {
                name: 'x'
              },
              {
                name: 'base',
                default: 10
              }
            ]
          }
        ],
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'x',
            default: 0
          }
        ]
      }),
      new Item({
        name: 'isinstance',
        class: '',
        category: 0,
        type_: 0,
        href: '#isinstance',
        ary: 2,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'classinfo'
          }
        ]
      }),
      new Item({
        name: 'issubclass',
        class: '',
        category: 0,
        type_: 0,
        href: '#issubclass',
        ary: 2,
        arguments: [
          {
            name: 'class'
          },
          {
            name: 'classinfo'
          }
        ]
      }),
      new Item({
        name: 'iter',
        class: '',
        category: 0,
        type_: 0,
        href: '#iter',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'sentinel',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'len',
        class: '',
        category: 0,
        type_: 0,
        href: '#len',
        ary: 1,
        arguments: [
          {
            name: 's'
          }
        ]
      }),
      new Item({
        name: 'list',
        category: 0,
        type_: 1,
        stmt: true,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'iterable',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'locals',
        class: '',
        category: 0,
        type_: 0,
        href: '#locals',
        ary: 0
      }),
      new Item({
        name: 'map',
        class: '',
        category: 0,
        type_: 0,
        href: '#map',
        ary: 3,
        arguments: [
          {
            name: 'function'
          },
          {
            name: 'iterable'
          },
          {
            name: '...'
          }
        ]
      }),
      new Item({
        name: 'max',
        class: '',
        category: 0,
        type_: 0,
        href: '#max',
        signatures: [
          {
            ary: Infinity,
            mandatory: 2,
            arguments: [
              {
                name: 'arg1'
              },
              {
                name: 'arg2'
              },
              {
                name: '*args',
                optional: true
              },
              {
                name: 'key',
                optional: true
              }
            ]
          }
        ],
        ary: Infinity,
        mandatory: 1,
        arguments: [
          {
            name: 'iterable'
          },
          {
            name: '*',
            optional: true
          },
          {
            name: 'key',
            optional: true
          },
          {
            name: 'default',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'memoryview',
        category: 0,
        ary: 1,
        arguments: [
          {
            name: 'obj'
          }
        ]
      }),
      new Item({
        name: 'min',
        class: '',
        category: 0,
        type_: 0,
        href: '#min',
        signatures: [
          {
            ary: Infinity,
            mandatory: 2,
            arguments: [
              {
                name: 'arg1'
              },
              {
                name: 'arg2'
              },
              {
                name: '*args',
                optional: true
              },
              {
                name: 'key',
                optional: true
              }
            ]
          }
        ],
        ary: Infinity,
        mandatory: 1,
        arguments: [
          {
            name: 'iterable'
          },
          {
            name: '*',
            optional: true
          },
          {
            name: 'key',
            optional: true
          },
          {
            name: 'default',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'next',
        class: '',
        category: 0,
        type_: 0,
        href: '#next',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'iterator'
          },
          {
            name: 'default',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'object',
        class: '',
        category: 0,
        type_: 1,
        href: '#object',
        ary: 0
      }),
      new Item({
        name: 'oct',
        class: '',
        category: 0,
        type_: 0,
        href: '#oct',
        ary: 1,
        arguments: [
          {
            name: 'x'
          }
        ]
      }),
      new Item({
        name: 'open',
        class: '',
        category: 0,
        type_: 0,
        href: '#open',
        ary: 8,
        mandatory: 1,
        arguments: [
          {
            name: 'file'
          },
          {
            name: 'mode',
            default: '\'r\''
          },
          {
            name: 'buffering',
            default: -1
          },
          {
            name: 'encoding',
            default: 'None'
          },
          {
            name: 'errors',
            default: 'None'
          },
          {
            name: 'newline',
            default: 'None'
          },
          {
            name: 'closefd',
            default: 'True'
          },
          {
            name: 'opener',
            default: 'None'
          }
        ]
      }),
      new Item({
        name: 'ord',
        class: '',
        category: 0,
        type_: 0,
        href: '#ord',
        ary: 1,
        arguments: [
          {
            name: 'c'
          }
        ]
      }),
      new Item({
        name: 'pow',
        class: '',
        category: 0,
        type_: 0,
        href: '#pow',
        ary: 3,
        mandatory: 2,
        arguments: [
          {
            name: 'x'
          },
          {
            name: 'y'
          },
          {
            name: 'z',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'print',
        class: '',
        category: 0,
        type_: 0,
        href: '#print',
        stmt: true,
        ary: Infinity,
        mandatory: 0,
        arguments: [
          {
            name: '*objects',
            optional: true
          },
          {
            name: 'sep',
            default: '\''
          },
          {
            name: 'end',
            default: '\'\n\''
          },
          {
            name: 'file',
            default: 'sys.stdout'
          },
          {
            name: 'flush',
            default: 'False'
          }
        ]
      }),
      new Item({
        name: 'property',
        class: '',
        category: 0,
        type_: 1,
        href: '#property',
        ary: 4,
        mandatory: 0,
        arguments: [
          {
            name: 'fget',
            default: 'None'
          },
          {
            name: 'fset',
            default: 'None'
          },
          {
            name: 'fdel',
            default: 'None'
          },
          {
            name: 'doc',
            default: 'None'
          }
        ]
      }),
      new Item({
        name: 'range',
        category: 0,
        stmt: true,
        signatures: [
          {
            ary: 3,
            mandatory: 2,
            arguments: [
              {
                name: 'start'
              },
              {
                name: 'stop'
              },
              {
                name: 'step',
                optional: true
              }
            ]
          }
        ],
        ary: 1,
        arguments: [
          {
            name: 'stop'
          }
        ]
      }),
      new Item({
        name: 'repr',
        class: '',
        category: 0,
        type_: 0,
        href: '#repr',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'reversed',
        class: '',
        category: 0,
        type_: 0,
        href: '#reversed',
        ary: 1,
        arguments: [
          {
            name: 'seq'
          }
        ]
      }),
      new Item({
        name: 'round',
        class: '',
        category: 0,
        type_: 0,
        href: '#round',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'number'
          },
          {
            name: 'ndigits',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'set',
        category: 0,
        type_: 1,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'iterable',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'setattr',
        class: '',
        category: 0,
        type_: 0,
        href: '#setattr',
        stmt: true,
        ary: 3,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'name'
          },
          {
            name: 'value'
          }
        ]
      }),
      new Item({
        name: 'slice',
        class: '',
        category: 0,
        type_: 1,
        href: '#slice',
        signatures: [
          {
            ary: 3,
            mandatory: 2,
            arguments: [
              {
                name: 'start'
              },
              {
                name: 'stop'
              },
              {
                name: 'step',
                optional: true
              }
            ]
          }
        ],
        ary: 1,
        arguments: [
          {
            name: 'stop'
          }
        ]
      }),
      new Item({
        name: 'sorted',
        class: '',
        category: 0,
        type_: 0,
        href: '#sorted',
        ary: Infinity,
        mandatory: 1,
        arguments: [
          {
            name: 'iterable'
          },
          {
            name: '*',
            optional: true
          },
          {
            name: 'key',
            default: 'None'
          },
          {
            name: 'reverse',
            default: 'False'
          }
        ]
      }),
      new Item({
        name: 'staticmethod',
        class: '@',
        holder: '',
        category: 0,
        type_: 0,
        href: '#staticmethod',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'str',
        category: 0,
        type_: 1,
        signatures: [
          {
            ary: 3,
            mandatory: 0,
            arguments: [
              {
                name: 'object',
                default: 'b\'\''
              },
              {
                name: 'encoding',
                default: '\'utf-8\''
              },
              {
                name: 'errors',
                default: '\'strict\''
              }
            ]
          }
        ],
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'object',
            default: '\'\''
          }
        ]
      }),
      new Item({
        name: 'sum',
        class: '',
        category: 0,
        type_: 0,
        href: '#sum',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'iterable'
          },
          {
            name: 'start',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'super',
        class: '',
        category: 0,
        type_: 0,
        href: '#super',
        ary: 2,
        mandatory: 0,
        arguments: [
          {
            name: 'type',
            optional: true
          },
          {
            name: 'object-or-type',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'tuple',
        category: 0,
        stmt: true,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'iterable',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'type',
        class: '',
        category: 0,
        type_: 1,
        href: '#type',
        signatures: [
          {
            ary: 3,
            arguments: [
              {
                name: 'name'
              },
              {
                name: 'bases'
              },
              {
                name: 'dict'
              }
            ]
          }
        ],
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'vars',
        class: '',
        category: 0,
        type_: 0,
        href: '#vars',
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'object',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'zip',
        class: '',
        category: 0,
        type_: 0,
        href: '#zip',
        ary: Infinity,
        mandatory: 0,
        arguments: [
          {
            name: '*iterables',
            optional: true
          }
        ]
      })
    ],
    by_name: {
      '__import__': 0,
      'abs': 1,
      'all': 2,
      'any': 3,
      'ascii': 4,
      'bin': 5,
      'bool': 6,
      'bytearray': 7,
      'bytes': 8,
      'callable': 9,
      'chr': 10,
      'classmethod': 11,
      'compile': 12,
      'complex': 13,
      'delattr': 14,
      'dict': 15,
      'dir': 16,
      'divmod': 17,
      'enumerate': 18,
      'eval': 19,
      'exec': 20,
      'filter': 21,
      'float': 22,
      'format': 23,
      'frozenset': 24,
      'getattr': 25,
      'globals': 26,
      'hasattr': 27,
      'hash': 28,
      'help': 29,
      'hex': 30,
      'id': 31,
      'input': 32,
      'int': 33,
      'isinstance': 34,
      'issubclass': 35,
      'iter': 36,
      'len': 37,
      'list': 38,
      'locals': 39,
      'map': 40,
      'max': 41,
      'memoryview': 42,
      'min': 43,
      'next': 44,
      'object': 45,
      'oct': 46,
      'open': 47,
      'ord': 48,
      'pow': 49,
      'print': 50,
      'property': 51,
      'range': 52,
      'repr': 53,
      'reversed': 54,
      'round': 55,
      'set': 56,
      'setattr': 57,
      'slice': 58,
      'sorted': 59,
      'staticmethod': 60,
      'str': 61,
      'sum': 62,
      'super': 63,
      'tuple': 64,
      'type': 65,
      'vars': 66,
      'zip': 67
    },
    by_category: {
      0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67]
    },
    by_type: {
      0: [0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 39, 40, 41, 43, 44, 46, 47, 48, 49, 50, 53, 54, 55, 57, 59, 60, 62, 63, 66, 67],
      1: [6, 7, 8, 13, 15, 22, 24, 33, 38, 45, 51, 56, 58, 61, 65]
    }
  }
  

}) ()


  // This file was generated by `python3 ./bin/helpers/modulebot.py --no-suffix functions` on 2020-01-07 17:43:39.560741


