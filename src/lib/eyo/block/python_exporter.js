/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview General python support.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.PythonExporter')

goog.require('eYo')
goog.require('eYo.XRE')
goog.require('eYo.Slot')
goog.require('eYo.DelegateSvg')
goog.require('eYo.FieldTextInput')

/**
 * Python code generator.
 * For edython.
 * @param {?string} One indentation, defaults to 4 spaces.
 * @constructor
 */
eYo.PythonExporter = function (oneIndent) {
  this.lines = []
  this.indents = []
  this.indent = ''
  this.oneIndent = oneIndent || this.constructor.indent
  this.depth = 0
}

/**
 * Default indentation.
 * For edython.
 */
eYo.PythonExporter.indent = '    '

/**
 * Indent, must be balanced by a dedent.
 */
eYo.PythonExporter.prototype.indent_ = function () {
  this.indents.push(this.indent)
  this.indent += this.oneIndent
}

/**
 * dedent, must be balanced by an indent.
 */
eYo.PythonExporter.prototype.dedent_ = function () {
  this.indent = this.indents.pop()
}

/**
 * Insert a newline_ array.
 */
eYo.PythonExporter.prototype.newline_ = function () {
  this.line && this.lines.push(this.line.join(''))
  this.line = [this.indent]
  this.isFirst = true
  this.shouldSeparateField = false
  this.wasSeparatorField = false
}

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @param {?Object} opt  See the eponym parameter in `eYo.Xml.domToBlock`.
 * @return some python code
 */
eYo.PythonExporter.prototype.exportExpression_ = function (block, opt) {
  var field, input, slot
  var eyo = block.eyo
  if ((field = eyo.fromStartField)) {
    do {
      this.exportField_(field, opt)
    } while ((field = field.eyo.nextField))
  }
  if ((slot = eyo.headSlot)) {
    do {
      this.exportSlot_(slot, opt)
    } while ((slot = slot.next))
  } else {
    // list blocks
    block.eyo.consolidate()
    block.eyo.forEachInput((input) => {
      if (input !== eyo.inputSuite) {
        this.exportInput_(input, opt)
      }
    })
  }
  if ((field = eyo.toEndField)) {
    do {
      this.exportField_(field, opt)
    } while ((field = field.eyo.nextField))
  }
}

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @param {?Object} opt  flags, `is_deep` whether next blocks should be exported too.
 * @return some python code
 */
eYo.PythonExporter.prototype.export = function (block, opt) {
  opt = opt || {}
  var eyo = block.eyo
  var is_deep = !eyo.isControl && opt.is_deep
  this.newline_()
  eYo.Events.groupWrap(() => {
    eYo.Do.tryFinally(() => {
      ++this.depth
      this.expression = []
      var input, target
      this.exportExpression_(block, opt)
      if ((input = eyo.inputSuite)) {
        var f = () => {
          if ((target = input.connection.targetBlock())) {
            eYo.Do.tryFinally(() => {
              opt.is_deep = true
              this.export(target, opt)
            }, () => {
              opt.is_deep = is_deep
            })
          } else {
            this.newline_()
            this.line.push('MISSING STATEMENT')
          }
        }
        if (eyo.isControl) {
          f()
        } else {
          eYo.Do.makeWrapper(() => {
            this.indent_()
          }, () => {
            this.dedent_()
          })(f)
        }
      }
      if (is_deep && block.nextConnection && (target = block.nextConnection.targetBlock())) {
        this.export(target, opt)
      }  
    }, () => {
      --this.depth
    })
  })
  if (!this.depth) {
    this.newline_()
    return this.lines.join('\n')
  }
}

/**
 * Export the field, which must be defined.
 *
 * @param {!Blockly.Field}
 * @private
 */
eYo.PythonExporter.prototype.exportField_ = function (field) {
  if (field.isVisible()) {
    var text = (field.getPythonText_ && field.getPythonText_()) || field.getText()
    var eyo = field.eyo
    if (!text.length) {
      text = eyo.data && goog.isDef(eyo.data.model.placeholder) && eYo.Do.valueOf(eyo.data.model.placeholder, field) || ''
    }
    if (text.length) {
      this.isSeparatorField = field.name === 'separator' || (eyo.model && eyo.model.separator)
      // if the text is void, it can not change whether
      // the last character was a letter or not
      if (!this.isSeparatorField && !this.wasSeparatorField  && this.shouldSeparateField && !this.starSymbol && (eYo.XRE.operator.test(text[0]) || text[0] === '.' || eYo.XRE.id_continue.test(text[0]) || eyo.isEditing)) {
        // add a separation
        this.line.push(' ')
      }
      this.line.push(text)
      this.shouldSeparateField = eYo.XRE.id_continue.test(text[text.length - 1]) ||
      eYo.XRE.operator.test(text[text.length - 1]) ||
      text[text.length - 1] === ':' ||
      (text[text.length - 1] === '.' && !(field instanceof eYo.FieldTextInput))
      this.starSymbol = (this.isFirst && (['*', '@', '+', '-', '~', '.'].indexOf(text[text.length - 1]) >= 0))
      this.isFirst = false
      this.wasSeparatorField = this.isSeparatorField
      this.isSeparatorField = false
    }
  }
}

/**
 * Export the given slot in.
 * @param {Blockly.Input} input
 * @param {Blockly.Field} input
 * @private
 */
eYo.PythonExporter.prototype.exportInput_ = function (input, bindField) {
  if (input && input.isVisible() && input.connection) {
    var c8n = input.connection
    var target = c8n.targetBlock()
    if (target) {
      this.exportExpression_(target)
    } else if (!c8n.eyo.optional_ && !c8n.eyo.disabled_ && !c8n.eyo.s7r_ && !bindField) {
      this.line.push('<MISSING EXPRESSION>')
      // NEWLINE
    } else {
      for (var j = 0, field; (field = input.fieldRow[j++]);) {
        this.exportField_(field)
      }
    }
  }
}

/**
 * Export the given slot in.
 * @param {eYo.Slot} slot
 * @private
 */
eYo.PythonExporter.prototype.exportSlot_ = function (slot) {
  if (slot.isIncog()) {
    return
  }
  var bindField
  if ((bindField = slot.bindField)) {
    var c8n = slot.input && slot.input.connection
    bindField.setVisible(!c8n || !c8n.targetBlock())
  }
  var field
  if ((field = slot.fromStartField)) {
    do {
      this.exportField_(field)
    } while ((field = field.eyo.nextField))
  }
  this.exportInput_(slot.input, bindField)
  if ((field = slot.toEndField)) {
    do {
      this.exportField_(field)
    } while ((field = field.eyo.nextField))
  }
}
