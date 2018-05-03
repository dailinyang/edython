/**
 * ezPython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License CeCILL-B
 */
/**
 * @fileoverview ezP.Data is a class for a data controller.
 * It merely provides the API.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.require('ezP')
goog.provide('ezP.Data')

/**
 * Base property constructor.
 * For ezPython.
 * @param {!Object} owner The object owning the data.
 * @param {!string} key name of the data.
 * @param {!Object} model contains methods and properties.
 * It is shared by all data controllers belonging to the same kind
 * of owner. Great care should be taken when editing this model.
 */
ezP.Data = function(owner, key, model) {
  goog.asserts.assert(owner, 'Missing owner')
  goog.asserts.assert(key, 'Missing key')
  goog.asserts.assert(model, 'Missing model')
  this.owner_ = owner // circular reference
  this.ui = owner.ui
  this.data = owner.data
  this.value_ = undefined
  this.key = key
  this.model = model
  this.upperKey = key[0].toUpperCase()+key.slice(1)
  this.name = 'ezp:'+(this.model.name || this.key).toLowerCase()
  this.noUndo = model.noUndo
  this.disabled_ = false
}

/**
 * Get the owner of the data.
 * Actually, this is a block delegate.
 */
ezP.Data.prototype.getOwner = function() {
  return this.owner_
}

/**
 * Get the value of the data
 * @param {Object} newValue
 */
ezP.Data.prototype.get = function() {
  if (goog.isDef(this.value_) || this.lock_get) {
    return this.value_
  }
  if (this.init) {
    try {
      this.lock_get = true
      this.init()
    } finally {
      delete this.lock_get
    }
  }
  return this.value_
}

/**
 * When not undefined, this is the default used to initialize
 * the value. May be an index in the the `all` array.
 * If this is a function it is evaluated with no argument
 * and the result is used as default.
 * May be overriden by the model.
 */
ezP.Data.prototype.default = undefined

/**
 * Set the value with no extra task.
 * The `set` method will use hooks before and after the change.
 * No such thing here.
 * If the given value is an index, use instead the corresponding
 * item in the `getAll()` array.
 */
ezP.Data.prototype.internalSet = function(newValue) {
  if (goog.isNumber(newValue)) {
    var all = this.getAll()
    if (all && goog.isDefAndNotNull(all = all[newValue])) {
      newValue = all
    }
  }
  this.value_ = newValue
}

/**
 * Init the value of the property.
 * May be overriden by the model.
 * If the model contains:
 * default: foo,
 * then the initial value will be foo,
 * even if it is not a valid data.
 */
ezP.Data.prototype.init = function() {
  if (goog.isFunction(this.model.init)) {
    this.model.init.call(this)
    return
  }
  if (goog.isFunction(this.model.default)) {
    this.internalSet(this.model.default.call(this))
  } else if (goog.isDefAndNotNull(this.model.default)) {
    this.internalSet(this.model.default)
  } else {
    // initialize the data with the first object of the `all` array
    var all = this.getAll()
    if (all && all.length) {
      this.internalSet(all[0])
    }
  }
}

/**
 * When not undefined, this is the array of all possible values.
 * May be overriden by the model.
 * Do not use this directly because this can be a function.
 * Always use `getAll` instead.
 */
ezP.Data.prototype.all = undefined

/**
 * Get all the values.
 */
ezP.Data.prototype.getAll = function() {
  var all = this.model.all
  return goog.isArray(all) && all || goog.isFunction(all) && goog.isArray(all = all()) && all 
}

/**
 * Validates the value of the property
 * May be overriden by the model.
 * @param {Object} newValue
 */
ezP.Data.prototype.validate = function(newValue) {
  if (goog.isFunction(this.model.validate)) {
    return this.model.validate.call(this, newValue)
  }
  var ezp = this.owner_
  var block = ezp.block_
  var key = 'validate' + this.upperKey
  var all = this.getAll()
  return ezp[key] && ezp[key].call(ezp, block, newValue) || (!all || all.indexOf(newValue) >= 0) && {validated: newValue} || null
}

/**
 * Returns the text representation of the data.
 * @param {Object} newValue
 */
ezP.Data.prototype.toText = function() {
  if (goog.isFunction(this.model.toText)) {
    return this.model.toText.call(this, newValue)
  }
  return this.get() || ''
}

