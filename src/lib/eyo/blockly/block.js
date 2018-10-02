/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview Block for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Block')
goog.require('Blockly.Block')
goog.forwardDeclare('eYo.Delegate')
goog.forwardDeclare('eYo.T3.All')

/**
 * Class for a block.
 * Not normally called directly, workspace.newBlock() is preferred.
 * For edython.
 * @param {!Blockly.Workspace} workspace The block's workspace.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @param {string=} optId Optional ID.  Use this ID if provided, otherwise
 *     create a new id.
 * @extends {Blockly.Block}
 * @constructor
 */
eYo.Block = function (workspace, prototypeName, optId) {
  this.eyo = eYo.Delegate.Manager.create(this, prototypeName)
  eYo.Block.superClass_.constructor.call(this, workspace, prototypeName, optId)
}
goog.inherits(eYo.Block, Blockly.Block)

/**
 * Dispose the delegate too.
 * @param {number|string} colour HSV hue value, or #RRGGBB string.
 */
eYo.Block.prototype.dispose = function (healStack) {
  if (this === Blockly.selected) {
    // this block was selected, select the block below or above before deletion
    // this does not work most probably because it is the wrong place
    var c8n, target
    if (((c8n = this.nextConnection) && (target = c8n.targetBlock())) ||
    ((c8n = this.previousConnection) && (target = c8n.targetBlock())) ||
    ((c8n = this.outputConnection) && (target = c8n.targetBlock()))) {
      setTimeout(function () { target.select() }, 100)// broken for outputConnection ?
    }
  }
  if (this.eyo) {
    this.eyo.deinitBlock(this)
  }
  eYo.Block.superClass_.dispose.call(this, healStack)
}

/**
 * Add a value input, statement input or local variable to this block.
 * @param {number} type Either Blockly.INPUT_VALUE or Blockly.NEXT_STATEMENT or
 *     Blockly.DUMMY_INPUT.
 * @param {string} name Language-neutral identifier which may used to find this
 *     input again.  Should be unique to this block.
 * @return {!Blockly.Input} The input object created.
 * @private
 * @override
 */
eYo.Block.prototype.appendInput_ = function (type, name) {
  var input = eYo.Block.superClass_.appendInput_.call(this, type, name)
  eYo.Input.setupEyO(input)
  return input
}

/**
 * The default implementation forwards to super then
 * lets the delegate handle special cases.
 * @param {boolean} hidden True if connections are hidden.
 * @override
 */
eYo.Block.prototype.setConnectionsHidden = function (hidden) {
  eYo.Block.superClass_.setConnectionsHidden.call(this, hidden)
  this.eyo.setConnectionsHidden(hidden)
}

/**
 * Return all variables referenced by this block.
 * This is not exactly Blockly's implementation,
 * only FieldInput's are considered.
 * @return {!Array.<string>} List of variable names.
 */
eYo.Block.prototype.getVars = function () {
  var vars = []
  for (var i = 0, input; (input = this.inputList[i]); i++) {
    for (var j = 0, field; (field = input.fieldRow[j]); j++) {
      if (field instanceof eYo.FieldInput) {
        vars.push(field.getText())
      }
    }
  }
  return vars
}

/**
 * Notification that a variable is renaming.
 * If the name matches one of this block's variables, rename it.
 * @param {string} oldName Previous name of variable.
 * @param {string} newName Renamed variable.
 */
eYo.Block.prototype.renameVar = function (oldName, newName) {
  for (var i = 0, input; (input = this.inputList[i]); i++) {
    for (var j = 0, field; (field = input.fieldRow[j]); j++) {
      if (field instanceof eYo.FieldInput &&
          Blockly.Names.equals(oldName, field.getText())) {
        field.setText(newName)
      }
    }
  }
}

/**
 * Notification of a variable replacement.
 * If the id matches one of this block's variables, replace it.
 * @param {string} oldVarId Previous variable.
 * @param {string} newVarId Replacement variable.
 */
eYo.Block.prototype.replaceVarId = function (oldVarId, newVarId) {
  for (var i = 0, input; (input = this.inputList[i]); i++) {
    for (var j = 0, field; (field = input.fieldRow[j]); j++) {
      if (field instanceof eYo.FieldInput &&
          Blockly.Names.equals(oldVarId, field.getValue())) {
        field.setValue(newVarId)
      }
    }
  }
}

/**
 * Set whether this block returns a value.
 * No null opt_check for expression blocks
 * @param {boolean} newBoolean True if there is an output.
 * @param {string|Array.<string>|null|undefined} opt_check Returned type or list
 *     of returned types.  Null or undefined if any type could be returned
 *     (e.g. variable get).
 */
eYo.Block.prototype.setOutput = function (newBoolean, opt_check) {
  if (newBoolean) {
    goog.asserts.assert(!!opt_check || !this.type.startsWith('eyo:expr_') || this.type.startsWith('eyo:expr_fake'),
      'eYo output connection must be types for ' + this.type)
  }
  eYo.Block.superClass_.setOutput.call(this, newBoolean, opt_check)
}
