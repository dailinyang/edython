/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */

/**
 * @fileoverview collections model. Automatically generated by `python3 bin/helpers/modulebot.py collections`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Model.collections__module')
goog.provide('eYo.Model.collections__module.Item')

goog.require('eYo.Model')
goog.require('eYo.Model.Module')
goog.require('eYo.Model.Item')

eYo.Model.collections__module = new eYo.Model.Module('collections__module', 'https://docs.python.org/3.6/library/collections.html')

/**
 * @constructor
 * @param {*} model
 */
eYo.Model.collections__module.Item = function (model) {
  eYo.Model.collections__module.Item.superClass_.constructor.call(this, model)
}

;(function () {

var Item = eYo.Model.collections__module.Item

goog.inherits(Item, eYo.Model.Item)

/**
 * module
 */
Item.prototype.module = eYo.Model.collections__module

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

eYo.Model.collections__module.setData({
  categories: [
    'chainmap-objects',
    'counter-objects',
    'deque-objects',
    'defaultdict-objects',
    'namedtuple-desk-function-for-tuples-with-named-fields',
    'ordereddict-objects',
    'userdict-objects',
    'userlist-objects',
    'userstring-objects'
  ],
  types: [
    'class',
    'function',
    'classmethod',
    'method',
    'attribute'
  ],
  items: [
    new Item({
      name: 'ChainMap',
      class: 'collections',
      category: 0,
      type_: 0,
      href: '#collections.ChainMap',
      stmt: true,
      ary: Infinity,
      mandatory: 0,
      arguments: [
        {
          name: '*maps',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'Counter',
      class: 'collections',
      category: 1,
      type_: 0,
      href: '#collections.Counter',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'iterable-or-mapping',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'OrderedDict',
      class: 'collections',
      category: 5,
      type_: 0,
      href: '#collections.OrderedDict',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'items',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'UserDict',
      class: 'collections',
      category: 6,
      type_: 0,
      href: '#collections.UserDict',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'initialdata',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'UserList',
      class: 'collections',
      category: 7,
      type_: 0,
      href: '#collections.UserList',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'list',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'UserString',
      class: 'collections',
      category: 8,
      type_: 0,
      href: '#collections.UserString',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'sequence',
          optional: true
        }
      ]
    }),
    new Item({
      name: '__missing__',
      class: 'collections.defaultdict',
      category: 3,
      type_: 3,
      href: '#collections.defaultdict.__missing__',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'key'
        }
      ]
    }),
    new Item({
      name: '_asdict',
      class: 'somenamedtuple',
      holder: 'collections.somenamedtuple',
      category: 4,
      type_: 3,
      href: '#collections.somenamedtuple._asdict',
      ary: 0
    }),
    new Item({
      name: '_fields',
      class: 'somenamedtuple',
      holder: 'collections.somenamedtuple',
      category: 4,
      type_: 4,
      href: '#collections.somenamedtuple._fields',
      ary: 0
    }),
    new Item({
      name: '_make',
      class: 'somenamedtuple',
      holder: 'collections.somenamedtuple',
      category: 4,
      type_: 2,
      href: '#collections.somenamedtuple._make',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'iterable'
        }
      ]
    }),
    new Item({
      name: '_replace',
      class: 'somenamedtuple',
      holder: 'collections.somenamedtuple',
      category: 4,
      type_: 3,
      href: '#collections.somenamedtuple._replace',
      ary: Infinity,
      mandatory: 0,
      arguments: [
        {
          name: '**kwargs',
          optional: true
        }
      ]
    }),
    new Item({
      name: '_source',
      class: 'somenamedtuple',
      holder: 'collections.somenamedtuple',
      category: 4,
      type_: 4,
      href: '#collections.somenamedtuple._source',
      ary: 0
    }),
    new Item({
      name: 'append',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.append',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'appendleft',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.appendleft',
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
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.clear',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'copy',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.copy',
      stmt: true,
      ary: 0
    }),
    new Item({
      name: 'count',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.count',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'x'
        }
      ]
    }),
    new Item({
      name: 'defaultdict',
      class: 'collections',
      category: 3,
      type_: 0,
      href: '#collections.defaultdict',
      ary: 2,
      mandatory: 0,
      arguments: [
        {
          name: 'default_desk',
          optional: true
        },
        {
          name: '...',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'deque',
      class: 'collections',
      category: 2,
      type_: 0,
      href: '#collections.deque',
      ary: 2,
      mandatory: 0,
      arguments: [
        {
          name: 'iterable',
          optional: true
        },
        {
          name: 'maxlen',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'elements',
      class: 'collections.Counter',
      category: 1,
      type_: 3,
      href: '#collections.Counter.elements',
      ary: 0
    }),
    new Item({
      name: 'extend',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.extend',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'iterable'
        }
      ]
    }),
    new Item({
      name: 'extendleft',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.extendleft',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'iterable'
        }
      ]
    }),
    new Item({
      name: 'fromkeys',
      class: 'collections.Counter',
      category: 1,
      type_: 3,
      href: '#collections.Counter.fromkeys',
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
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.index',
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
          name: 'stop',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'insert',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.insert',
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
      name: 'most_common',
      class: 'collections.Counter',
      category: 1,
      type_: 3,
      href: '#collections.Counter.most_common',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'n',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'move_to_end',
      class: 'collections.OrderedDict',
      category: 5,
      type_: 3,
      href: '#collections.OrderedDict.move_to_end',
      stmt: true,
      ary: 2,
      mandatory: 1,
      arguments: [
        {
          name: 'key'
        },
        {
          name: 'last',
          default: 'True'
        }
      ]
    }),
    new Item({
      name: 'namedtuple',
      class: 'collections',
      category: 4,
      type_: 1,
      href: '#collections.namedtuple',
      ary: Infinity,
      mandatory: 2,
      arguments: [
        {
          name: 'typename'
        },
        {
          name: 'field_names'
        },
        {
          name: '*',
          optional: true
        },
        {
          name: 'verbose',
          default: 'False'
        },
        {
          name: 'rename',
          default: 'False'
        },
        {
          name: 'module',
          default: 'None'
        }
      ]
    }),
    new Item({
      name: 'new_child',
      class: 'collections.ChainMap',
      category: 0,
      type_: 3,
      href: '#collections.ChainMap.new_child',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'm',
          default: 'None'
        }
      ]
    }),
    new Item({
      name: 'pop',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.pop',
      ary: 0
    }),
    new Item({
      name: 'popitem',
      class: 'collections.OrderedDict',
      category: 5,
      type_: 3,
      href: '#collections.OrderedDict.popitem',
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'last',
          default: 'True'
        }
      ]
    }),
    new Item({
      name: 'popleft',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.popleft',
      ary: 0
    }),
    new Item({
      name: 'remove',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.remove',
      stmt: true,
      ary: 1,
      arguments: [
        {
          name: 'value'
        }
      ]
    }),
    new Item({
      name: 'reverse',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.reverse',
      ary: 0
    }),
    new Item({
      name: 'rotate',
      class: 'collections.deque',
      category: 2,
      type_: 3,
      href: '#collections.deque.rotate',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'n',
          default: 1
        }
      ]
    }),
    new Item({
      name: 'subtract',
      class: 'collections.Counter',
      category: 1,
      type_: 3,
      href: '#collections.Counter.subtract',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'iterable-or-mapping',
          optional: true
        }
      ]
    }),
    new Item({
      name: 'update',
      class: 'collections.Counter',
      category: 1,
      type_: 3,
      href: '#collections.Counter.update',
      stmt: true,
      ary: 1,
      mandatory: 0,
      arguments: [
        {
          name: 'iterable-or-mapping',
          optional: true
        }
      ]
    })
  ],
  by_name: {
    'ChainMap': 0,
    'Counter': 1,
    'OrderedDict': 2,
    'UserDict': 3,
    'UserList': 4,
    'UserString': 5,
    '__missing__': 6,
    '_asdict': 7,
    '_fields': 8,
    '_make': 9,
    '_replace': 10,
    '_source': 11,
    'append': 12,
    'appendleft': 13,
    'clear': 14,
    'copy': 15,
    'count': 16,
    'defaultdict': 17,
    'deque': 18,
    'elements': 19,
    'extend': 20,
    'extendleft': 21,
    'fromkeys': 22,
    'index': 23,
    'insert': 24,
    'most_common': 25,
    'move_to_end': 26,
    'namedtuple': 27,
    'new_child': 28,
    'pop': 29,
    'popitem': 30,
    'popleft': 31,
    'remove': 32,
    'reverse': 33,
    'rotate': 34,
    'subtract': 35,
    'update': 36
  },
  by_category: {
    0: [0, 28],
    1: [1, 19, 22, 25, 35, 36],
    2: [12, 13, 14, 15, 16, 18, 20, 21, 23, 24, 29, 31, 32, 33, 34],
    3: [6, 17],
    4: [7, 8, 9, 10, 11, 27],
    5: [2, 26, 30],
    6: [3],
    7: [4],
    8: [5]
  },
  by_type: {
    0: [0, 1, 2, 3, 4, 5, 17, 18],
    1: [27],
    2: [9],
    3: [6, 7, 10, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    4: [8, 11]
  }
})


})()


// This file was generated by `python3 ./bin/helpers/modulebot.py collections` on 2019-05-07 08:48:05.958178


