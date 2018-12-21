/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview array model. Automatically generated by `python3 bin/helpers/modulebot.py array`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.array__module')
goog.provide('eYo.Model.array__module.Item')

goog.require('eYo.Model')
goog.require('eYo.Model.Module')
goog.require('eYo.Model.Item')

eYo.Model.array__module = new eYo.Model.Module('array__module', 'https://docs.python.org/3.6/library/array.html')

/**
 * @constructor
 * @param {*} model 
 */
eYo.Model.array__module.Item = function (model) {
  eYo.Model.array__module.Item.superClass_.constructor.call(this, model)
}

var Item = eYo.Model.array__module.Item

goog.inherits(Item, eYo.Model.Item)

/**
 * module
 */
Item.prototype.module = eYo.Model.array__module

Object.defineProperties(
  Item.prototype,
  {
    url: {
      get() {
        return this.href
          ? this.module.url + this.href
          : this.module.url
      }
    }
  }
)

eYo.Model.array__module.setData({
  categories: [
    'module-array'
  ],
  types: [
    'class',
    'data',
    'attribute',
    'method'
  ],
  items: [
    new Item({
      name: 'append',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.append',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'array',
      class: 'array',
      category: 0,
      type_: 0,
      href: '#array.array',
      stmt: true,
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'typecode'
        },
        {
          name: 'initializer',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'buffer_info',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.buffer_info',
      ary: 0
    }),
    new Item({
      name: 'byteswap',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.byteswap',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'count',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.count',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'extend',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.extend',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'iterable'
        }
      ]
    }),
    new Item({
      name: 'frombytes',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.frombytes',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 's'
        }
      ]
    }),
    new Item({
      name: 'fromfile',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.fromfile',
      stmt: true,
      ary: 2,
      arguments: [
        {
          name: 'f'
        },
        {
          name: 'n'
        }
      ]
    }),
    new Item({
      name: 'fromlist',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.fromlist',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'list'
        }
      ]
    }),
    new Item({
      name: 'fromstring',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.fromstring',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'fromunicode',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.fromunicode',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 's'
        }
      ]
    }),
    new Item({
      name: 'index',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.index',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'insert',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.insert',
      stmt: true,
      ary: 2,
      arguments: [
        {
          name: 'i'
        },
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'itemsize',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 2,
      href: '#array.array.itemsize',
      ary: 0
    }),
    new Item({
      name: 'pop',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.pop',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'i',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'remove',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.remove',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'reverse',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.reverse',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'tobytes',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.tobytes',
      ary: 0
    }),
    new Item({
      name: 'tofile',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.tofile',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'f'
        }
      ]
    }),
    new Item({
      name: 'tolist',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.tolist',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'tostring',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.tostring',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'tounicode',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 3,
      href: '#array.array.tounicode',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'typecode',
      class: 'array',
      holder: 'array.array',
      category: 0,
      type_: 2,
      href: '#array.array.typecode',
      ary: 0
    }),
    new Item({
      name: 'typecodes',
      class: 'array',
      category: 0,
      type_: 1,
      href: '#array.typecodes',
      stmt: true,
      ary: 0
    })
  ],
  by_name: {
    'append': 0,
    'array': 1,
    'buffer_info': 2,
    'byteswap': 3,
    'count': 4,
    'extend': 5,
    'frombytes': 6,
    'fromfile': 7,
    'fromlist': 8,
    'fromstring': 9,
    'fromunicode': 10,
    'index': 11,
    'insert': 12,
    'itemsize': 13,
    'pop': 14,
    'remove': 15,
    'reverse': 16,
    'tobytes': 17,
    'tofile': 18,
    'tolist': 19,
    'tostring': 20,
    'tounicode': 21,
    'typecode': 22,
    'typecodes': 23
  },
  by_category: {
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  },
  by_type: {
    0: [1],
    1: [23],
    2: [13, 22],
    3: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21]
  }
})



// This file was generated by `python3 ./bin/helpers/modulebot.py array` on 2018-12-21 22:01:23.230938


