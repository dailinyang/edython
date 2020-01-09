/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview weakref module. Automatically generated by `python3 bin/helpers/modulebot.py weakref through npm run eyo:module`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('module')

eYo.provide('Module.weakref__module', new eYo.module.Dflt('weakref__module', 'https://docs.python.org/3.6/library/weakref.html'))

;(() => {
  /* Singleton constructor */
  var Item = eYo.module.weakref__module.Item = function (model) {
    eYo.module.Item.Call(this, model)
  }
  eYo.inherits(Item, eYo.module.Item)

  /**
  * module
  */
  Item.prototype.module = eYo.module.weakref__module

  Object.defineProperties(Item.prototype, {
    url: {
      get() {
        return this.href
          ? this.module.url + this.href
          : this.module.url
      }
    }
  })

  eYo.module.weakref__module.data_ = {
    categories: [
      'module-weakref'
    ],
    types: [
      'class',
      'function',
      'method',
      'data',
      'exception'
    ],
    items: [
      new Item({
        name: 'CallableProxyType',
        class: 'weakref',
        category: 0,
        type_: 3,
        href: '#weakref.CallableProxyType',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'ProxyType',
        class: 'weakref',
        category: 0,
        type_: 3,
        href: '#weakref.ProxyType',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'ProxyTypes',
        class: 'weakref',
        category: 0,
        type_: 3,
        href: '#weakref.ProxyTypes',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'ReferenceError',
        class: 'weakref',
        category: 0,
        type_: 4,
        href: '#weakref.ReferenceError',
        ary: 0
      }),
      new Item({
        name: 'ReferenceType',
        class: 'weakref',
        category: 0,
        type_: 3,
        href: '#weakref.ReferenceType',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'WeakKeyDictionary',
        class: 'weakref',
        category: 0,
        type_: 0,
        href: '#weakref.WeakKeyDictionary',
        stmt: true,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'dict',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'WeakMethod',
        class: 'weakref',
        category: 0,
        type_: 0,
        href: '#weakref.WeakMethod',
        stmt: true,
        ary: 1,
        arguments: [
          {
            name: 'method'
          }
        ]
      }),
      new Item({
        name: 'WeakSet',
        class: 'weakref',
        category: 0,
        type_: 0,
        href: '#weakref.WeakSet',
        stmt: true,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'elements',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'WeakValueDictionary',
        class: 'weakref',
        category: 0,
        type_: 0,
        href: '#weakref.WeakValueDictionary',
        stmt: true,
        ary: 1,
        mandatory: 0,
        arguments: [
          {
            name: 'dict',
            optional: true
          }
        ]
      }),
      new Item({
        name: '__call__',
        class: 'weakref.finalize',
        category: 0,
        type_: 2,
        href: '#weakref.finalize.__call__',
        ary: 0
      }),
      new Item({
        name: 'detach',
        class: 'weakref.finalize',
        category: 0,
        type_: 2,
        href: '#weakref.finalize.detach',
        ary: 0
      }),
      new Item({
        name: 'finalize',
        class: 'weakref',
        category: 0,
        type_: 0,
        href: '#weakref.finalize',
        ary: Infinity,
        mandatory: 2,
        arguments: [
          {
            name: 'obj'
          },
          {
            name: 'func'
          },
          {
            name: '*args',
            optional: true
          },
          {
            name: '**kwargs',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'getweakrefcount',
        class: 'weakref',
        category: 0,
        type_: 1,
        href: '#weakref.getweakrefcount',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'getweakrefs',
        class: 'weakref',
        category: 0,
        type_: 1,
        href: '#weakref.getweakrefs',
        ary: 1,
        arguments: [
          {
            name: 'object'
          }
        ]
      }),
      new Item({
        name: 'keyrefs',
        class: 'WeakKeyDictionary',
        holder: 'weakref.WeakKeyDictionary',
        category: 0,
        type_: 2,
        href: '#weakref.WeakKeyDictionary.keyrefs',
        ary: 0
      }),
      new Item({
        name: 'peek',
        class: 'weakref.finalize',
        category: 0,
        type_: 2,
        href: '#weakref.finalize.peek',
        ary: 0
      }),
      new Item({
        name: 'proxy',
        class: 'weakref',
        category: 0,
        type_: 1,
        href: '#weakref.proxy',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'callback',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'ref',
        class: 'weakref',
        category: 0,
        type_: 0,
        href: '#weakref.ref',
        ary: 2,
        mandatory: 1,
        arguments: [
          {
            name: 'object'
          },
          {
            name: 'callback',
            optional: true
          }
        ]
      }),
      new Item({
        name: 'valuerefs',
        class: 'WeakValueDictionary',
        holder: 'weakref.WeakValueDictionary',
        category: 0,
        type_: 2,
        href: '#weakref.WeakValueDictionary.valuerefs',
        ary: 0
      })
    ],
    by_name: {
      'CallableProxyType': 0,
      'ProxyType': 1,
      'ProxyTypes': 2,
      'ReferenceError': 3,
      'ReferenceType': 4,
      'WeakKeyDictionary': 5,
      'WeakMethod': 6,
      'WeakSet': 7,
      'WeakValueDictionary': 8,
      '__call__': 9,
      'detach': 10,
      'finalize': 11,
      'getweakrefcount': 12,
      'getweakrefs': 13,
      'keyrefs': 14,
      'peek': 15,
      'proxy': 16,
      'ref': 17,
      'valuerefs': 18
    },
    by_category: {
      0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    },
    by_type: {
      0: [5, 6, 7, 8, 11, 17],
      1: [12, 13, 16],
      2: [9, 10, 14, 15, 18],
      3: [0, 1, 2, 4],
      4: [3]
    }
  }
  

}) ()


  // This file was generated by `python3 ./bin/helpers/modulebot.py weakref` on 2020-01-07 17:43:41.924256


