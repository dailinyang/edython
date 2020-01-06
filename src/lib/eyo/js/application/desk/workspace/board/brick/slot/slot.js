/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Input extension for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.Provide('Slot')

eYo.require('Do')
eYo.require('C9r.BSMOwned')
eYo.require('Decorate')

eYo.forwardDeclare('Where')
eYo.forwardDeclare('Field')
eYo.forwardDeclare('Magnet')

eYo.forwardDeclare('Xml')
eYo.forwardDeclare('Key')
eYo.forwardDeclare('Expr.List')

goog.forwardDeclare('goog.dom');

eYo.Slot.makeDlgt()

/**
 * Initialize the instance.
 * Calls the inherited method, then adds methods defined by the model.
 * The methods are managed by the |dataHandler| method of the |eYo.C9r.Model|.
 * @param {Object} object - The object to initialize.
 */
eYo.Slot.Dlgt_p.initInstance = function (object) {
  eYo.Slot.Dlgt_s.initInstance(object)
  object.model['.methods'].forEach(f => {
    f(object)
  })
}

/**
 * The model is one of the entries of the `slots` section
 * of the object used to create a delegate's subclass.
 * Here are some specifications for that model part.
 *
 * Any slot is constructed the same way
 * 1) operator field
 * 2) label field
 * 3) start field
 * 4) either editable field, value input of wrapped brick.
 * 5) end field
 *
 * If the given model contains a `wrap` key, then a wrapped
 * brick is created.
 *
  // we assume that one input model only contains at most one of
  // - editable field
  // - value input, check: key
  // - wrap input
  // - insert input
  // It may contain label fields
 * @param {eYo.Brick.Dflt} brick  The owner is a brick.
 * @param {string} key  One of the keys in `slots` section of the brick model.
 * @param {Object} model  the model for the given key in the above mention section.
 * @constructor
 */
eYo.C9r.BSMOwned.makeSubclass(eYo.Slot, 'Dflt', {
  init (brick, key, model) {
    eYo.assert(brick, 'Missing slot owner brick')
    eYo.assert(key, 'Missing slot key')
    eYo.assert(model, 'Missing slot model')
    eYo.assert(!eYo.isNA(model.order), 'Missing slot model order')
    
    this.reentrant_ = {}
    this.key_ = key
    this.model_ = model
    var setupModel = model => {
      model.setup_ = true
      if (model.validateIncog && !goog.isFunction(model.validateIncog)) {
        delete model.validateIncog
      }
    }
    model.setup_ || setupModel(model)
    if (!eYo.isNA(model.check)) {
      this.magnet_ = new eYo.Magnet.Dflt(this, eYo.Magnet.IN, model)
      if (model.wrap) {
        this.magnet_.wrapped = model.wrap   
      } else if (model.promise) {
        this.magnet_.promised = model.promise
        this.incog = true
      }
    }
    eYo.Field.makeFields(this, model.fields)
    if (key === 'comment') {
      this.bind_f && (this.bind_f.isComment = true)
    }
  },
  owned: {
    magnet: eYo.NA
  },
  valued: {
    /**
     * @property {eYo.Data.Dflt} data  Bound data.
     */
    data: eYo.NA,
    visible: true,
    incog: {
      init () {
        return true
      },
      validate (after) {
        if (this.data) {
          after = this.data.incog
        } else if (!eYo.isNA(after)) {
          after = !this.required
        } else {
          after = !!after
        }
        var validator = this.slots && this.model.validateIncog
        if (validator) { // if !this.slots, the receiver is not yet ready
          after = validator.call(this, after)
        }
        return after
      },
      set_ (after) {
        this.brick_.change.wrap(() => {
          this.incog_ = after
          // forward to the connection
          var m4t = this.magnet
          if (m4t) {
            m4t.incog = after
          }
        })
      },
    },
    key: {},
    model: {},
    /**
     * Get the concrete required status.
     * For edython.
     * @param {boolean} after
     */
    requiredFromModel: {}
  },
  computed: {
    /**
     * @readonly
     * @property {eYo.Brick.Dflt} brick  the immediate brick in which this is contained
     */
    brick () {
      return this.owner_
    },
    /**
     * @readonly
     * @property {eYo.Brick.Dflt} brick  the immediate brick in which this is contained
     */
    targetBrick () {
      var m4t = this.magnet
      return m4t && m4t.targetBrick
    },
    whereInBoard () {
      return this.where.forward(this.brick.ui.whereInBoard)
    },
    whereInBrick: {
      get () {
        return this.where
      },
      set (after) {
        this.where_.set(after)
      }
    },
    recover () {
      return this.brick_.recover
    },
    xmlKey () {
      return (this.model.xml && this.model.xml.key) || this.key
    },
    ui () {
      return this.brick.ui
    },
    unwrappedTarget () {
      var m4t = this.magnet
      return m4t && m4t.unwrappedTarget
    },
    requiredIncog: {
      get () {
        return this.incog
      },
      set (after) {
        this.incog = !(this.required = !!after)
      }
    },
    /**
     * @property {boolean} isRequiredToModel  Get the required status.
     */
    isRequiredToModel () {
      if (this.incog) {
        return false
      }
      if (!this.magnet) {
        return false
      }
      if (!this.magnet.wrapped_ && this.targetBrick) {
        return true
      }
      if (this.required) {
        return true
      }
      if (this.data && this.data.required) {
        return false
      }
      if (this.model.xml && this.model.xml.required) {
        return true
      }
      return false
    },
    /**
     * Get the concrete required status.
     * For edython.
     * @param {boolean} after
     */
    requiredFromSaved () {
      var t9k = this.targetBrick
      if (t9k) {
        if (t9k.wrapped_) {
          // return true if one of the inputs is connected
          return t9k.slotSome(slot => !!slot.target)
        }
        return true
      }
      return this.requiredFromModel
    },
  },
  cloned: {
    where () {
      return new eYo.Where()
    }
  },
  /**
   * Dispose of all attributes.
   * Asks the owner's renderer to do the same.
   * @param {Boolean} [onlyThis]  Dispose of the inferior target iff healStack is a falsy value
   */
  dispose (onlyThis) {
    eYo.Field.disposeFields(this)
    this.magnet_ && this.magnet_.dispose(onlyThis)
    this.magnet_ = eYo.NA
    this.key_ = eYo.NA
    eYo.Property.dispose(this, 'where')
  },
  ui: {
    /**
     * UI management.
     * Install this slot and its associate fields on their brick.
     * No data change.
     */
    init () {
      this.fieldForEach(f => f.initUI())
    },
    /**
     * UI management.
     * Install this slot and its associate fields on their brick.
     * No data change.
     */
    dispose () {
      this.fieldForEach(f => f.disposeUI())
    },
  },
})

