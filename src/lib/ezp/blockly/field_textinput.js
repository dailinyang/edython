/**
 * ezPython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License CeCILL-B
 */
/**
 * @fileoverview utilities for ezPython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('ezP.FieldTextInput')
goog.provide('ezP.FieldInput')

goog.require('Blockly.FieldTextInput')

goog.provide('ezP.FieldHelper')


/**
 * Class for an editable text field helper.
 * @param {ezP.TextInputField} owner  The owner of the field.
 * @constructor
 */
ezP.FieldHelper = function (owner) {
  this.owner_ = owner
  owner.ezp = this
}

/**
 * Class for an editable text field.
 * @param {string} text The initial content of the field.
 * @param {Function=} optValidator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {Blockly.Field}
 * @constructor
 */
ezP.FieldTextInput = function (text, optValidator) {
  new ezP.FieldHelper(this)
  ezP.FieldTextInput.superClass_.constructor.call(this, text,
    optValidator)
}
goog.inherits(ezP.FieldTextInput, Blockly.FieldTextInput)

/**
 * The HTML input element for the user to type, or null if no FieldTextInput
 * editor is currently open.
 * @type {HTMLInputElement}
 * @private
 */
ezP.FieldTextInput.htmlInput_ = null;

/**
 * Install this field on a block.
 */
ezP.FieldTextInput.prototype.init = function () {
  if (this.fieldGroup_) {
    // Field has already been initialized once.
    return
  }
  // Build the DOM.
  this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null)
  if (this.ezp.tile) {
    this.ezp.tile.getSvgRoot().appendChild(this.fieldGroup_)
  } else {
    this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_)
  }
  this.borderRect_ = Blockly.utils.createSvgElement('rect',
    { class: 'ezp-none',
      rx: 0,
      ry: 0,
      x: -ezP.Style.Edit.padding_h,
      y: -ezP.Style.Edit.padding_v,
      height: ezP.Font.height + 2*ezP.Style.Edit.padding_v},
    this.fieldGroup_, this.sourceBlock_.workspace)

  this.editRect_ = Blockly.utils.createSvgElement('rect',
    { class: 'ezp-edit',
      'rx': ezP.Style.Edit.radius,
      'ry': ezP.Style.Edit.radius,
      'x': -ezP.Style.Edit.padding_h - (this.ezp.left_space? ezP.Font.space:0),
      'y': -ezP.Style.Edit.padding_v,
      'height': ezP.Font.height + 2*ezP.Style.Edit.padding_v},
    this.fieldGroup_, this.sourceBlock_.workspace)

  /** @type {!Element} */
  this.textElement_ = Blockly.utils.createSvgElement('text',
    {'class': this.cssClass, 'y': ezP.Font.totalAscent},
    this.fieldGroup_)
  this.updateEditable()
  this.fieldGroup_.appendChild(this.textElement_)
  this.mouseDownWrapper_ =
  Blockly.bindEventWithChecks_(this.fieldGroup_, 'mousedown', this, this.onMouseDown_
  )
  // Force a render.
  this.render_()
}

/**
 * Updates the width of the field. This calls getCachedWidth which won't cache
 * the approximated width on IE/Edge when `getComputedTextLength` fails. Once
 * it eventually does succeed, the result will be cached.
 **/
ezP.FieldTextInput.prototype.updateWidth = function () {
  ezP.FieldTextInput.superClass_.updateWidth.call(this)
  var width = Blockly.Field.getCachedWidth(this.textElement_)
  if (this.editRect_) {
    this.editRect_.setAttribute('width', width+2*ezP.Style.Edit.padding_h+(this.ezp.left_space? ezP.Font.space: 0))
  }
}

/**
 * Dispose of all DOM objects belonging to this editable field.
 */
ezP.FieldTextInput.prototype.dispose = function() {
  ezP.FieldTextInput.superClass_.dispose.call(this)
  this.editRect_ = null;
};

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
ezP.FieldTextInput.prototype.CURSOR = 'text'

/**
 * css class for both the text element and html input.
 */
ezP.FieldTextInput.prototype.cssClass = 'ezp-code'

/**
 * Show the inline free-text editor on top of the text.
 * @param {boolean=} optQuietInput True if editor should be created without
 *     focus.  Defaults to false.
 * @private
 */
ezP.FieldTextInput.prototype.showEditor_ = function (optQuietInput) {
  var block = this.sourceBlock_
  if (block.ezp.locked_ || !block.ezp.canEdit_) {
    return
  }
  this.ezp.isEditing = true
  this.editRect_ && goog.dom.classlist.add(this.editRect_, 'ezp-editing')
  Blockly.Events.setGroup(true)
  this.ezp.grouper_ = Blockly.Events.getGroup()
  this.onStartEditing_ && this.onStartEditing_()
  this.ezp.onStartEditing_ && this.ezp.onStartEditing_.call(this)
  var model = this.ezp.model
  if (model) {
    if (goog.isFunction(model.startEditing)) {
      model.startEditing.call(this)
    } else if (model.startEditing) {
      this.ezp.constructor.onStartEditing.call(this)
    }
  }
  block.ezp.startEditingField && block.ezp.startEditingField(block, this)
  this.render_()
  block.render()
  this.workspace_ = block.workspace
  var quietInput = optQuietInput || false
  if (!quietInput && (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD)) {
    this.showPromptEditor_()
  } else {
    this.showInlineEditor_(quietInput)
  }
}

