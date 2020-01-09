/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */

/**
 * @fileoverview enum module. Automatically generated by `python3 bin/helpers/modulebot.py enum through npm run eyo:module`
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('module')

eYo.provide('Module.enum__module', new eYo.module.Dflt('enum__module', 'https://docs.python.org/3.6/library/enum.html'))

;(() => {
  /* Singleton constructor */
  var Item = eYo.module.enum__module.Item = function (model) {
    eYo.module.Item.Call(this, model)
  }
  eYo.inherits(Item, eYo.module.Item)

  /**
  * module
  */
  Item.prototype.module = eYo.module.enum__module

  Object.defineProperties(Item.prototype, {
    url: {
      get() {
        return this.href
          ? this.module.url + this.href
          : this.module.url
      }
    }
  })

  eYo.module.enum__module.data_ = {
    categories: [
      'module-contents',
      'ensuring-unique-enumeration-values'
    ],
    types: [
      'class',
      'function'
    ],
    items: [
      new Item({
        name: 'Enum',
        class: 'enum',
        category: 0,
        type_: 0,
        href: '#enum.Enum',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'Flag',
        class: 'enum',
        category: 0,
        type_: 0,
        href: '#enum.Flag',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'IntEnum',
        class: 'enum',
        category: 0,
        type_: 0,
        href: '#enum.IntEnum',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'IntFlag',
        class: 'enum',
        category: 0,
        type_: 0,
        href: '#enum.IntFlag',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'auto',
        class: 'enum',
        category: 0,
        type_: 0,
        href: '#enum.auto',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'unique',
        class: 'enum',
        category: 0,
        type_: 1,
        href: '#enum.unique',
        stmt: true,
        ary: 0
      }),
      new Item({
        name: 'unique',
        class: 'enum',
        category: 1,
        stmt: true,
        ary: 0
      })
    ],
    by_name: {
      'Enum': 0,
      'Flag': 1,
      'IntEnum': 2,
      'IntFlag': 3,
      'auto': 4,
      'unique': 6
    },
    by_category: {
      0: [0, 1, 2, 3, 4, 5],
      1: [6]
    },
    by_type: {
      0: [0, 1, 2, 3, 4],
      1: [5]
    }
  }
  

}) ()


  // This file was generated by `python3 ./bin/helpers/modulebot.py enum` on 2020-01-07 17:43:42.119761


