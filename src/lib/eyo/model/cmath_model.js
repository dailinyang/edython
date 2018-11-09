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
goog.require('eYo.Model.Item')

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
 * model
 */
Item.prototype.model = eYo.Model.cmath__module

Item.prototype.model.url = 'https://docs.python.org/3.6/library/cmath.html'

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

eYo.Model.cmath__module.data = {
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
      name: 'phase',
      class: 'cmath',
      category: 0,
      type_: 0,
      href: '#cmath.phase',
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'polar',
      class: 'cmath',
      category: 0,
      type_: 0,
      href: '#cmath.polar',
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
      name: 'exp',
      class: 'cmath',
      category: 1,
      type_: 0,
      href: '#cmath.exp',
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
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'acos',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.acos',
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
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'sin',
      class: 'cmath',
      category: 2,
      type_: 0,
      href: '#cmath.sin',
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
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'isfinite',
      class: 'cmath',
      category: 4,
      type_: 0,
      href: '#cmath.isfinite',
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
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'isclose',
      class: 'cmath',
      category: 4,
      type_: 0,
      href: '#cmath.isclose',
      mandatory: 3,
      arguments: [
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: '*'
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
      name: 'pi',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    }),
    new Item({
      name: 'e',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    }),
    new Item({
      name: 'tau',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    }),
    new Item({
      name: 'inf',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    }),
    new Item({
      name: 'infj',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    }),
    new Item({
      name: 'nan',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    }),
    new Item({
      name: 'nanj',
      class: 'cmath',
      category: 5,
      type_: 1,
      stmt: true
    })
  ],
  by_name: {
    'phase': 0,
    'polar': 1,
    'rect': 2,
    'exp': 3,
    'log': 4,
    'log10': 5,
    'sqrt': 6,
    'acos': 7,
    'asin': 8,
    'atan': 9,
    'cos': 10,
    'sin': 11,
    'tan': 12,
    'acosh': 13,
    'asinh': 14,
    'atanh': 15,
    'cosh': 16,
    'sinh': 17,
    'tanh': 18,
    'isfinite': 19,
    'isinf': 20,
    'isnan': 21,
    'isclose': 22,
    'pi': 23,
    'e': 24,
    'tau': 25,
    'inf': 26,
    'infj': 27,
    'nan': 28,
    'nanj': 29
  },
  by_category: {
    0: [0, 1, 2],
    1: [3, 4, 5, 6],
    2: [7, 8, 9, 10, 11, 12],
    3: [13, 14, 15, 16, 17, 18],
    4: [19, 20, 21, 22],
    5: [23, 24, 25, 26, 27, 28, 29]
  },
  by_type: {
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    1: [23, 24, 25, 26, 27, 28, 29]
  }
}
/**
 * Get the item with the given key
 * @param {!String|Number} key  The key or index of the item
 * @return {?Object} return the model object for that item, if any.
 */
eYo.Model.cmath__module.getItem = function (key) {
  if (!goog.isNumber(key)) {
    key = eYo.Model.cmath__module.data.by_name[key]
  }
  if (goog.isNumber(key)) {
    return eYo.Model.cmath__module.data.items[key]
  }
}

/**
 * Get the type of the given item.
 * @param {!Object} item.
 * @return {?String} return the type.
 */
eYo.Model.cmath__module.getType = function (item) {
  return item && item.type && eYo.Model.cmath__module.data.types[item.type]
}

/**
 * Get the indices of the items for the given category
 * @param {!String} key  The name of the category
 * @return {!Array} the list of item indices with the given category (possibly void).
 */
eYo.Model.cmath__module.getItemsInCategory = function (category, type) {
  var ra = eYo.Model.cmath__module.data.by_category[category] || []
  if (goog.isString(type)) {
    type = eYo.Model.cmath__module.data.type.indexOf(type)
  }
  if (goog.isNumber(type) && type >= 0) {
    var ra2 = []
    for (var i = 0; i < ra.length ; i++ ) {
      var item = eYo.Model.cmath__module.getItem(i)
      if (item && item.type === type) {
        ra2.append(i)
      }
    }
    return ra2
  } else {
    return ra
  }
}
// register the types
eYo.Model.Item.registerTypes(eYo.Model.cmath__module.data.types)


// This file was generated by `python3 ./bin/helpers/modulebot.py cmath` on 2018-11-09 17:31:59.380375