/**
 * Clean the required status, changing the value if necessary.
 * For edython.
 * @param {boolean} after
 */
eYo.Slot.Dflt_p.whenRequiredFromModel = function (helper) {
  if (this.isRequiredFromModel) {
    this.isRequiredFromModel = false
    if (goog.isFunction(helper)) {
      helper.call(this)
    }
    return true
  }
}

/**
 * Consolidate the state.
 * Forwards to the connection delegate.
 * For edython.
 * @param {Boolean} deep whether to consolidate connected bricks.
 * @param {Boolean} force whether to force synchronization.
 */
eYo.Slot.Dflt_p.consolidate = function (deep, force) {
  var m4t = this.magnet
  if (m4t) {
    m4t.incog = this.incog
    m4t.wrapped_ && (m4t.hidden = true) // Don't ever connect any brick to this
    var v
    if ((v = this.model.check)) {
      m4t.check = v.call(m4t, m4t.brick.type, m4t.brick.variant_p)
    }
  }
}

/**
 * Set the UI state.
 * Called only by `synchronizeSlots`.
 * For edython.
 */
eYo.Slot.Dflt_p.synchronize = function () {
  var d = this.ui_driver
  if (!d) {
    return
  }
  var after = this.incog
  this.visible = !after
  if (this.visible) {
    this.fieldForEach(field => field.text.length > 0 && (field.visible = true))
  }
  d.displayedUpdate(this)
}

/**
 * Convert the slot's connected target into the given xml element.
 * List all the available data and converts them to xml.
 * For edython.
 * @param {Element} element the persistent element.
 * @param {Object} [opt]  See eponym parameter in `eYo.Xml.brickToDom`.
 * @return a dom element, void lists may return nothing
 * @this a brick
 */
