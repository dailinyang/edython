/**
 * ezPython
 *
 * Copyright 2017 Jérôme LAURENS.
 *
 * License CeCILL-B
 */
/**
 * @fileoverview BlockSvg delegates for ezPython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('ezP.DelegateSvg.Expr.Delimited')

goog.require('ezP.DelegateSvg.Expr')

/**
 * Class for a DelegateSvg, parenth_form.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.parenth_form = function (prototypeName) {
  ezP.DelegateSvg.Expr.parenth_form.superClass_.constructor.call(this, prototypeName)
  this.outputCheck = ezP.T3.Expr.parenth_form
  this.sealedPrototypeName = ezP.T3.Expr.starred_item_list
  this.inputData_ = {
    first: {
      check: ezP.T3.Expr.starred_item_list,
      label: '(',
      wrap: ezP.T3.Expr.starred_item_list
    }
  }
  this.labelEnd.value = ')'
}
goog.inherits(ezP.DelegateSvg.Expr.parenth_form, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Manager.register('parenth_form')

/**
 * Class for a DelegateSvg, list_display block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.list_display = function (prototypeName) {
  ezP.DelegateSvg.Expr.list_display.superClass_.constructor.call(this, prototypeName)
  this.inputData_ = {
    first: {
      check: ezP.T3.Expr.starred_list_comprehensive,
      label: '[',
      wrap: ezP.T3.Expr.starred_list_comprehensive
    }
  }
  this.labelEnd.value = ']'
}
goog.inherits(ezP.DelegateSvg.Expr.list_display, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Manager.register('list_display')

/**
 * Class for a DelegateSvg, set_display block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.set_display = function (prototypeName) {
  ezP.DelegateSvg.Expr.set_display.superClass_.constructor.call(this, prototypeName)
  this.inputData_ = {
    first: {
      check: ezP.T3.Expr.non_void_starred_item_list_comprehensive,
      label: '{',
      wrap: ezP.T3.Expr.non_void_starred_item_list_comprehensive
    }
  }
  this.labelEnd.value = '}'
  this.outputCheck = ezP.T3.Expr.set_display
}
goog.inherits(ezP.DelegateSvg.Expr.set_display, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Manager.register('set_display')

/**
 * Class for a DelegateSvg, dict_display block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.dict_display = function (prototypeName) {
  ezP.DelegateSvg.Expr.dict_display.superClass_.constructor.call(this, prototypeName)
  this.inputData_ = {
    first: {
      check: ezP.T3.Expr.key_datum_list_comprehensive,
      label: '{',
      wrap: ezP.T3.Expr.key_datum_list_comprehensive
    }
  }
  this.labelEnd.value = '}'
  this.outputCheck = ezP.T3.Expr.dict_display
}
goog.inherits(ezP.DelegateSvg.Expr.dict_display, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Manager.register('dict_display')

/**
 * Class for a DelegateSvg, generator expression block.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.generator_expression = function (prototypeName) {
  ezP.DelegateSvg.Expr.generator_expression.superClass_.constructor.call(this, prototypeName)
  this.inputData_ = {
    first: {
      check: ezP.T3.Expr.comprehension,
      label: '{',
      wrap: ezP.T3.Expr.comprehension
    }
  }
  this.labelEnd.value = '}'
  this.outputCheck = ezP.T3.Expr.generator_expression
}
goog.inherits(ezP.DelegateSvg.Expr.generator_expression, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Manager.register('generator_expression')

/**
 * Class for a DelegateSvg, 'slice ...' block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.display_slice_list = function (prototypeName) {
  ezP.DelegateSvg.Expr.display_slice_list.superClass_.constructor.call(this, prototypeName)
  this.inputData_ = {
    first: {
      check: ezP.T3.Expr.slice_list,
      label: '[',
      wrap: ezP.T3.Expr.slice_list
    }
  }
  this.labelEnd.value = ']'
  this.outputCheck = ezP.T3.Expr.display_slice_list
}
goog.inherits(ezP.DelegateSvg.Expr.display_slice_list, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Manager.register('display_slice_list')
