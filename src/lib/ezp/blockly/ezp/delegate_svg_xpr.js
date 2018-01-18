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

goog.provide('ezP.DelegateSvg.Xpr')

goog.require('ezP.DelegateSvg')

/**
 * Class for a DelegateSvg, value block.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr = function (prototypeName) {
  ezP.DelegateSvg.Xpr.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr, ezP.DelegateSvg)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.DEFAULT, ezP.DelegateSvg.Xpr)

ezP.DelegateSvg.Xpr.prototype.shapePathDef_ =
  ezP.DelegateSvg.Xpr.prototype.contourPathDef_ =
    ezP.DelegateSvg.Xpr.prototype.highlightedPathDef_ =
      ezP.DelegateSvg.Xpr.prototype.valuePathDef_

/**
 * Render one input of value block.
 * @param io.
 * @private
 */
ezP.DelegateSvg.Xpr.prototype.renderDrawInput_ = function (io) {
  this.renderDrawDummyInput_(io) ||
    this.renderDrawValueInput_(io)
}

/**
 * Initialize the block.
 * Called by the block's init method.
 * For ezPython.
 * @param {!Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.prototype.initBlock = function(block) {
  ezP.DelegateSvg.Xpr.superClass_.initBlock.call(this, block)
  block.setOutput(true, null)
}

/**
 * Class for a DelegateSvg, yield_atom.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.yield_atom = function (prototypeName) {
  ezP.DelegateSvg.Xpr.yield_atom.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.yield_atom, ezP.DelegateSvg.Xpr)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.yield_atom, ezP.DelegateSvg.Xpr.yield_atom)

/**
 * Initialize the block.
 * Called by the block's init method.
 * For ezPython.
 * @param {!Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.yield_atom.prototype.initBlock = function(block) {
  ezP.DelegateSvg.Xpr.yield_atom.superClass_.initBlock.call(this, block)
  var field = new ezP.FieldLabel('(')
  field.ezpFieldData = {x_shift: ezP.Font.space/4}
  block.appendValueInput(ezP.Const.Input.XPR)
    .setCheck(ezP.T3.Require.yield_expression)
    .appendField(field)
  field = new ezP.FieldLabel(')')
  field.ezpFieldData = {x_shift: -ezP.Font.space/4}
  block.appendDummyInput()
    .appendField(field)
  block.setOutput(true, ezP.T3.Provide.yield_atom)
}

/**
 * The right padding of a block.
 * @param {!Blockly.Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.yield_atom.prototype.paddingRight = function (block) {
  return 0 
}

/**
 * The left padding of a block.
 * @param {!Blockly.Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.yield_atom.prototype.paddingLeft = function (block) {
  return 0 
}


/**
 * Class for a DelegateSvg, yield_expression_list.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.yield_expression_list = function (prototypeName) {
  ezP.DelegateSvg.Xpr.yield_expression_list.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.yield_expression_list, ezP.DelegateSvg.Xpr)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.yield_expression_list, ezP.DelegateSvg.Xpr.yield_expression_list)

/**
 * Initialize the block.
 * Called by the block's init method.
 * For ezPython.
 * @param {!Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.yield_expression_list.prototype.initBlock = function(block) {
  ezP.DelegateSvg.Xpr.yield_expression_list.superClass_.initBlock.call(this, block)
  this.inputXPR = block.appendSealedValueInput(ezP.Const.Input.XPR)
    .setCheck(ezP.T3.Require.expression_list)
    .appendField(new ezP.FieldLabel('yield'))
  block.setOutput(true, ezP.T3.Provide.yield_atom)
}

/**
 * Class for a DelegateSvg, yield_expression_from.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.yield_expression_from = function (prototypeName) {
  ezP.DelegateSvg.Xpr.yield_expression_from.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.yield_expression_from, ezP.DelegateSvg.Xpr)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.yield_expression_from, ezP.DelegateSvg.Xpr.yield_expression_from)

/**
 * Initialize the block.
 * Called by the block's init method.
 * For ezPython.
 * @param {!Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.yield_expression_from.prototype.initBlock = function(block) {
  ezP.DelegateSvg.Xpr.yield_expression_from.superClass_.initBlock.call(this, block)
  block.appendValueInput(ezP.Const.Input.XPR)
    .setCheck(ezP.T3.Require.expression)
    .appendField(new ezP.FieldLabel('yield from'))
  block.setOutput(true, ezP.T3.Provide.yield_expression_from)
}

/**
 * Class for a DelegateSvg, quoted string value block.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.Text = function (prototypeName) {
  ezP.DelegateSvg.Xpr.Text.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.Text, ezP.DelegateSvg.Xpr)

/**
 * Render one input of value block.
 * Default implementation just renders a dummy input.
 * @param io.
 * @private
 */