/**
 * Create and show a text input editor that is a prompt (usually a popup).
 * Mobile browsers have issues with in-line textareas (focus and keyboards).
 * @private
 */
ezP.FieldTextInput.prototype.showPromptEditor_ = function () {
  var field = this
  Blockly.prompt(Blockly.Msg.CHANGE_VALUE_TITLE, this.text_,
    function (newValue) {
      if (field.sourceBlock_) {
        newValue = field.callValidator(newValue)
      }
      field.setValue(newValue)
    })
}

/**
 * Create and show a text input editor that sits directly over the text input.
 * @param {boolean} quietInput True if editor should be created without
 *     focus.
 * @private
 */
ezP.FieldTextInput.prototype.showInlineEditor_ = function (quietInput) {
  var dispose = this.widgetDispose_()
  Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, dispose)
  var div = Blockly.WidgetDiv.DIV
  // Create the input.
  var htmlInput =
      goog.dom.createDom(goog.dom.TagName.INPUT, 'ezp-html-input')
  htmlInput.setAttribute('spellcheck', this.spellcheck_)
  
  goog.dom.classlist.add(div, this.cssClass)
  goog.dom.classlist.add(htmlInput, this.cssClass)
  if (this.ezp.comment) {
    goog.dom.classlist.remove(htmlInput, 'ezp-code')
    goog.dom.classlist.add(htmlInput, 'ezp-code-comment')
  }
  ezP.FieldTextInput.htmlInput_ = Blockly.FieldTextInput.htmlInput_ = htmlInput
  div.appendChild(htmlInput)

  htmlInput.value = htmlInput.defaultValue = this.text_
  htmlInput.oldValue_ = null
  this.validate_()
  this.resizeEditor_()
  if (!quietInput) {
    htmlInput.focus()
    htmlInput.select()
  }
  this.bindEvents_(htmlInput)
}

/**
 * Close the editor, save the results, and dispose of the editable
 * text field's elements.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
ezP.FieldTextInput.prototype.widgetDispose_ = function () {
  var field = this
  return function () {
    field.ezp.isEditing = false
    field.editRect_ && goog.dom.classlist.remove(field.editRect_, 'ezp-editing')
    field.callValidator()
    field.onEndEditing_ && field.onEndEditing_()
    field.ezp.onEndEditing_ && field.ezp.onEndEditing_.call(field)
    var model = field.ezp.model
    if (model) {
      if (goog.isFunction(model.endEditing)) {
        model.endEditing.call(field)
      } else if (model.endEditing) {
        field.ezp.constructor.onEndEditing.call(field)
      }
    }
    var block = field.sourceBlock_
    block.ezp.endEditingField && block.ezp.endEditingField(block, field)  
    if (field.ezp.grouper_) {
      Blockly.Events.setGroup(false)
      delete field.ezp.grouper_
    }
    field.render_()
    block.render()
    ezP.FieldTextInput.superClass_.widgetDispose_.call(field)
    Blockly.WidgetDiv.DIV.style.fontFamily = ''
  }
}

/**
 * Override to noop.
 * @inherited
 */
ezP.FieldTextInput.prototype.updateEditable = function() {
};

/**
 * Check to see if the contents of the editor validates.
 * Style the editor accordingly.
 * @private
 */
ezP.FieldTextInput.prototype.validate_ = function() {
  var valid = true;
  goog.asserts.assertObject(ezP.FieldTextInput.htmlInput_);
  var htmlInput = ezP.FieldTextInput.htmlInput_;
  if (this.sourceBlock_) {
    valid = this.callValidator(htmlInput.value);
  }
  if (valid === null) {
    this.ezp.error = true
    goog.dom.classlist.add(ezP.FieldTextInput.htmlInput_, 'ezp-code-error')
  } else {
    this.ezp.error = false
    goog.dom.classlist.remove(ezP.FieldTextInput.htmlInput_, 'ezp-code-error')
  }
};

/**
 * Resize the editor and the underlying block to fit the text. Adds an horizontal space to hold the next character.
 * @private
 */
ezP.FieldTextInput.prototype.resizeEditor_ = function () {
  if (this.fieldGroup_) {
    var div = Blockly.WidgetDiv.DIV
    var bBox = this.fieldGroup_.getBBox()
    div.style.width = (bBox.width+ezP.Font.space-(this.ezp.left_space? ezP.Font.space: 0)-ezP.Style.Edit.padding_h) * this.workspace_.scale + 'px'
    div.style.height = bBox.height * this.workspace_.scale + 'px'
    var xy = this.getAbsoluteXY_()
    div.style.left = (xy.x - ezP.EditorOffset.x+ezP.Style.Edit.padding_h) + 'px'
    div.style.top = (xy.y - ezP.EditorOffset.y) + 'px'
  }
}

