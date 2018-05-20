/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview BlockSvg delegates for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.DelegateSvg.Control')

goog.require('goog.ui.Dialog')
goog.require('eYo.Msg')
goog.require('eYo.DelegateSvg.Stmt')
goog.require('goog.dom');

/**
 * Class for a DelegateSvg, control block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.makeSubclass('Control', null, eYo.DelegateSvg)

/**
 * Control block path.
 * @param {!Blockly.Block} block
 * @private
 */
eYo.DelegateSvg.Control.prototype.playPathDef_ = function (block, cursorX) {
  /* eslint-disable indent */
  var lh = eYo.Font.lineHeight() / 2
  var ratio = 1.5
  var blh = lh * ratio
  var y = lh * Math.sqrt(1 - (ratio / 2) ** 2)
  var d = cursorX + eYo.Font.space + blh / 2
  var steps = ['m ' + (d + 2 * y / Math.sqrt(3)) + ',' + y]
  steps.push('l ' + (-Math.sqrt(3) * y) + ',' + y)
  steps.push('l 0,' + (-2 * y) + ' z')
  return steps.join(' ')
} /* eslint-enable indent */

/**
 * Control block path.
 * @param {!Blockly.Block} block
 * @private
 */
eYo.DelegateSvg.Control.prototype.controlPathDef_ = function (block) {
  /* eslint-disable indent */
  var w = block.width
  var h = block.height
  var r = eYo.Style.Path.radius()
  var d = eYo.Font.space
  var steps = ['m ' + d + ',0']
  var lh = eYo.Font.lineHeight() / 2
  var blh = lh * 1.5
  steps.push('a ' + lh + ', ' + lh + ' 0 0 1 ' + blh + ',0')
  steps.push('a ' + lh + ', ' + lh + ' 0 1 1 ' + (-blh) + ',0')
  steps.push('m ' + blh + ',0')
  steps.push('h ' + (w - blh - d))
  steps.push('v ' + h)
  var a = ' a ' + r + ', ' + r + ' 0 0 1 '
  var c8n = block.nextConnection
  if (c8n && c8n.isConnected()) {
    steps.push('h ' + (-w))
  } else {
    steps.push('h ' + (-w + r) + a + (-r) + ',' + (-r))
    h -= r
  }
  steps.push('v ' + (-h + r) + a + r + ',' + (-r))
  steps.push('h ' + (d - r))
  return steps.join(' ')
} /* eslint-enable indent */

eYo.DelegateSvg.Control.prototype.shapePathDef_ =
  eYo.DelegateSvg.Control.prototype.contourPathDef_ =
    eYo.DelegateSvg.Control.prototype.highlightPathDef_ =
      eYo.DelegateSvg.Control.prototype.controlPathDef_

eYo.DelegateSvg.Control.prototype.willRender_ = function (block) {
  eYo.DelegateSvg.Control.superClass_.willRender_.call(this, block)
  block.width = Math.max(block.width, 2 * eYo.Font.tabWidth)
}

/**
 * Initialize a block.
 * @param {!Blockly.Block} block to be initialized..
 * @extends {Blockly.Block}
 * @constructor
 */
eYo.DelegateSvg.Control.prototype.postInitSvg = function (block) {
  eYo.DelegateSvg.Control.superClass_.postInitSvg.call(this, block)
  this.svgPathPlay_ = Blockly.utils.createSvgElement('path',
    {'class': 'eyo-path-play'}, block.svgGroup_)
  this.svgPathPlay_.setAttribute('d', this.playPathDef_(block, 0))
  this.mouseDownWrapper_ =
    Blockly.bindEventWithChecks_(this.svgPathPlay_, 'mousedown', this,
      function (event) {
        if (!block.nextConnection.isConnected()) {
          var dialogModal = new goog.ui.Dialog('eyo-modal-dialog', true)
          dialogModal.setTextContent(eYo.Msg.CONNECT_MAIN_BLOCK_DLG_CONTENT)
          dialogModal.setTitle(eYo.Msg.CONNECT_MAIN_BLOCK_DLG_TITLE)
          dialogModal.setButtonSet(goog.ui.Dialog.ButtonSet.createOk())
          goog.events.listen(dialogModal, goog.ui.Dialog.EventType.SELECT, function (e) {})
          dialogModal.setVisible(true)
        }
        console.log('Start executing ' + block.id)
      })
  goog.dom.insertSiblingAfter(this.svgPathPlay_, this.svgPathContour_)
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Control.prototype.populateContextMenuComment = function (block, mgr) {
}

/**
 * Deletes or nulls out any references to COM objects, DOM nodes, or other
 * disposable objects...
 * @protected
 */
eYo.DelegateSvg.Control.prototype.disposeInternal = function () {
  goog.dom.removeNode(this.svgPathPlay_)
  this.svgPathPlay_ = undefined
  if (this.mouseDownWrapper_) {
    Blockly.unbindEvent_(this.mouseDownWrapper_)
    this.mouseDownWrapper_ = null
  }
  eYo.DelegateSvg.superClass_.disposeInternal.call(this)
}

/**
 * Render one input of value block.
 * @param io
 * @private
 */
eYo.DelegateSvg.Control.prototype.renderDrawInput_ = function (io) {
}

/**
 * Render the leading # character for commented statement blocks.
 * Statement subclasses must override it.
 * @param io
 * @private
 */
eYo.DelegateSvg.Control.prototype.renderDrawSharp_ = function (io) {
}

/**
 * Class for a DelegateSvg, start_stmt.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Control.makeSubclass('start_stmt', {
  statement: {
    previous: {
      check: null
    }
  }
})

eYo.DelegateSvg.Control.T3s = [
  eYo.T3.Stmt.start_stmt
]