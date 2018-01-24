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

goog.provide('ezP.DelegateSvg.Expr.Prefixed')

goog.require('ezP.DelegateSvg.Expr')

/**
 * Class for a DelegateSvg, '**...' block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.Prefixed = function (prototypeName) {
  ezP.DelegateSvg.Expr.Prefixed.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Expr.Prefixed, ezP.DelegateSvg.Expr)

ezP.DelegateSvg.Expr.Prefixed.prototype.operator = undefined
ezP.DelegateSvg.Expr.Prefixed.prototype.checkTypes = undefined
ezP.DelegateSvg.Expr.Prefixed.prototype.outputType = undefined

/**
 * Initialize the block.
 * Called by the block's init method.
 * For ezPython.
 * @param {!Block} block.
 * @private
 */
ezP.DelegateSvg.Expr.Prefixed.prototype.initBlock = function(block) {
  ezP.DelegateSvg.Expr.Prefixed.superClass_.initBlock.call(this, block)
  this.fieldPrefix = new ezP.FieldLabel(this.operator)
  block.appendValueInput(ezP.Const.Input.XPR)
    .setCheck(this.checkTypes)
    .appendField(this.fieldPrefix)
  block.setOutput(true, this.outputType)
}

/**
 * Class for a DelegateSvg, '*...' block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.starred_or_expr = function (prototypeName) {
  ezP.DelegateSvg.Expr.starred_or_expr.superClass_.constructor.call(this, prototypeName)
  this.operator = '*'
  this.checkTypes = ezP.T3.Require.expression
  this.outputType = ezP.T3.starred_or_expr
}
goog.inherits(ezP.DelegateSvg.Expr.starred_or_expr, ezP.DelegateSvg.Expr.Prefixed)

ezP.DelegateSvg.Manager.register(ezP.Const.Expr.starred_or_expr, ezP.DelegateSvg.Expr.starred_or_expr)

/**
 * Class for a DelegateSvg, '**...' block.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.double_starred_or_expr = function (prototypeName) {
  ezP.DelegateSvg.Expr.double_starred_or_expr.superClass_.constructor.call(this, prototypeName)
  this.operator = '**'
  this.checkTypes = ezP.T3.Require.expression
  this.outputType = ezP.T3.double_starred_or_expr
}
goog.inherits(ezP.DelegateSvg.Expr.double_starred_or_expr, ezP.DelegateSvg.Expr.Prefixed)

ezP.DelegateSvg.Manager.register(ezP.Const.Expr.double_starred_or_expr, ezP.DelegateSvg.Expr.double_starred_or_expr)

/**
 * Class for a DelegateSvg, yield_from.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Expr.yield_from = function (prototypeName) {
  ezP.DelegateSvg.Expr.yield_from.superClass_.constructor.call(this, prototypeName)
  this.operator = 'from'
  this.checkTypes = ezP.T3.Require.expression
  this.outputType = ezP.T3.yield_from
}
goog.inherits(ezP.DelegateSvg.Expr.yield_from, ezP.DelegateSvg.Expr.Prefixed)

ezP.DelegateSvg.Manager.register(ezP.Const.Expr.yield_from, ezP.DelegateSvg.Expr.yield_from)

/**
* Class for a DelegateSvg, dot_identifier.
* For ezPython.
* @param {?string} prototypeName Name of the language object containing
*     type-specific functions for this block.
* @constructor
*/
ezP.DelegateSvg.Expr.dot_identifier = function (prototypeName) {
  ezP.DelegateSvg.Expr.dot_identifier.superClass_.constructor.call(this, prototypeName)
  this.operator = '.'
  this.checkTypes = ezP.T3.identifier
  this.outputType = ezP.T3.dot_identifier
}
goog.inherits(ezP.DelegateSvg.Expr.dot_identifier, ezP.DelegateSvg.Expr.Prefixed)

ezP.DelegateSvg.Manager.register(ezP.Const.Expr.dot_identifier, ezP.DelegateSvg.Expr.dot_identifier)

/**
* Class for a DelegateSvg, await_expr.
* For ezPython.
* @param {?string} prototypeName Name of the language object containing
*     type-specific functions for this block.
* @constructor
*/
ezP.DelegateSvg.Expr.await_expr = function (prototypeName) {
  ezP.DelegateSvg.Expr.await_expr.superClass_.constructor.call(this, prototypeName)
  this.operator = 'await'
  this.checkTypes = ezP.T3.Require.primary
  this.outputType = ezP.T3.await_expr
}
goog.inherits(ezP.DelegateSvg.Expr.await_expr, ezP.DelegateSvg.Expr.Prefixed)

ezP.DelegateSvg.Manager.register(ezP.Const.Expr.await_expr, ezP.DelegateSvg.Expr.await_expr)
