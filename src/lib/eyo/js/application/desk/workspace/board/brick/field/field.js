/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */

/**
 * @fileoverview Label fields and input fields.
 */
'use strict';

eYo.require('Protocol')
eYo.require('C9r.BSMOwned')

eYo.provide('Field')

eYo.forwardDeclare('Size')
eYo.forwardDeclare('Events')

Object.defineProperties(eYo.Field, {
  STATUS_NONE: { value: '' }, // names correspond to `eyo-code-...` css class names
  STATUS_COMMENT: { value: 'comment' },
  STATUS_RESERVED: { value: 'reserved' },
  STATUS_BUILTIN: { value: 'builtin' },
})

{
  var startEditing = function () {
  }
  var endEditing = function () {
    var data = this.data
    eYo.assert(data, `No data bound to field ${this.name}/${this.brick.type}`)
    var result = this.validate(this.text)
    if (result) {
      data.fromField(result)
    } else {
      this.text = data.toText()
    }
  }
  // Change some `... = true,` entries to real functions
  var setupModel = model => {
    // no need to setup the model each time we create a new brick
    if (model.setup_) {
      return
    }
    model.setup_ = true
    if (model.startEditing === true) {
      model.startEditing = startEditing
    } else if (model.startEditing && !goog.isFunction(model.startEditing)) {
      delete model.startEditing
    }
    if (model.endEditing === true) {
      model.endEditing = endEditing
    } else if (model.endEditing && !goog.isFunction(model.endEditing)) {
      delete model.endEditing
    }
    if (!goog.isFunction(model.didLoad)) {
      delete model.didLoad
    }
    if (!goog.isFunction(model.willRender)) {
      delete model.willRender
    }
    var xml = model.xml
    if (xml) {
      if (!goog.isFunction(xml.save)) {
        delete xml.save
      }
      if (!goog.isFunction(xml.load)) {
        delete xml.load
      }
    }
  }
  /**
   * Make a field from a given model
   * @param {String} name 
   * @param {Object} model 
   * @return {eYo.FieldLabel|eYo.FieldVariable|eYo.Field.Input}
   */
  var makeField = (owner, name, model) => {
    var field
    if (eYo.isStr(model)) {
      field = new eYo.FieldLabel(owner, name, model)
    } else if (goog.isObject(model)) {
      setupModel(model)
      if (model.edit || model.endEditing || model.startEditing) {
        // this is an editable field
        field = new eYo.Field.Input(owner, name, model.edit || '')
      } else if (goog.isDefAndNotNull(model.value)) {
        // this is just a label field
        field = new eYo.FieldLabel(owner, name, model.value || '')
      } else if (goog.isDefAndNotNull(model.reserved)) {
        // this is just a label field
        field = new eYo.FieldLabel(owner, name, model.reserved)
        field.status = eYo.Field.STATUS_RESERVED
      } else if (goog.isDefAndNotNull(model.builtin)) {
        // this is just a label field
        field = new eYo.FieldLabel(owner, name, model.builtin)
        field.status = eYo.Field.STATUS_BUILTIN
      } else if (goog.isDefAndNotNull(model.comment)) {
        // this is just a label field
        field = new eYo.FieldLabel(owner, name, model.comment)
        field.status = eYo.Field.STATUS_COMMENT
      } else if (goog.isDefAndNotNull(model.status)) {
        // this is just a label field
        field = new eYo.FieldLabel(owner, name, '')
      } else { // other entries are ignored
        return
      }
      model.status && (field.status = model.status)
      field.model = model
      field.order__ = model.order__
      if (model.hidden) {
        field.visible = false
      }
    } else {
      return
    }
    field.nextField = eYo.NA // debug step
    return field
  }

  /**
   * Create all the fields from the given model.
   * For edython.
   * @param {eYo.Slot|!eYo.Magnet|!eYo.Brick} owner
   * @param {Object} fieldsModel
   */
  eYo.Field.makeFields = (owner, fieldsModel) => {
    owner.fields = owner.fields || Object.create(null)
    // field maker
    // Serious things here
    var brick = owner.brick || owner
    eYo.assert(brick, 'Missing brick while making fields')
    for (var name in fieldsModel) {
      var model = fieldsModel[name]
      var field = makeField(owner, name, model)
      if (field) {
        if (name === eYo.Key.BIND && owner instanceof eYo.Slot) {
          owner.bindField = field
        }
        owner.fields[name] = field
        eYo.assert(field.brick, 'Missing field brick while making fields')
      }
    }
    // now order
    // fields must not have the same order
    // some default fields have predefined relative order
    var byOrder = Object.create(null)
    var unordered = []
    var fromStart = [] // fields ordered from the beginning
    var toEnd = [] // // fields ordered to the end
    for (name in owner.fields) {
      field = owner.fields[name]
      var order = field.order__
      if (order) {
        eYo.assert(!goog.isDefAndNotNull(byOrder[order]),
        'Fields with the same order  %s = %s / %s',
        byOrder[order] && byOrder[order].name || 'NOTHING', field.name, owner.getBrick().type)
        byOrder[order] = field
        if (order > 0) {
          // insert this field from the start
          for (var i = 0; i < fromStart.length; i++) {
            // find the first index which corresponding order is > order
            if (fromStart[i].order__ > order) {
              break
            }
          }
          // insert the field at that position (possibly at the end)
          fromStart.splice(i, 0, field)
        } else /* if (order < 0) */ {
          // insert this field to the end
          for (i = 0; i < toEnd.length; i++) {
            // find the first index which corresponding order is < order
            if (toEnd[i].order__ < order) {
              break
            }
          }
          toEnd.splice(i, 0, field)
        }
      } else {
        // this is an unordered field
        unordered.push(field)
      }
    }
    // now order the fields in linked lists
    // Next returns the first field in a chain field.nextField -> ...
    // The chain is built from the list of arguments
    // arguments are either field names or fields
    // When field names are given, we just insert the corresponding
    // field into the chain
    // When fields are given, we insert the chain starting at that point
    // The result is a chain of fields.
    // field.nextField points to the next field of the chain
    // field.nextField.previousField is a fixed point.
    // A field is the head of a chain in one of two cases
    // 1) field.eyoLast_ is the eyo of a field (possibly the first of the chain)
    // 2) It has no previous nor next field, meaning that
    // ...nextField and ...previousField are false.
    // fields with a ...previousField cannot have a ...eyoLast_ bacuse they are not the head of the chain.
    var chain = function (/* variable argument list */) {
      // We first loop to find the first field that can be the
      // start of a chain. Every field before is ignored.
      var startField, nextField
      for (var i = 0; i < arguments.length; i++) {
        var name = arguments[i]
        if ((startField = eYo.isStr(name) ? owner.fields[name] : name)) {
          // remove this field from the list of unordered fields
          if (startField.previousField) {
            // this field already belongs to a chain
            // but it is not the first one
            // It does not fit in
            continue
          }
          // This field is acceptable as the first chain element
          var field = startField.eyoLast_ || startField
          // Now scan the next argument fields, if any
          while (++i < arguments.length) {
            name = arguments[i]
            if ((nextField = eYo.isStr(name) ? owner.fields[name] : name)) {
              if (nextField.previousField) {
                // this was not a starting point
                continue
              }
              if (nextField === startField) {
                // avoid infinite loop
                continue
              }
              field.nextField = nextField
              nextField.previousField = field
              field = nextField
              var eyoLast = field.eyoLast_
              if (eyoLast) {
                delete field.eyoLast_
                field = eyoLast
              }
            }
          }
          if (field) {
            startField.eyoLast_ = field
         } else {
            // this chain consists in a unique element
            startField.eyoLast_ = startField
          }
          break
        }
      }
      return startField
    }
    owner.fieldAtStart = chain.apply(this, fromStart)
    owner.fieldAtStart = chain(eYo.Key.MODIFIER, eYo.Key.PREFIX, eYo.Key.START, eYo.Key.LABEL, eYo.Key.SEPARATOR, owner.fieldAtStart)
    owner.toEndField = chain.apply(this, toEnd)
    owner.toEndField = chain(owner.toEndField, eYo.Key.END, eYo.Key.SUFFIX, eYo.Key.COMMENT_MARK, eYo.Key.COMMENT)
    // we have exhausted all the fields that are already ordered
    // either explicitely or not
    // Remove from unordered what has been ordered so far
    var j = unordered.length
    while (j--) {
      if (unordered[j].previousField || unordered[j].eyoLast_) {
        unordered.splice(j, 1)
      }
    }
    eYo.assert(unordered.length < 2,
      `Too many unordered fields in ${name}/${JSON.stringify(model)}`)
    unordered[0] && (owner.fieldAtStart = chain(owner.fieldAtStart, unordered[0]))
    owner.fieldAtStart && delete owner.fieldAtStart.eyoLast_
    owner.toEndField && delete owner.toEndField.eyoLast_
  }
}

