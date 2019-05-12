/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview Input extension for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Input')

goog.require('eYo.Magnet')
goog.forwardDeclare('eYo.Slot')

/**
 * Class for an input with an optional field.
 * @param {number} type The type of the input.
 * @param {string} name Language-neutral identifier which may used to find this
 *     input again.
 * @param {!eYo.Brick|eYo.Slot} owner The owner of this input.
 * @param {?eYo.Magnet} magnet Optional magnet for this input.
 * @constructor
 */
eYo.Input = function(owner, name, model) {
  this.owner = owner
  this.name_ = name
  this.magnet_ = new eYo.Magnet(owner, eYo.Magnet.INPUT, model)
  this.fieldRow_ = []
}

// private properties
Object.defineProperties(eYo.Input.prototype, {
  owner_: { value: undefined },
  brick_: { value: undefined },
  visible_: { value: undefined },
})

// computed properties
Object.defineProperties(eYo.Input.prototype, {
  /**
   * @readonly
   * @type {!eYo.Brick|eYo.Slot}
   */
  owner: {
    get () {
      return this.owner_
    },
    set (newValue) {
      if (newValue instanceof eYo.Slot) {
        this.owner_ = this.slot_ = owner
        this.brick_ = owner.brick
      } else {
        this.slot_ = null
        this.owner_ = this.brick_ = owner
      }
    }
  },
  /**
   * @readonly
   * @type {!eYo.Brick}
   */
  brick: {
    get () {
      return this.brick_
    }
  },
  /** 
   * @readonly
   * @type {string}
   */
  name: {
    get () {
      return this.name_
    }
  },
  /**
   * @readonly
   * @type {!Array.<!Blockly.Field>}
   */
  fieldRow: {
    get () {
      return this.fieldRow_
    }
  },
  visible_: {
    writable: true
  },
  visible: {
    get () {
      return this.visible_
    },
    set (newValue) {
      if (this.visible_ === newValue) {
        return
      }
      this.visible_ = newValue
      this.fieldRow.forEach(f => f.setVisible(newValue))
      this.magnet && (this.magnet.visible = newValue)
    }
  },
  /**
   * @readonly
   * @property {eYo.Magnet}
   */
  magnet: {
    get () {
      return this.magnet_
    }
  },
  check: {
    set (newValue) {
      var m4t = this.magnet_
      if (m4t) {
        m4t.check = newValue
      } else {
        console.error("NO CHECKABLE MAGNET, BREAK HERE")
      }
    }
  },
  t_eyo: {
    get () {
      var m4t = this.magnet
      return m4t && m4t.t_eyo
    }
  },
  slot: {
    get () {
      return this.slot_
    }
  },
  bindField: {
    get () {
      var b_eyo = this.brick
      if (b_eyo.wrapped_) {
        return b_eyo.magnets.output.t_eyo.bindField
      }
      var s = this.slot
      return s && s.bindField
    }
  },
})

// Obsolete/forbidden properties
Object.defineProperties(eYo.Input.prototype, {
  eyo: {
    get () {
      throw "BAD DESIGN, BREAK HERE"
    }
  },
  target: {
    get () {
      throw "BAD DESIGN, BREAK HERE"
    }
  },
  sourceBlock_: {
    get () {
      throw "BAD DESIGN, BREAK HERE"
    }
  },
  connection: {
    get () {
      throw "BAD DESIGN, BREAK HERE"
    }
  },
  /**
   * @readonly
   * @type {number}
   */
  type: {
    get () {
      throw "NO WAY, BREAK HERE"
    }
  },
})

/**
 * Sever all links to this input.
 * The wrapped_ blocks may not yet be disposed.
 */
eYo.Input.prototype.dispose = function() {
  this.fieldRow.forEach(f => f.dispose())
  this.fieldRow = undefined
  var m4t = this.magnet
  if (m4t) {
    m4t.wrapped_ = null
    var t_eyo = m4t.t_eyo
    t_eyo && t_eyo.block_.dispose()
    m4t.dispose()
    this.magnet = undefined
  }
  this.owner = null
}

/**
 * be ready the delegate.
 */
eYo.Input.prototype.beReady = function () {
  this.beReady = eYo.Do.nothing // one shot function
  this.fieldRow.forEach(f => field.init())
  var m4t = this.magnet
  m4t && m4t.beReady()
}

/**
 * consolidate the delegate.
 */
eYo.Input.prototype.consolidate = function () {
  var m4t = this.magnet
  m4t && m4t.consolidate.apply(m4t, arguments)
}

/**
 * Connect the owner to something.
 * @param{!eYo.Brick | eYo.Magnet} dm  dm is either a delegate or a magnet.
 */
eYo.Input.prototype.connect = function (dm) {
  var m4t = this.magnet
  if(m4t && dm) {
    var other = (dm.magnets && dm.magnets.output) || dm
    if (m4t.checkType_(other)) {
      return m4t.connect(other)
    }
  }
}