eYo.Slot.Dflt_p.save = function (element, opt) {
  if (this.incog) {
    return
  }
  var xml = this.model.xml
  if (xml === false) {
    return
  }
  var out = (() => {
    var t9k = this.targetBrick
    if (t9k) { // otherwise, there is nothing to remember
      if (t9k.wrapped_) {
        // wrapped bricks are just a convenient computational model.
        // For lists only, we do create a further level
        // Actually, every wrapped brick is a list
        if (t9k instanceof eYo.Expr.List) {
          var child = eYo.Xml.brickToDom(t9k, opt)
          if (child.firstElementChild) {
            child.setAttribute(eYo.Xml.SLOT, this.xmlKey)
            goog.dom.appendChild(element, child)
            return child
          }
        } else {
          // let the target populate the given element
          return eYo.Xml.toDom(t9k, element, opt)
        }
      } else {
        child = eYo.Xml.brickToDom(t9k, opt)
        if (child.firstElementChild || child.hasAttributes()) {
          child.setAttribute(eYo.Xml.SLOT, this.xmlKey)
          goog.dom.appendChild(element, child)
          return child
        }
      }
    }
  })()
  if (!out && this.isRequiredToModel) {
    this.saveRequired(element, opt)
  }
}

/**
 * Save a placeholder.
 * For edython.
 * @param {Element} element a dom element in which to save the receiver
 * @param {Object} opt
 */
eYo.Slot.Dflt_p.saveRequired = function (element) {
  var child = goog.dom.createDom(eYo.Xml.EXPR)
  child.setAttribute(eYo.Key.EYO, eYo.Key.PLACEHOLDER)
  child.setAttribute(eYo.Xml.SLOT, this.xmlKey)
  goog.dom.appendChild(element, child)
}

/**
 * Initialize the receiver from a dom element.
 * Given an element, initialize the slot target
 * brick with data from the given element.
 * The given element was created by the input's source brick
 * in a brickToDom method. If it contains a child element
 * which input attribute is exactly the input's name,
 * then we ask the input target brick to fromDom.
 * Target bricks are managed here too.
 * No consistency test is made however.
 * For edython.
 * @param {Element} element a dom element in which to save the input
 * @return true if this is loaded
 */
eYo.Slot.Dflt_p.load = function (element) {
  this.loaded_ = false
  var xml = this.model.xml
  if (xml === false) {
    return
  }
  this.requiredFromModel = false
  var out
  var t9k = this.targetBrick
  if (t9k && t9k.wrapped_ && !(t9k instanceof eYo.Expr.List)) {
    this.requiredFromModel = true // this is not sure, it depends on how the target read the dom
    out = eYo.Xml.fromDom(t9k, element)
    this.recover.dontResit(element)
  } else {
  // find the xml child with the proper slot attribute
    eYo.Do.someElementChild(element, child => {
      var attribute = child.getAttribute(eYo.Xml.SLOT)
      if (attribute && (attribute === this.xmlKey || attribute === this.key || (this.model.xml && goog.isFunction(this.model.xml.accept) && this.model.xml.accept.call(this, attribute)))) {
        this.recover.dontResit(child)
        if (child.getAttribute(eYo.Key.EYO) === eYo.Key.PLACEHOLDER) {
          this.requiredFromModel = true
          out = true
        } else {
          if (!t9k && this.model.promise) {
            this.completePromise()
            t9k = this.targetBrick
          }
          if (t9k) {
            if (t9k instanceof eYo.Expr.List) {
              // var grandChildren = Array.prototype.slice.call(child.childNodes)
              eYo.Do.forEachElementChild(child, grandChild => {
                var name = grandChild.getAttribute(eYo.Xml.SLOT)
                var slot = t9k.getSlot(name)
                if (slot) {
                  if (slot.magnet) {
                    var grand_t_brick = slot.target
                    if ((grand_t_brick)) {
                      eYo.Xml.fromDom(grand_t_brick, grandChild)
                      this.recover.dontResit(grandChild)
                    } else if ((grand_t_brick = eYo.Xml.domToBrick(grandChild, this.brick_))) {
                      var t_m4t = grand_t_brick.out_m
                      if (t_m4t && t_m4t.checkType_(slot.magnet, true)) {
                        t_m4t.connect(slot.magnet)
                        this.requiredFromModel = true
                      }
                      this.recover.dontResit(grandChild)
                    }
                  } else {
                    console.error('Missing connection')
                  }
                }
              })
              out = true
            } else {
              out = eYo.Xml.fromDom(t9k, child)
            }
            this.recover.dontResit(child)
          } else if ((t9k = eYo.Xml.domToBrick(child, this.brick_))) {
            var m5s = t9k.magnets
            // we could create a brick from that child element
            // then connect it
            this.recover.dontResit(child)
            var m4t = this.magnet
            if (m4t && m5s.out && m4t.checkType_(m5s.out, true)) {
              m4t.connect(m5s.out)
              this.requiredFromModel = true
            } else if (m5s.head && m4t.checkType_(m5s.head, true)) {
              m4t.connect(m5s.head)
            }
            out = t9k
          }
        }
        return true // the element was found
      }
    })
  }
  return this.loaded_ = out
}