/**
 * 
 * @param {eYo.Brick|eYo.Slot}
 */
eYo.Field.disposeFields = owner => {
  var fields = owner.fields
  owner.fieldAtStart = owner.toEndField = owner.fields = eYo.NA
  ;(owner instanceof eYo.Slot) && (owner.bindField = eYo.NA)
  Object.values(fields).forEach(f => f.dispose())
}

/**
 * Abstract class for text fields.
 * @param {eYo.Brick|eYo.Slot|eYo.Magnet.Dflt} bsim The owner of the field.
 * @param {string} text The initial content of the field.
 * @constructor
 */
eYo.Field.makeClass('Dflt', eYo.C9r.BSMOwned, {
  init (bsm, name, text) {
    this.name_ = name
    this.text_ = text
    this.reentrant_ = {}
    Object.defineProperty(bsm, `${name}_f`, { value: this})
    console.warn('Defer next line to the owner ?')
    bsm.hasUI && this.initUI()
  },
  value: {
    text: {
      /**
       * 
       */
      set (newValue) {
        if (!goog.isDef(newValue)) {
          // No change if null.
          return;
        }
        if (this.text__ === newValue) {
          return
        }
        eYo.Events.fireBrickChange(this.brick, 'field', this.name, this.text__, newValue)
        this.size.setFromText(this.text__ = newValue)
        this.placeholder__ = !newValue || !newValue.length
      },
    },
    visible: { value: true },
    status: { value: eYo.Field.STATUS_NONE }, // one of STATUS_... above
    isEditing: { value: false },
    editable: { value: false },
    model: { value: eYo.NA },
    /**
     * The name of field must be unique within a brick.
     * This is necessary for proper undo management.
     * Static label fields are named for practical use.
     * @readonly
     * @type {String} The name of the field
     */
    name: {},
    /**
     * @readonly
     * @type {String} The text of the field.
     */
    text: {
      validate (after) {
        return after ? String(after) : eYo.INVALID
      },
      set_ (after) {
        this.brick.change.wrap(() => this.text__ = after)
      }
    },
    /**
     * Is the field visible, or hidden due to the block being collapsed?
     * @type {boolean}
     * @private
     */
    visible: {
      /**
       * Sets whether this editable field is visible or not.
       * @param {boolean} after True if visible.
       */
      didChange (before, after) {
        var d = this.ui_driver_mngr
        d && (d.displayedUpdate(this))
        if (this.brick.rendered) {
          this.brick.render()
          after && (this.brick.ui.bumpNeighbours_())
        }
      },
    },
    css_class: {},
  },
  cloned: {
    /**
     * @readonly
     * @type {eYo.Size} The size of the field
     */
    size () {
      return new eYo.Size()
    },
  },
  computed: {
    /**
     * @readonly
     * @type {String} The text of the field.
     */
    displayText () { return this.text_ },
    /**
     * Check whether this field is currently editable.
     * Text labels are not editable and are not serialized to XML.
     * Editable fields are serialized, but may exist on locked brick.
     * @return {boolean} whether this field is editable and on an editable brick
     */
    isCurrentlyEditable () {
      return this.editable && this.brick.editable
    },
    isComment () {
      return this.status === eYo.Field.STATUS_COMMENT
    },
    isReserved () {
      return this.status === eYo.Field.STATUS_RESERVED
    },
    isBuiltin () {
      return this.status === eYo.Field.STATUS_BUILTIN
    },
  },
})