ezP.DelegateSvg.Xpr.Text.prototype.renderDrawInput_ = function (io) {
  this.renderDrawDummyInput_(io)
}

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.TEXT, ezP.DelegateSvg.Xpr.Text)
ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.ANY, ezP.DelegateSvg.Xpr.Text)

/**
 * Render one input of value block.
 * Default implementation just renders a dummy input.
 * @param io.
 * @private
 */
ezP.DelegateSvg.Xpr.Text.prototype.renderDrawInput_ = function (io) {
  this.renderDrawDummyInput_(io)
}

/**
 * Class for a DelegateSvg, one input value block.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.Input = function (prototypeName) {
  ezP.DelegateSvg.Xpr.Input.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.Input, ezP.DelegateSvg.Xpr)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.MINUS, ezP.DelegateSvg.Xpr.Input)

/**
 * Class for a DelegateSvg, tuple value block.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.Tuple = function (prototypeName) {
  ezP.DelegateSvg.Xpr.Tuple.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.Tuple, ezP.DelegateSvg.Xpr)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.TUPLE, ezP.DelegateSvg.Xpr.Tuple)

/**
 * Will render the block.
 * @param {!Block} block.
 * @private
 */
ezP.DelegateSvg.Xpr.Tuple.prototype.willRender_ = function (block) {
  ezP.DelegateSvg.Xpr.Tuple.superClass_.willRender_.call(this, block)
  this.tupleConsolidate(block)
}

/**
 * Render tuple inputs only.
 * @param io.
 * @private
 */
ezP.DelegateSvg.Xpr.Tuple.prototype.renderDrawInput_ = function (io) {
  this.renderDrawDummyInput_(io) ||
  this.renderDrawTupleInput_(io)
}

/**
 * Fetches the named input object, forwards to getInputTuple_.
 * @param {!Block} block.
 * @param {string} name The name of the input.
 * @return {Blockly.Input} The input object, or null if input does not exist or undefined for the default block implementation.
 */
ezP.DelegateSvg.Xpr.Tuple.prototype.getInput = function (block, name) {
  return this.getInputTuple_(block, name)
}

/**
 * Class for a DelegateSvg, tuple value block.
 * Not normally called directly, ezP.DelegateSvg.create(...) is preferred.
 * For ezPython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
ezP.DelegateSvg.Xpr.Range = function (prototypeName) {
  ezP.DelegateSvg.Xpr.Range.superClass_.constructor.call(this, prototypeName)
}
goog.inherits(ezP.DelegateSvg.Xpr.Range, ezP.DelegateSvg.Xpr.Tuple)

ezP.DelegateSvg.Manager.register(ezP.Const.Xpr.RANGE, ezP.DelegateSvg.Xpr.Range)

/**
 * @param {!Block} block.
 * @param {Number} the group of tuples.
 * @return {Number} The max number of inputs. null for unlimited.
 * @private
 */
ezP.DelegateSvg.Xpr.Range.prototype.getInputTupleMax = function (block, grp) {
  return grp ? 0 : 3
}