/**
 * Set the value from the given text representation.
 * @param {Object} newValue
 */
ezP.Data.prototype.fromText = function(txt) {
  if (goog.isFunction(this.model.fromText)) {
    this.model.fromText.call(this, newValue)
    return
  }
  this.set(txt)
}

/**
 * Will change the value of the property.
 * The signature is `willChange( oldValue, newValue ) → void`
 * May be overriden by the model.
 * @param {Object} oldValue
 * @param {Object} newValue
 * @return undefined
 */
ezP.Data.prototype.willChange = function(oldValue, newValue) {
  if (goog.isFunction(this.model.willChange)) {
    this.model.willChange.call(this, oldValue, newValue)
    return
  }
  var ezp = this.owner_
  var block = ezp.block_
  var key = 'willChange' + this.upperKey
  ezp[key] && ezp[key].call(ezp, block, oldValue, newValue)
}

/**
 * Private wrapper over willChange
 * @param {Object} oldValue
 * @param {Object} newValue
 * @return undefined
 */
ezP.Data.prototype._willChange = function(oldValue, newValue) {
  if (this.lock_willChange) {
    return
  }
  try {
    this.lock_willChange = true
    this.willChange(oldValue, newValue)
  } finally {
    delete this.lock_willChange
  }
}

/**
 * Did change the value of the property.
 * The signature is `didChange( oldValue, newValue ) → void`
 * May be overriden by the model.
 * @param {Object} oldValue
 * @param {Object} newValue
 * @return undefined
 */
ezP.Data.prototype.didChange = function(oldValue, newValue) {
  if (goog.isFunction(this.model.didChange)) {
    this.model.didChange.call(this, oldValue, newValue)
    return
  }
  var ezp = this.owner_
  var block = ezp.block_
  var key = 'didChange' + this.upperKey
  ezp[key] && ezp[key].call(ezp, block, oldValue, newValue)
}

/**
 * Private wrapper over didChange
 * @param {Object} oldValue
 * @param {Object} newValue
 * @return undefined
 */
ezP.Data.prototype._didChange = function(oldValue, newValue) {
  if (this.lock_didChange) {
    return
  }
  try {
    this.lock_didChange = true
    this.didChange(oldValue, newValue)
  } finally {
    delete this.lock_didChange
  }
}

/**
 * Wether a value change fires an undo event.
 * May be overriden by the model.
 */
ezP.Data.prototype.noUndo = undefined

/**
 * Synchronize the value of the property with the UI.
 * May be overriden by the model.
 * @param {Object} newValue
 */
ezP.Data.prototype.synchronize = function(newValue) {
  if (goog.isFunction(this.model.synchronize)) {
    this.model.synchronize.call(this, newValue)
    return
  }
  var ezp = this.owner_
  var block = ezp.block_
  var key = 'synchronize' + this.upperKey
  ezp[key] && ezp[key].call(ezp, block, newValue)
}

/**
 * Consolidate the data.
 * May be overriden by the model.
 * @param {Object} newValue
 */
ezP.Data.prototype.consolidate = function() {
  if (goog.isFunction(this.model.consolidate)) {
    this.model.consolidate.call(this)
    return
  }
  var ezp = this.owner_
  var block = ezp.block_
  var key = 'consolidate' + this.upperKey
  ezp[key] && ezp[key].call(ezp, block)
}

/**
 * set the value of the property without any validation.
 * If the value is a number, change to the corresponding item
 * in the `getAll()` array.
 * @param {Object} newValue
 */
ezP.Data.prototype.setTrusted = function (newValue) {
  if (goog.isNumber(newValue)) {
    var all = this.getAll()
    if (all && goog.isDefAndNotNull(all = all[newValue])) {
      newValue = all
    }
  }
  this.setTrusted_(newValue)
}

/**
 * set the value of the property without any validation.
 * @param {Object} newValue
 */
ezP.Data.prototype.setTrusted_ = function (newValue) {
  var oldValue = this.value_
  this._willChange(oldValue, newValue)
  this.value_ = newValue
  this._didChange(oldValue, newValue)
  this.synchronize(newValue)
}

/**
 * set the value of the property,
 * with validation, undo and synchronization.
 * Always synchronize, even when no value changed.
 * @param {Object} newValue
 */
