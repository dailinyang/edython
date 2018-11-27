/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview fractions model. Automatically generated by `python3 bin/helpers/modulebot.py fractions`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.fractions__module')
goog.provide('eYo.Model.fractions__module.Item')

goog.require('eYo.Model')
goog.require('eYo.Model.Module')
goog.require('eYo.Model.Item')

eYo.Model.fractions__module = new eYo.Model.Module('fractions__module', 'https://docs.python.org/3.6/library/fractions.html')

/**
 * @constructor
 * @param {*} model 
 */
eYo.Model.fractions__module.Item = function (model) {
  eYo.Model.fractions__module.Item.superClass_.constructor.call(this, model)
}

var Item = eYo.Model.fractions__module.Item

goog.inherits(Item, eYo.Model.Item)

/**
 * module
 */
Item.prototype.module = eYo.Model.fractions__module

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

eYo.Model.fractions__module.setData({
  categories: [
    'module-fractions'
  ],
  types: [
    'class',
    'function',
    'method'
  ],
  items: [
    new Item({
      name: 'Fraction',
      class: 'fractions',
      category: 0,
      type_: 0,
      href: '#fractions.Fraction',
      signatures: [
        {
          ary: 1,
          arguments: [
            {
              name: 'other_fraction'
            }
          ]
        },
        {
          ary: 1,
          arguments: [
            {
              name: 'float'
            }
          ]
        },
        {
          ary: 1,
          arguments: [
            {
              name: 'decimal'
            }
          ]
        },
        {
          ary: 1,
          arguments: [
            {
              name: 'string'
            }
          ]
        }
      ],
      ary: 2,
      mandatory: 0,
      arguments: [
        {
          name: 'numerator',
          default: 0
        },
        {
          name: 'denominator',
          default: 1
        }
      ]
    }),
    new Item({
      name: '__ceil__',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.__ceil__',
      ary: 0
    }),
    new Item({
      name: '__floor__',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.__floor__',
      ary: 0
    }),
    new Item({
      name: '__round__',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.__round__',
      signatures: [
        {
          ary: 1,
          arguments: [
            {
              name: 'ndigits'
            }
          ]
        }
      ],
      ary: 0
    }),
    new Item({
      name: 'from_decimal',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.from_decimal',
      ary: 1,
      arguments: [
        {
          name: 'dec'
        }
      ]
    }),
    new Item({
      name: 'from_float',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.from_float',
      ary: 1,
      arguments: [
        {
          name: 'flt'
        }
      ]
    }),
    new Item({
      name: 'gcd',
      class: 'fractions',
      category: 0,
      type_: 1,
      href: '#fractions.gcd',
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
      name: 'limit_denominator',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.limit_denominator',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'max_denominator',
          default: 1000000
        }
      ]
    })
  ],
  by_name: {
    'Fraction': 0,
    '__ceil__': 1,
    '__floor__': 2,
    '__round__': 3,
    'from_decimal': 4,
    'from_float': 5,
    'gcd': 6,
    'limit_denominator': 7
  },
  by_category: {
    0: [0, 1, 2, 3, 4, 5, 6, 7]
  },
  by_type: {
    0: [0],
    1: [6],
    2: [1, 2, 3, 4, 5, 7]
  }
})



// This file was generated by `python3 ./bin/helpers/modulebot.py fractions` on 2018-11-27 09:46:31.324505