/**
 * When all the slots and data have been loaded.
 * For edython.
 */
eYo.Slot.Dflt_p.willLoad = eYo.Decorate.reentrant_method('willLoad', function () {
  let f = this.model.willLoad
  if (f) {
    f.apply(this, arguments)
  }
})

/**
 * When all the slots and data have been loaded.
 * This is sent once at creation time (when default data has been loaded)
 * and possibly once when the saved representation has been loaded.
 * For edython.
 */
eYo.Slot.Dflt_p.didLoad = eYo.Decorate.reentrant_method('didLoad', function () {
  let f = this.model.didLoad
  if (f) {
    f.apply(this, arguments)
  }
})

/**
 * execute the given function for the receiver and its next siblings.
 * For edython.
 * @param {function} helper
 * @return {boolean} whether there was an slot to act upon or no helper given
 */
eYo.Slot.Dflt_p.forEach = function (helper) {
  var slot = this
  if (eYo.isF(helper)) {
    do {
      helper(slot)
    } while ((slot = slot.next))
  }
}

/**
 * execute the given function for the receiver and its previous siblings.
 * For edython.
 * @param {function} helper
 * @return {boolean} whether there was an slot to act upon or no helper given
 */
eYo.Slot.Dflt_p.forEachPrevious = function (helper) {
  var slot = this
  if (goog.isFunction(helper)) {
    do {
      helper(slot)
    } while ((slot = slot.previous))
  }
}

/**
 * execute the given function for the receiver and its next siblings.
 * If the return value of the given function is true,
 * then it was the last iteration and the loop breaks.
 * For edython.
 * @param {function} helper
 * @return {?Object} The slot that returned true, eventually.
 */
eYo.Slot.Dflt_p.some = function (helper) {
  var slot = this
  if (goog.isFunction(helper)) {
    do {
      if (helper(slot)) {
        return slot
      }
    } while ((slot = slot.next))
  }
}

/**
 * execute the given function for the fields.
 * For edython.
 * @param {function} helper
 */
eYo.Slot.Dflt_p.fieldForEach = function (helper) {
  this.fields && (Object.values(this.fields).forEach(f => helper(f)))
}

/**
 * Connect the brick or magnet. When not given a magnet, the output magnet is used. It is natural for slots.
 * The slot corresponds to a wrapped list block.
 * @param {eYo.Brick | eYo.Magnet.Dflt} bm  either a brick or a magnet.
 * @param {String} [key] an input key. When not given the last free input is used.
 * @return {?eYo.Magnet.Dflt} the eventual magnet target that was connected.
 */
eYo.Slot.Dflt_p.listConnect = function (bm, key) {
  var t9k = this.targetBrick
  if (!t9k) {
    this.completePromise()
    if (!(t9k = this.targetBrick)) {
      return false
    }
  }
  if (!key) {
    return t9k.connectLast(bm)
  }
  var slot = t9k.getSlot(key)
  if (slot) {
    var m4t = slot.magnet
    if (m4t) {
      var other = (bm.magnets && bm.out_m) || bm
      return m4t.connect(other)
    }
  }
}

/**
 * Connect to the target.
 * For edython.
 * @param {eYo.Brick | eYo.Magnet.Dflt} bm  The target is either a brick or another magnet.
 * @return {?eYo.Magnet.Dflt} the eventual target magnet
 */
eYo.Slot.Dflt_p.connect = function (bm) {
  var m4t = this.magnet
  if(m4t && bm) {
    var other = (bm.magnets && bm.out_m) || bm
    if (m4t.checkType_(other)) {
      return m4t.connect(other)
    }
  }
}

/**
 * Complete with a promised brick.
 * Forwards to the receiver's magnet.
 * One shot in case of success.
 * @return {Boolean} whether the complete was successfull
 */
eYo.Slot.Dflt_p.completePromise = function () {
  var m4t = this.magnet
  if (m4t && m4t.completePromise()) {
    this.completePromise = eYo.Do.nothing
    return true
  }
}
