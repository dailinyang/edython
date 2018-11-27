/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview cmath model. Automatically generated by `python3 bin/helpers/modulebot.py cmath`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.cmath__module')
goog.provide('eYo.Model.cmath__module.Item')

goog.require('eYo.Model')
goog.require('eYo.Model.Module')
goog.require('eYo.Model.Item')

eYo.Model.cmath__module = new eYo.Model.Module('cmath__module', 'https://docs.python.org/3.6/library/cmath.html')

/**
 * @constructor
 * @param {*} model 
 */
eYo.Model.cmath__module.Item = function (model) {
  eYo.Model.cmath__module.Item.superClass_.constructor.call(this, model)
}

var Item = eYo.Model.cmath__module.Item

goog.inherits(Item, eYo.Model.Item)

/**
 * module
 */
Item.prototype.module = eYo.Model.cmath__module

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

eYo.Model.cmath__module.setData({
  categories: [
    'conversions-to-and-from-polar-coordinates',
    'power-and-logarithmic-functions',
    'trigonometric-functions',
    'hyperbolic-functions',
    'classification-functions',
    'constants'
  ],
  types: [
    'function',
    'data'
  ],
  items: [
    new Item({
      name: 'acos',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.acos',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'acosh',
      class: 'cmath',
      category: 3,
      type_: 0,
      href: '#cmath.acosh',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'asin',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.asin',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'asinh',
      class: 'cmath',
      category: 3,
      type_: 0,
      href: '#cmath.asinh',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'atan',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.atan',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'atanh',
      class: 'cmath',
      category: 3,
      type_: 0,
      href: '#cmath.atanh',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'cos',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.cos',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'cosh',
      class: 'cmath',
      category: 3,
      type_: 0,
      href: '#cmath.cosh',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'e',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.e',
      stmt: true
    }),
    new Item({
      name: 'exp',
      class: 'cmath',
      category: 1,
      type_: 0,
      href: '#cmath.exp',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'inf',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.inf',
      stmt: true
    }),
    new Item({
      name: 'infj',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.infj',
      stmt: true
    }),
    new Item({
      name: 'isclose',
      class: 'cmath',
      category: 4,
      type_: 0,
      href: '#cmath.isclose',
      ary: Infinity,
      mandatory: 2,
      arguments: [
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: '*',
          optional: true
        },
        {
          name: 'rel_tol',
          default: 1e-09
        },
        {
          name: 'abs_tol',
          default: 0.0
        }
      ]
    }),
    new Item({
      name: 'isfinite',
      class: 'cmath',
      category: 4,
      type_: 0,
      href: '#cmath.isfinite',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'isinf',
      class: 'cmath',
      category: 4,
      type_: 0,
      href: '#cmath.isinf',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'isnan',
      class: 'cmath',
      category: 4,
      type_: 0,
      href: '#cmath.isnan',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'log',
      class: 'cmath',
      category: 1,
      type_: 0,
      href: '#cmath.log',
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'x'
        },
        {
          name: 'base',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'log10',
      class: 'cmath',
      category: 1,
      type_: 0,
      href: '#cmath.log10',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'nan',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.nan',
      stmt: true
    }),
    new Item({
      name: 'nanj',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.nanj',
      stmt: true
    }),
    new Item({
      name: 'phase',
      class: 'cmath',
      category: 0,
      type_: 0,
      href: '#cmath.phase',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'pi',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.pi',
      stmt: true
    }),
    new Item({
      name: 'polar',
      class: 'cmath',
      category: 0,
      type_: 0,
      href: '#cmath.polar',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'rect',
      class: 'cmath',
      category: 0,
      type_: 0,
      href: '#cmath.rect',
      ary: 2,
      arguments: [
        {
          name: 'r'
        },
        {
          name: 'phi'
        }
      ]
    }),
    new Item({
      name: 'sin',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.sin',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'sinh',
      class: 'cmath',
      category: 3,
      type_: 0,
      href: '#cmath.sinh',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'sqrt',
      class: 'cmath',
      category: 1,
      type_: 0,
      href: '#cmath.sqrt',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'tan',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.tan',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'tanh',
      class: 'cmath',
      category: 3,
      type_: 0,
      href: '#cmath.tanh',
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'tau',
      class: 'cmath',
      category: 5,
      type_: 1,
      href: '#cmath.tau',
      stmt: true
    })
  ],
  by_name: {
    'acos': 0,
    'acosh': 1,
    'asin': 2,
    'asinh': 3,
    'atan': 4,
    'atanh': 5,
    'cos': 6,
    'cosh': 7,
    'e': 8,
    'exp': 9,
    'inf': 10,
    'infj': 11,
    'isclose': 12,
    'isfinite': 13,
    'isinf': 14,
    'isnan': 15,
    'log': 16,
    'log10': 17,
    'nan': 18,
    'nanj': 19,
    'phase': 20,
    'pi': 21,
    'polar': 22,
    'rect': 23,
    'sin': 24,
    'sinh': 25,
    'sqrt': 26,
    'tan': 27,
    'tanh': 28,
    'tau': 29
  },
  by_category: {
    0: [20, 22, 23],
    1: [9, 16, 17, 26],
    2: [0, 2, 4, 6, 24, 27],
    3: [1, 3, 5, 7, 25, 28],
    4: [12, 13, 14, 15],
    5: [8, 10, 11, 18, 19, 21, 29]
  },
  by_type: {
    0: [0, 1, 2, 3, 4, 5, 6, 7, 9, 12, 13, 14, 15, 16, 17, 20, 22, 23, 24, 25, 26, 27, 28],
    1: [8, 10, 11, 18, 19, 21, 29]
  }
})



// This file was generated by `python3 ./bin/helpers/modulebot.py cmath` on 2018-11-27 09:46:31.206833