/**
 * Initializes the model of the field after it has been installed on a block.
 * No-op by default.
 */
eYo.Field.Dflt_p.initModel = eYo.Do.nothing

/**
 * Whether the field of the receiver starts with a separator.
 */
eYo.Field.Dflt_p.startsWithSeparator = function () {
  // if the text is void, it can not change whether
  // the last character was a letter or not
  var text = this.text
  if (text.length) {
    if (this.name === 'separator'
      || (this.model && this.model.separator)
      || eYo.XRE.operator.test(text[0])
      || eYo.XRE.delimiter.test(text[0])
      || text[0] === '.'
      || text[0] === ':'
      || text[0] === ','
      || text[0] === ';') {
      // add a separation before
      return true
    }
  }
}

/**
 * Draws the border with the correct width.
 * Saves the computed width in a property.
 * @private
 */
eYo.Field.Dflt_p.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0
    return
  }
  var d = this.ui_driver_mngr
  d && (d.textRemove(field), d.textCreate(field))
  this.updateWidth()
}

/**
 * Updates the width of the field in the UI.
 **/
eYo.Field.Dflt_p.updateWidth = function() {
  var d = this.ui_driver_mngr
  d && (d.updateWidth(this))
}

/**
 * Validate the keyed data of the source brick.
 * Asks the data object to do so.
 * The bound data must exist.
 * @param {String} txt
 * @return {String}
 */
