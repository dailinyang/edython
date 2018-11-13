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
goog.require('eYo.Model.Item')
goog.require('eYo.Protocol.Item')

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
 * model
 */
Item.prototype.model = eYo.Model.fractions__module

Item.prototype.model.url = 'https://docs.python.org/3.6/library/fractions.html'

Object.defineProperties(
  Item.prototype,
  {
    url: {
      get() {
        return this.href
          ? this.model.url + this.href
          : this.model.url
      }
    }
  }
)

eYo.Model.fractions__module.data = {
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
      name: '__ceil__',
      class: 'fractions.Fraction',
      category: 0,
      type_: 2,
      href: '#fractions.Fraction.__ceil__',
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
    })
  ],
  by_name: {
    'Fraction': 0,
    'gcd': 1,
    'from_float': 2,
    'from_decimal': 3,
    'limit_denominator': 4,
    '__floor__': 5,
    '__ceil__': 6,
    '__round__': 7
  },
  by_category: {
    0: [0, 1, 2, 3, 4, 5, 6, 7]
  },
  by_type: {
    0: [0],
    1: [1],
    2: [2, 3, 4, 5, 6, 7]
  }
}

// Add the `Item` methods.
eYo.Do.addProtocol(eYo.Model.fractions__module, 'Item', eYo.Model.fractions__module)

// register the types
eYo.Model.Item.registerTypes(eYo.Model.fractions__module.data.types)


// This file was generated by `python3 ./bin/helpers/modulebot.py fractions` on 2018-11-13 21:20:39.358705