/**
 * Class for an editable code field.
 * @param {string} text The initial content of the field.
 * @param {Function=} optValidator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {ezP.FieldTextInput}
 * @constructor
 */
ezP.FieldInput = function (text, optValidator, key) {
  goog.asserts.assert(key, 'missing key for an editable field')
  ezP.FieldInput.superClass_.constructor.call(this, text,
    optValidator)
  this.spellcheck_ = false
  this.ezp.key = key
}
goog.inherits(ezP.FieldInput, ezP.FieldTextInput)

/**
 * Get the text from this field as displayed on screen.  May differ from getText
 * due to ellipsis, and other formatting.
 * @return {string} Currently displayed text.
 * @private
 */
ezP.FieldInput.prototype.getDisplayText_ = function() {
  if (this.ezp.placeholder && !this.ezp.isEditing) {
    return this.placeholderText()
  }
  return ezP.FieldInput.superClass_.getDisplayText_.call(this)
}

/**
 * The placeholder text.
 * Get the model driven value if any.
 * @return {string} Currently displayed text.
 * @private
 */
ezP.FieldInput.prototype.placeholderText = function() {
  if (this.placeholderText_) {
    return this.placeholderText_
  }
  return function() {
    var model = this.ezp && this.ezp.model
    if (model) {
      var placeholder = model.placeholder
      return goog.isString(placeholder) &&  placeholder || goog.isFunction(placeholder) &&  placeholder.call(this)
    }
  }.call(this) || ezP.Msg.Placeholder.CODE
}

/**
 * By default there is no difference between the human-readable text and
 * the language-neutral values.  Subclasses (such as dropdown) may define this.
 * @param {string} newValue New value.
 */
ezP.FieldInput.prototype.setValue = function(newValue) {
  this.ezp.placeholder = !newValue || !newValue.length 
  ezP.FieldInput.superClass_.setValue.call(this, newValue)
}

/**
 * Adds a 'ezp-code-error' class in case of error.
 * @private
 * @override
 */
ezP.FieldInput.prototype.render_ = function() {
  if (!this.textElement_) {
    // not yet available
    return
  }
  ezP.FieldInput.superClass_.render_.call(this)
  if (this.ezp.error) {
    goog.dom.classlist.add(this.textElement_, 'ezp-code-error')
  } else {
    goog.dom.classlist.remove(this.textElement_, 'ezp-code-error')
  }
  if (this.ezp.placeholder) {
    goog.dom.classlist.add(this.textElement_, 'ezp-code-placeholder')
  } else {
    goog.dom.classlist.remove(this.textElement_, 'ezp-code-placeholder')
  }
  if (this.ezp.comment) {
    goog.dom.classlist.add(this.textElement_, 'ezp-code-comment')
  } else {
    goog.dom.classlist.remove(this.textElement_, 'ezp-code-comment')
  }
}

/**
 * Default method to start editing.
 * @this is a field owning an helper
 */
ezP.FieldHelper.onStartEditing = function () {
}

/**
 * Default method to end editing.
 * @this is a field owning an helper
 */
ezP.FieldHelper.onEndEditing = function () {
  this.ezp.data.fromText(this.getValue())
}

/**
 * Set the keyed data of the source block to the given value.
 * Eventual problem: there might be some kind of formatting such that
 * the data stored and the data shown in the ui are not the same.
 * There is no step for such a translation but the need did not occur yet.
 * @param {Object} newValue
 * @param {string|null} key  The data key, when null or undefined, ths receiver's key.
 * @constructor
 */
ezP.FieldHelper.prototype.getData_ = function (key) {
  var data = this.data
  if (!data) {
    var block = this.owner_.sourceBlock_
    data = block && block.ezp.data[key || this.key]
    goog.asserts.assert(data,
    ezP.Do.format('No data bound to field {0}/{1}', key || this.key, block && block.type))
  }
  return data
}

/**
 * Set the keyed data of the source block to the given value.
 * Eventual problem: there might be some kind of formatting such that
 * the data stored and the data shown in the ui are not the same.
 * There is no step for such a translation but the need did not occur yet.
 * @param {Object} newValue
 * @param {string|null} key  The data key, when null or undefined, ths receiver's key.
 * @constructor
 */
ezP.FieldHelper.prototype.setData = function (newValue, key) {
  this.getData_(key).set(newValue)
}

/**
 * Validate the keyed data of the source block.
 * @param {Object} newValue
 * @param {string|null} key  The data key, when null or undefined, ths receiver's key.
 * @constructor
 */
ezP.FieldHelper.prototype.validate = function (txt) {
    var d = this.data
    var v = d && d.validate(goog.isDef(txt)? txt: this.getValue())
    return v? (goog.isDef(v.validated)? v.validated: null): txt
}