eYo.Field.Dflt_p.validate = function (txt) {
  var v = this.data.validate(goog.isDef(txt) ? txt : this.text)
  return eYo.isVALID(v) ? v : null
}

/**
 * Will render the field.
 * We should call `this.willRender()` from the model.
 */
eYo.Field.Dflt_p.willRender = function () {
  var f = this.model && (eYo.Decorate.reentrant_method.call(this, 'model_willRender', this.model.willRender))
  if (f) {
    f.call(this)
  } else {
    var d = this.ui_driver_mngr
    if (d) {
      d.makePlaceholder(this, this.isPlaceholder)
      d.makeComment(this, this.isComment)
    }
  }
}

/**
 * Class for a non-editable field.
 * The only purpose is to start with a different height.
 * @param {eYo.Brick|eYo.Slot} bsi The owner of the field.
 * @param {string} name The required name of the field
 * @param {string} text The initial content of the field.
 * @extends {eYo.Field}
 * @constructor
 */
eYo.Field.Dflt.makeSubclass('Label', {
  init (bsi, name, text) {
    this.isLabel = true
  },
})

/**
 * Class for an editable code field.
 * @param {eYo.Brick|eYo.Slot} bsi The owner of the field.
 * @param {string=} name
 * @param {string} text The initial content of the field.
 * @extends {eYo.Field}
 * @constructor
 */
eYo.Field.Dflt.makeSubclass('Input', {
  init (bsi, name, text) {
    eYo.assert(name, 'missing name for an editable field')
    this.editable = true
  },
  valued: {
    /**
     * css class for both the text element and html input.
     */
    css_class: 'eyo-code',
    placeholderText: '',
  },
  computed: {
    /**
     * Get the text from this field as displayed on screen.
     * @return {string} Currently displayed text.
     * @private
     * @suppress{accessControls}
     */
    displayText () {
      if (!this.isEditing && !this.text_.length &&(this.isPlaceholder || (this.data && (this.data.placeholder || this.data.model.placeholder)))) {
        return this.getPlaceholderText()
      }
      return this.text 
    },
    /**
     * Whether the field text corresponds to a placeholder.
     */
    isPlaceholder () {
      return !!this.model.placeholder
    },
  },
})

/**
 * The placeholder text.
 * Get the model driven value if any.
 * @param {boolean} clear
 * @return {string} Currently displayed text.
 * @private
 */
eYo.Field.Input_p.getPlaceholderText = function (clear) {
  if (clear) {
    this.placeholderText_ = eYo.NA
  } else if (this.placeholderText_) {
    return this.placeholderText_
  }
  if (this.brick) {
    var ph = model => {
      var placeholder = model && model.placeholder
      if (goog.isNumber(placeholder)) {
        return placeholder.toString()
      }
      placeholder = eYo.Do.valueOf(placeholder, this)
      if (placeholder) {
        placeholder = placeholder.toString()
        if (placeholder.length > 1) {
          placeholder = placeholder.trim() // one space alone is allowed
        }
      }
      return placeholder
    }
    var data = this.data
    return (this.placeholderText_ = ph(data && data.model) || ph(this.model) || eYo.Msg.Placeholder.CODE)
  }
}