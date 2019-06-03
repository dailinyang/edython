/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */

/**
 * @fileoverview datastructures model. Automatically generated by `python3 bin/helpers/modulebot.py --no-suffix datastructures`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.datastructures')
goog.provide('eYo.Model.datastructures.Item')

goog.require('eYo.Model')
goog.require('eYo.Model.Module')
goog.require('eYo.Model.Item')

eYo.Model.datastructures = new eYo.Model.Module('datastructures', 'https://docs.python.org/3.6/library/datastructures.html')

/**
 * @constructor
 * @param {*} model
 */
eYo.Model.datastructures.Item = function (model) {
  eYo.Model.datastructures.Item.superClass_.constructor.call(this, model)
}

;(function () {

var Item = eYo.Model.datastructures.Item

goog.inherits(Item, eYo.Model.Item)

/**
 * module
 */
Item.prototype.module = eYo.Model.datastructures

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

eYo.Model.datastructures.setData({
  categories: [
    'more-on-lists'
  ],
  types: [
  ],
  items: [
    new Item({
      name: 'append',
      class: 'list',
      category: 0,
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'clear',
      class: 'list',
      category: 0,
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'copy',
      class: 'list',
      category: 0,
      ary: 0
    }),
    new Item({
      name: 'count',
      class: 'list',
      category: 0,
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'extend',
      class: 'list',
      category: 0,
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'iterable'
        }
      ]
    }),
    new Item({
      name: 'index',
      class: 'list',
      category: 0,
      ary: 3,
      mandatory: 1,
      arguments: [
        {
          name: 'x'
        },
        {
          name: 'start',
          optional: true
        },
        {
          name: 'end',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'insert',
      class: 'list',
      category: 0,
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
      name: 'pop',
      class: 'list',
      category: 0,
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
      class: 'list',
      category: 0,
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
      class: 'list',
      category: 0,
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'sort',
      class: 'list',
      category: 0,
      stmt: true,
      ary: 2,
      mandatory: 0,
      arguments: [
        {
          name: 'key',
          default: 'None'
        },
        {
          name: 'reverse',
          default: 'False'
        }
      ]
    })
  ],
  by_name: {
    'append': 0,
    'clear': 1,
    'copy': 2,
    'count': 3,
    'extend': 4,
    'index': 5,
    'insert': 6,
    'pop': 7,
    'remove': 8,
    'reverse': 9,
    'sort': 10
  },
  by_category: {
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  by_type: {
  }
})


})()


// This file was generated by `python3 ./bin/helpers/modulebot.py --no-suffix datastructures` on 2019-05-07 08:48:05.024079