ezP.Data.prototype.set = function (newValue) {
  if (goog.isNumber(newValue)) {
    var all = this.getAll()
    if (all && goog.isDefAndNotNull(all = all[newValue])) {
      newValue = all
    }
  }
  if ((this.value_ === newValue) || !(newValue = this.validate(newValue)) || !goog.isDef(newValue = newValue.validated)) {
    this.synchronize(this.value_)
    return false
  }
  this.setTrusted_(newValue)
  return true
}

/**
 * Disabled data correspond to diabled input.
 * Changing this value will cause an UI synchronization.
 * Always synchronize, even when no value changed.
 * @param {Object} newValue
 */
ezP.Data.prototype.setDisabled = function(newValue) {
  this.disabled_ = newValue
  this.synchronize(this.value_)
}
/**
 * Disabled data correspond to diabled input.
 * Changing this value will cause an UI synchronization.
 * Always synchronize, even when no value changed.
 * @param {Object} newValue
 */
ezP.Data.prototype.isDisabled = function() {
  return this.disabled_
}

/**
 * Consolidate the value.
 * Should be overriden by the model.
 * Reentrant management here.
 * @param {Object} newValue
 */
ezP.Data.prototype.consolidate = function() {
  if (this.consolidate_lock) {
    return
  }
  if (goog.isFunction(this.model.consolidate)) {
    this.consolidate_lock = true
    try {
      this.model.consolidate.call(this)
    } finally {
      delete this.consolidate_lock
    }
  }
}

/**
 * An active data is not explicitely disabled, and does contain text.
 * @param {!number} index  of the input older in the ui object 
 * @param {!boolean} newValue.
 * @private
 */
ezP.Data.prototype.isActive = function () {
  return !!this.required || ! this.disabled_ && goog.isString(this.value_) && this.value_.length
}

console.warn ('Change the model design for i_(\d): {...} to $1: {...}')
/**
 * Set the value of the main field given by its key.
 * @param {!Object} newValue.
 * @param {!number} inputIndex  of the input in the model (i_1, i_2...) 
 * When false, this corresponds to the fields that are not
 * part of an input, like the modifier field.
 * @param {string|null} fieldKey  of the input holder in the ui object 
 * @param {boolean} noUndo  true when no undo tracking should be performed. 
 * @private
 */
ezP.Data.prototype.setFieldValue = function (newValue) {
  goog.asserts.assert(this.field, 'No field bound.')
  Blockly.Events.disable()
  try {
    this.field.setValue(newValue)
  } finally {
    Blockly.Events.enable()
  }
}

/**
 * Set the visible status of the field in the input given by its index
 * and the key.
 * @param {!Object} newValue.
 */
ezP.Data.prototype.setFieldVisible = function (newValue) {
  this.field.setVisible(newValue)
}

/**
 * Set the enable/disable status of the given input.
 * @param {!number} index  of the input older in the ui object 
 * @param {!boolean} newValue.
 * @private
 */
ezP.Data.prototype.setInputDisabled = function (newValue) {
  goog.asserts.assert(this.input, 'Missing input binding')
  this.input.setDisabled(newValue)
}

/**
 * Set the value of the main field given by its key.
 * @param {!Object} newValue.
 * @param {!number} inputIndex  of the input in the model (i_1, i_2...) 
 * When false, this corresponds to the fields that are not
 * part of an input, like the modifier field.
 * @param {string|null} fieldKey  of the input holder in the ui object 
 * @param {boolean} noUndo  true when no undo tracking should be performed. 
 * @private
 */
ezP.Data.prototype.setMainFieldValue = function (newValue, fieldKey, noUndo) {
  var field = this.ui.fields[fieldKey || this.key]
  if (field) {
    Blockly.Events.disable()
    try {
      field.setValue(newValue)
    } finally {
      Blockly.Events.enable()
    }
  }
}

/**
 * Set the visible status of the field in the input given by its index
 * and the key.
 * @param {!Object} newValue.
 * @param {!number} inputIndex  of the input in the model (i_1, i_2...) 
 * When false, this corresponds to the fields that are not
 * part of an input, like the modifier field.
 * @param {string|null} fieldKey  of the input holder in the ui object 
 * @private
 */
ezP.Data.prototype.setFieldVisible = function (newValue, inputIndex, fieldKey) {
  var i = inputIndex && this.ui[inputIndex] || this.ui
  var field = i.fields[fieldKey || this.key]
  if (field) {
    field.setVisible(newValue)
  }
}