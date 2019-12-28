/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Magnets manager.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('C9r.BSMOwned')
eYo.require('Protocol')

eYo.provide('Magnet')

eYo.forwardDeclare('Do')
eYo.forwardDeclare('Where')

// Magnet types
Object.defineProperties(eYo.Magnet._p, {
  IN: { value: 1 },
  OUT: { value: 6 },
  HEAD: { value: 2 },
  FOOT: { value: 5 },
  LEFT: { value: 3 },
  RIGHT: { value: 4 },
  OPPOSITE_TYPE: {
    [eYo.Magnet.IN]: eYo.Magnet.OUT,
    [eYo.Magnet.OUT]: eYo.Magnet.IN,
    [eYo.Magnet.FOOT]: eYo.Magnet.HEAD,
    [eYo.Magnet.HEAD]: eYo.Magnet.FOOT,
    [eYo.Magnet.RIGHT]: eYo.Magnet.LEFT,
    [eYo.Magnet.LEFT]: eYo.Magnet.RIGHT,
  },
  /**
  * Constants for checking whether two connections are compatible.
  */
  CAN_CONNECT: { value: 0},
  REASON_SELF_CONNECTION: { value: 1},
  REASON_WRONG_TYPE: { value: 2},
  REASON_TARGET_NULL: { value: 3},
  REASON_CHECKS_FAILED: { value: 4},
  REASON_DIFFERENT_WORKSPACES: { value: 5},
})


// Database of magnets
{
  /**
   * Database of magnets.
   * Magnets are stored in order of their vertical component.  This way
   * connections in an area may be looked up quickly using a binary search.
   * @constructor
   */
  let DB = function () {}

  DB.prototype = new Array()
  /**
   * Don't inherit the constructor from Array.
   * @type {!Function}
   */
  DB.constructor = DB

  /**
   * Initialize a set of connection DBs for a specified board.
   * @param {eYo.Board} board The board this DB is for.
   */
  eYo.Magnet.initDB = (board) => {
    // Create four databases, one for each connection type.
    var dbList = []
    dbList[eYo.Magnet.IN] = new eYo.Magnet.DB()
    dbList[eYo.Magnet.OUT] = new eYo.Magnet.DB()
    dbList[eYo.Magnet.HEAD] = new eYo.Magnet.DB()
    dbList[eYo.Magnet.LEFT] = new eYo.Magnet.DB()
    dbList[eYo.Magnet.RIGHT] = new eYo.Magnet.DB()
    dbList[eYo.Magnet.FOOT] = new eYo.Magnet.DB()
    board.magnetDBList = dbList
  }

  /**
   * Finds a candidate position for inserting this magnet into the list.
   * This will be in the correct y order
   * but makes no guarantees about ordering in the x axis.
   * @param {float} y  The y coordinate of the magnet to add.
   * @return {number} The candidate index.
   * @private
   */
  DB.prototype.findIndex_ = function(y) {
    if (!this.length) {
      return 0;
    }
    var min = 0
    var max = this.length
    while (min < max) {
      var mid = Math.floor((min + max) / 2)
      if (this[mid].y < y) {
        min = mid + 1
      } else if (this[mid].y > y) {
        max = mid
      } else {
        min = mid
        break
      }
    }
    return min
  }

  /**
   * Add a magnet to the database. Do not look for duplicates.
   * @param {eYo.Magnet.Dflt} magnet The magnet to be added.
   */
  DB.prototype.addMagnet_ = function(magnet) {
    var magnetIndex = this.findIndex_(magnet.y)
    this.splice(magnetIndex, 0, magnet)
  }

  /*
  * Find the given connection.
  * Starts by doing a binary search to find the approximate location, then
  *     linearly searches nearby for the exact connection.
  * @param {eYo.Connection} conn The connection to find.
  * @return {number} The index of the connection, or -1 if the connection was
  *     not found.
  */
  var findMagnet = (db, magnet) => {
    if (!db.length) {
      return -1
    }
    var bestGuess = db.findIndex_(magnet.y)
    if (bestGuess >= db.length) {
      // Not in list
      return -1
    }
    var y = magnet.y
    // Walk forward and back on the y axis looking for the magnet.
    var min = bestGuess
    while (min >= 0 && db[min].y === y) {
      if (db[min] === magnet) {
        return min
      }
      min--
    }
    var max = bestGuess
    while (max < db.length && db[max].y === y) {
      if (db[max] === magnet) {
        return max
      }
      max++
    }
    return -1
  }
  /**
   * Remove a magnet from the database. Do not look for duplicates.
   * @param {eYo.Magnet.Dflt} magnet The magnet to be remove.
   */
  DB.prototype.removeMagnet_ = function(magnet) {
    var magnetIndex = findMagnet(this, magnet)
    magnetIndex >= 0 && (this.splice(magnetIndex, 1))
  }
}

/**
 * Initialize a set of connection DBs for a specified board.
 * @param {eYo.Board} board The board containing the DB to disose of.
 */
eYo.Magnet.disposeDB = (board) => {
  board.magnetDBList = null
}

/**
 * @name{eYo.Magnet.S}
 * @param {eYo.Brick.Dflt} brick  brick is the owner
 */
eYo.Magnet.makeClass('S', {
  init (brick) {
    // configure the connections
    var model = brick.model
    var D
    if ((D = model.out) && Object.keys(D).length) {
      this.out_ = new eYo.Magnet.Dflt(brick, eYo.Magnet.OUT, D)
    } else if ((D = model.statement) && Object.keys(D).length) {
      if (D.head && goog.isDefAndNotNull(D.head.check)) {
        this.high_ = new eYo.Magnet.Dflt(brick, eYo.Magnet.HEAD, D.head)
      }
      if (D.foot && goog.isDefAndNotNull(D.foot.check)) {
        this.foot_ = new eYo.Magnet.Dflt(brick, eYo.Magnet.FOOT, D.foot)
      }
      if (D.suite && goog.isDefAndNotNull(D.suite.check)) {
        this.suite_ = new eYo.Magnet.Dflt(brick, eYo.Magnet.FOOT, D.suite)
      }
      if (D.left && goog.isDefAndNotNull(D.left.check)) {
        this.left_ = new eYo.Magnet.Dflt(brick, eYo.Magnet.LEFT, D.left)
      }
      if (D.right && goog.isDefAndNotNull(D.right.check)) {
        this.right_ = new eYo.Magnet.Dflt(brick, eYo.Magnet.RIGHT, D.right)
      }
    }
  },
  owned: ['out', 'head', 'left', 'right', 'suite', 'foot'],
  valued: {
    inDB: {
      validate (after) {
        return !!after
      },
      didChange (before, after) {
        var db = this.db_
        if (db) {
          after
          ? db.addMagnet_(this)
          : db.removeMagnet_(this)
        }
      }
    },
    db: {},
    dbOpposite: {},
  },
})

/**
 * Class for a magnet.
 * 
 * @param {eYo.Brick|eYo.Slot} owner  the immediate owner of this magnet. When not a brick, it is directly owned by a brick.
 * @param {String} type  the type of this magnet
 * @param {Object} model  the model of this magnet
 * @readonly
 * @property {*} node  the node if any
 * @property {boolean} startOfLine  whether the connection is a slot connection starting a line.
 * @property {boolean} startOfStatement  whether the connection is a slot connection starting a brick.
 * @readonly
 * @property {string} type  the type of the connection
 * @readonly
 * @property {boolean} targetIsMissing  whether a target is missing
 * @readonly
 * @property {boolean} isSuperior  whether the connection is superior, true if connection faces down or right, false otherwise.
 * @constructor
 */
eYo.Magnet.makeClass('Dflt', eYo.C9r.BSMOwned, {
  init (bs, type, model) {
    if (this.slot) {
      this.name_ = this.slot.key
    }
    this.type_ = type
    this.model_ = model
    this.optional_ = this.model_.optional
    this.incog_ = this.hidden_ = model.hidden
    eYo.Field.makeFields(this, model.fields)
    this.reentrant_ = {}
    this.targetIsMissing = false
    if (!this.brick.isInFlyout) {
      var DB = this.magnetDB_
      if (DB) {
        this.db_ = DB[this.type]
        this.dbOpposite_ = DB[this.opposite_type]
        this.hidden = false
      }
    }
  },
  /**
   * Dispose of the ressources.
   * @param {Boolean} [healStack]  Dispose of the inferior target iff healStack is a falsy value
   */
  dispose: function (healStack) {
    var t9k = this.targetBrick
    if (t9k) {
      if (this.isSuperior && (this.wrapped_ || !healStack)) {
        t9k.dispose()
      }
      this.disconnect()
    }
    if (this.wrapped_) {
      this.brick.removeWrapperMagnet(this)
      this.wrapped_ = eYo.NA
    }
    eYo.Field.disposeFields(this)
  },
  valued: {
    optional: {value: false},
    model: { value: eYo.NA},
    type: { value: eYo.NA},
    opposite_type: { value: eYo.NA},
    hidden: { value: eYo.NA},
    check: {value: eYo.NA},
    name: { value: eYo.NA},
    visible: {
      didChange (before, after) {
        after ? this.unhideAll() : this.hideAll()
        var t9k = this.targetBrick
        t9k && (t9k.ui.visible = after)
      }
    },
    wrapped: {
      validate (after) {
        if (this.target) {
          throw "ALREADY A WRAPPED BLOCK"
        }
        return after
      },
      didChange (before, after) {
        this.promised_ = eYo.NA
        after && (this.brick.addWrapperMagnet(this))
        this.hidden = true
      }
    },
    promised: {
      validate (after) {
        if (this.target) {
          throw "ALREADY A WRAPPED BLOCK"
        }
        return after
      },
      didChange (before, after) {
        this.wrapped_ && (this.brick.removeWrapperMagnet(this))
        this.wrapped_ = eYo.NA
        this.hidden = true
      }
    },
    hidden: {
      validate (after) {
        // Incog magnets must stay hidden
        return !after && this.incog_ ? eYo.INVALID : after
      },
      didChange(before, after) {
        this.inDB_ = !after
      }
    },
  },
  cloned: {
    where () {
      new eYo.Where()
    }
  },
  computed: {
    /**
     * The right magnet is just at the right... Not used.
     * @private
     */
    right: {
      get () {
        var slot = this.slot
        if (slot) {
          if ((slot = slot.next) && (slot = slot.some(slot => !slot.incog && slot.magnet && !slot.magnet.hidden))) {
            return slot.magnet
          }
        }
        if ((m4t = this.brick.out_m) && (m4t = m4t.target)) {
          return m4t.right
        }
      }
    },
    magnetDB () {
      return this.board.magnetDBList
    },
    typeName () {
      return {
        [eYo.Magnet.IN]: 'in',
        [eYo.Magnet.OUT]: 'out',
        [eYo.Magnet.HEAD]: 'head',
        [eYo.Magnet.FOOT]: 'foot',
        [eYo.Magnet.LEFT]: 'left',
        [eYo.Magnet.RIGHT]: 'right'
      } [this.type]
    },
    isSuperior () { // the source 'owns' the target
      return this.isSlot || this.isFoot || this.isRight
    },
  },
})

// computed public properties
Object.defineProperties(eYo.Magnet.Dflt_p, {
  c: { // in text units
    get () {
      return this.slot
      ? this.where.c + this.slot.where.c
      : this.where.c
    }
  },
  l: { // in text units
    get () {
      return this.slot
      ? this.where.l + this.slot.where.l
      : this.where.l
    }
  },
  /**
   * Position in the brick.
   * @return {eYo.Where}
   * @readonly
   */
  whereInBrick: {
    get () {
      return this.slot
      ? this.slot.whereInBrick.forward(this.where)
      : new eYo.Where(this.where)
    },
    set (newValue) {
      this.where_.set(this.slot
        ? newValue.backward(this.slot.whereInBrick)
        : newValue
      )
    }
  },
  /**
   * Position in the board.
   * @return {eYo.Where}
   * @readonly
   */
  whereInBoard: {
    get () {
      return this.whereInBrick.forward(this.brick.ui.whereInBoard)
    },
    set (newValue) {
      this.whereInBrick = new eYo.Where(newValue).backward(this.brick.ui.whereInBoard)
    }
  },
  x: { // in board coordinates
    get () {
      return this.slot ? this.where.x + this.slot.where.x : this.where.x
    }
  },
  y: { // in board coordinates
    get () {
      return this.slot ? this.where.y + this.slot.where.y : this.where.y
    }
  },
  w: {
    get () {
      return this.bindField
        ? this.bindField.size.w + 1
        : this.optional_ || this.s7r_
          ? 1
          : 3
    }
  },
  width: {
    get () {
      return this.w * eYo.Unit.x
    }
  },
  target: {
    get () {
      return this.target_
    },
    /**
     * Connect the receiver to the newValue, if any, otherwise disconnects the receiver.
     * @param {eYo.Brick.Dflt} [newValue] 
     */
    set (newValue) {
      if (newValue) {
        this.target_ && (this.disconnect())
        this.connect(newValue)
      } else {
        this.disconnect()
      }
    }
  },
  targetBrick: { // === this.target.brick
    get () {
      var t = this.target
      return t && t.brick
    },
    set (newValue) {
      if (newValue !== this.targetBrick && newValue !== this.brick) {
        this.disconnect()
      }
      if (newValue) {
        this.connectSmart(newValue)
      }
    }
  },
  unwrappedMagnet: {
    get () {
      // scheme:
      // this = output <- input <- wrapped source brick <- output <- input
      var ans = this
      var t9k, m4t
      while ((t9k = ans.targetBrick) && t9k.wrapped_ && (m4t = t9k.out_m)) {
        ans = m4t
      }
      return ans
    }
  },
  parent: {
    get () {
      throw "FORBIDDEN"
    }
  },
  bindField: {
    get () {
      if (this.slot) {
        return this.slot.bindField
      }
      // in a void wrapped list
      var brick = this.brick
      var slot = brick.slotAtHead
      if (slot && (slot.magnet === this)) {
        var m4t = brick.out_m
        if (m4t && (m4t = m4t.target)) {
          return m4t.bindField
        }
      }
    },
  },
  check: {
    get () {
      return this.check_
    },
    set (check) {
      if (check) {
        // Ensure that check is in an array.
        if (!goog.isArray(check)) {
          check = [check];
        }
        this.check_ = check;
      } else {
        this.check_ = null;
      }
      var brick = this.brick
      var t9k = this.targetBrick
      if (t9k && !this.checkType_(this.target)) {
        ;(this.isSuperior ? t9k : brick).unplug()
        // Bump away.
        brick.ui.bumpNeighbours_()
      }
      brick.changeDone()
      t9k && (t9k.changeDone()) // there was once a `consolidate(false, true)` here.
    }
  },
  /**
   * Is it an output magnet.
   * @return {boolean} True if the magnet is the brick's output one.
   */
  isOutput: {
    get () {
      return this.type === eYo.Magnet.OUT
    }
  },
  /**
   * Is it a slot magnet.
   * @return {boolean} True if the magnet is one of the brick's slot magnet.
   */
  isSlot: {
    get () {
      return this.type === eYo.Magnet.IN
    }
  },
  /**
   * Is it a top magnet.
   * @return {boolean} True if the magnet is the brick's head one.
   */
  isHead: {
    get () {
      return this.type === eYo.Magnet.HEAD
    }
  },
  /**
   * Is it a foot magnet.
   * @return {boolean} True if the magnet is the brick's foot one.
   */
  isFoot: {
    get () {
      return this.type === eYo.Magnet.FOOT
    }
  },
  /**
   * Is it a suite magnet.
   * @return {boolean} True if the magnet is the brick's suite one.
   */
  isSuite: {
    get () {
      return this === this.brick.suite_m
    }
  },
  /**
   * Is it a left magnet.
   * @return {boolean} True if the magnet is the brick's left one.
   */
  isLeft: {
    get () {
      return this.type === eYo.Magnet.LEFT
    }
  },
  /**
   * Is it a right magnet.
   * @return {boolean} True if the magnet is the brick's right one.
   */
  isRight: {
    get () {
      return this.type === eYo.Magnet.RIGHT
    }
  },
  /**
   * Returns an unwrapped target brick
   */
  unwrappedTarget: {
    get () {
      var t = this.targetBrick
      var f = t => {
        return t && (!t.wrapped_ || t.someSlot(slot => {
          var m4t = slot.magnet
          return f(t = m4t && m4t.targetBrick)
        }))
      }
      return f(t) && t
    }
  },
  /**
   * Return the black target.
   * Traverses the white bricks
   * @return {?eYo.Magnet.Dflt}
   * @private
   */
  blackTarget: {
    get () {
      var t4t = this.target
      if (!t4t) {
        return eYo.NA
      }
      var brick = t4t.brick
      if (!brick.isWhite) {
        return t4t
      }
      if (t4t.isHead) {
        var F = x => x.foot_m
      } else if (t4t.isFoot) {
        F = x => x.head_m
      } else {
        return eYo.NA
      }
      do {
        if (!(t4t = F(brick)) || !(t4t = t4t.target) || !(brick = t4t.brick)) {
          return eYo.NA
        }
        if (!brick.isWhite) {
          return t4t
        }
      } while (true)
    }
  },
  /**
   * Return the black connection.
   * Traverses the white bricks.
   * If the source brick is black, returns the connection.
   * If the source brick is white, check for the target brick's other connection,
   * and so on.
   * If the connection is named, returns the connection, whatever its source brick
   * status may be.
   * @param F optional function defaults to !argument.isWhite
   * @return a connection, possibly eYo.NA
   */
  blackMagnet: {
    get () {
      var brick = this.brick
      if (!brick.isWhite) {
        return this
      }
      if (this.isHead) {
        var other = b => b.foot_m
      } else if (this.isFoot) {
        other = b => b.head_m
      } else {
        // this is a 'do' statement input connection
        // whether the surrounding brick is disabled or not has no importance
        return this
      }
      var magnet
      while ((magnet = other(brick)) && (magnet = magnet.target) && !magnet.name_ && (!(brick = magnet.brick) || brick.isWhite)) {}
      return magnet
    }
  }
})

/**
 * Whether the connection is a separator.
 * Used in lists.
 */
eYo.Magnet.Dflt_p.s7r_ = false

/**
 * execute the given function for the fields.
 * For edython.
 * @param {function} helper
 */
eYo.Magnet.Dflt_p.forEachField = function (helper) {
  this.fields && (Object.values(this.fields).forEach(f => helper(f)))
}

/**
 * `initUI` the target brick when superior and the fields.
 */
eYo.Magnet.Dflt_p.initUI = function () {
  this.initUI = eYo.Do.nothing // one shot function
  this.inDB_ = !this.hidden_
  if (this.isSuperior) {
    var t9k = this.targetBrick
    t9k && t9k.initUI()
  }
  this.forEachField(f => f.initUI())
}

/**
 * `consolidate` the target brick.
 */
eYo.Magnet.Dflt_p.consolidate = function (deep, force) {
  var t9k = this.targetBrick
  t9k && (t9k.consolidate(deep, force))
}

Object.defineProperty(eYo.Magnet.Dflt_p, 'incog', {
  /**
   * Get the incognito state.
   */
  get () {
    return this.incog_
  },
  /**
   * Set the incognito state.
   * Hide/show the connection from/to the database and disable/enable the target's connections.
   * @param {boolean} incog
   * @return {boolean} whether changes have been made
   */
  set (newValue) {
    if (this.incog_ && newValue) {
      // things were unlikely to change since
      // the last time the connections have been disabled
      return
    }
    newValue = !!newValue
    var change = this.incog_ !== newValue
    if (change) {
      this.brick.changeDone()
    }
    if (!newValue && this.promised_) {
      this.completePromise()
    }
    if (newValue || !this.wrapped_) {
      // We cannot disable wrapped connections
      this.incog_ = this.hidden = newValue
    }
    var t9k = this.targetBrick
    if (t9k) {
      t9k.incog = newValue
    }  
  }
})

/**
 * Complete with a wrapped brick.
 * Reentrant method.
 * @param {String} prototypeName
 * @return {Object} Object with an `ans` property.
 */
eYo.Magnet.Dflt_p.completeWrap = eYo.Decorate.reentrant_method(
  'completeWrap',
  function () {
    if (!this.wrapped_) {
      return
    }
    var t9k = this.targetBrick
    if (!t9k) {
      var ans
      eYo.Events.disableWrap(
        () => {
          var brick = this.brick
          t9k = eYo.Brick.newReady(brick, this.wrapped_, brick.id + '.wrapped:' + this.name_)
          eYo.assert(t9k, 'completeWrap failed: ' + this.wrapped_)
          eYo.assert(t9k.out_m, 'Did you declare an Expr brick typed ' + t9k.type)
          ans = this.connect(t9k.out_m)
        }
      )
      return ans // true when connected
    }
  }
)

/**
 * Complete with a promised brick.
 */
eYo.Magnet.Dflt_p.completePromise = function () {
  if (this.promised_) {
    // console.error('PROMISE CLOSED')
    this.wrapped_ = this.promised_
    var ans = this.completeWrap()
    return ans && ans.ans
  }
}

/**
 * Break the connection by unplugging a source brick. This is high because it calls unplug.
 */
eYo.Magnet.Dflt_p.break = function () {
  var brick = this.isSuperior ? this.targetBrick : this.brick
  brick && (brick.unplug())
}

/**
 * Will connect.
 * Forwards to the model.
 * @param {eYo.Magnet.Dflt} targetM4t
 */
eYo.Magnet.Dflt_p.willConnect = function (targetM4t) {
  var m = this.model
  var f = eYo.Decorate.reentrant_method.call(this, 'model_willConnect',m && m.willConnect)
  if (f) {
    f.apply(this, arguments)
    return
  }
}

/**
 * Did connect.
 * Increment the brick step.
 * @param {eYo.Magnet.Dflt} oldTargetM4t
 *     what was previously connected to the receiver
 * @param {eYo.Magnet.Dflt} targetOldM4t
 *     what was previously connected to the actual receiver's target
 */
eYo.Magnet.Dflt_p.didConnect = function (oldTargetM4t, targetOldM4t) {
  this.targetIsMissing = false
  // No need to increment step for the old magnets because
  // if any, they were already disconnected and
  // the step has already been incremented then.
  var m = this.model
  var f = eYo.Decorate.reentrant_method.call(this, 'model_didConnect',m && m.didConnect)
  if (f) {
    f.apply(this, arguments)
    return
  }
  if (this.isRight && this.label_f) {
    this.label_f.visible = this.brick.isGroup || !this.targetBrick.isComment
  }
}

/**
 * Will disconnect.
 * Default implementation forwards to the model.
 * The model should call back.
 * This can be overriden at brick creation time.
 */
eYo.Magnet.Dflt_p.willDisconnect = function () {
  var f = this.model.willDisconnect
  if (goog.isFunction(f)) {
    eYo.Decorate.reentrant_method('willDisconnect',f).apply(this, arguments)
    return
  }
  if (this.isRight) {
    this.label_f.visible = this.brick.isGroup
  }
}

/**
 * Did disconnect.
 * Increment the brick step.
 * @param {eYo.Magnet.Dflt} oldTargetM4t
 *     what was previously connected to the receiver
 * @param {eYo.Magnet.Dflt} targetOldM4t
 *     what was previously connected to the old receiver's target
 */
eYo.Magnet.Dflt_p.didDisconnect = function (oldTargetM4t, targetOldM4t) {
  // No need to increment step for the old connections because
  // if any, they were already disconnected and
  // the step has already been incremented then.
  if (!this.reentrant_.didDisconnect) {
    var f = this.model && this.model.didDisconnect
    if (goog.isFunction(f)) {
      this.reentrant_.didDisconnect = true
      f.call(this, oldTargetM4t, targetOldM4t)
      this.reentrant_.didDisconnect = false
      return
    }
  }
}

/**
 * Set the receiver's connection's check_ array according to the given type.
 * The defaults implements asks the model then sets the check_ property.
 * Called by `consolidateMagnets`.
 */
eYo.Magnet.Dflt_p.updateCheck = function () {
  var b = this.brick
  if(b.change.level > 1 || this.changeCount_ === b.change.count) {
    return
  }
  this.changeCount_ = b.change.count
  if (this.model.check) {
    this.check = this.model.check.call(this, b.type, b.subtype)
  }
}

/**
 * Get the magnet of the same kind on the brick above.
 * If the magnet is named (Why should it be?), returns the connection,
 * whatever its source brick status may be.
 * @return a connection, possibly eYo.NA
 */
eYo.Magnet.Dflt_p.getMagnetAbove = function () {
  var ans = this.brick.head
  if (ans) {
    var m5s = ans.magnets
    if (this.isFoot) {
      return m5s.foot
    } else if (this.isHead) {
      return m5s.head
    } else if (this.isRight) {
      return m5s.right
    } else if (this.isLeft) {
      return m5s.left
    }
  }
}

/**
 * Get the connection of the same kind on the brick below.
 * @return a magnet, possibly eYo.NA
 */
eYo.Magnet.Dflt_p.getMagnetBelow = function () {
  var ans = this.brick.foot
  if (ans) {
    var m5s = ans.magnets
    if (this.isFoot) {
      return m5s.foot
    } else if (this.isHead) {
      return m5s.head
    } else if (this.isRight) {
      return m5s.right
    } else if (this.isLeft) {
      return m5s.left
    }
  }
}

/**
 * Establish a connection with a brick.
 *
 * @param {eYo.Brick.Dflt} eyo
 */
eYo.Magnet.Dflt_p.connectSmart = (() => {

  /**
   * Establish a connection with a brick.
   * @param {eYo.Brick.Dflt} brick
   * @return {!eYo.Magnet.Dflt}
   */
  var connectToHead = function (brick) {
    this.connect(brick.head_m)
    return brick.footMost.foot_m
  }

  /**
   * Establish a connection with a brick.
   * @param {eYo.Brick.Dflt} brick
   * @return {!eYo.Magnet.Dflt}
   */
  var connectToLeft = function (brick) {
    this.connect(brick.left_m)
    return brick.rightMost.right_m
  }

  /**
   * Establish a connection with a brick.
   * @param {eYo.Brick.Dflt} brick
   * @return {!eYo.Magnet.Dflt}
   */
  var connectToRight = function (brick) {
    this.connect(brick.right_m)
    return brick.leftMost.left_m
  }

  /**
   * Establish a connection with a brick.
   * @param {eYo.Brick.Dflt} brick
   * @return {!eYo.Magnet.Dflt}
   */
  var connectToFoot = function (brick) {
    this.connect(brick.foot_m)
    return brick.headMost.head_m
  }

  /**
   * Establish a connection with a brick.
   * @param {eYo.Brick.Dflt} brick
   */
  var connectToOutput = function (brick) {
    this.connect(brick.out_m)
  }

  return function (b) {
    if (this.isFoot || this.isSuite) {
      this.connectSmart = connectToHead
      return this.connectSmart(b)
    }
    if (this.isHead) {
      this.connectSmart = connectToFoot
      return this.connectSmart(b)
    }
    if (this.isLeft) {
      this.connectSmart = connectToRight
      return this.connectSmart(b)
    }
    if (this.isRight) {
      this.connectSmart = connectToLeft
      return this.connectSmart(b)
    }
    if (this.isSlot) {
      this.connectSmart = connectToOutput
      return this.connectSmart(b)
    }
  }
}) ()

/**
 * Set the origin of the connection.
 * When the connection is in a slot, the origin is the top left point
 * of the slot otherwise it is `(0, 0)`.
 * @param {Number} c The column index.
 * @param {Number} l The line index.
 */
eYo.Magnet.Dflt_p.setOffset = function(c = 0, l = 0) {
  if (goog.isDef(c.c) && goog.isDef(c.l)) {
    l = c.l
    c = c.c
  }
  var w = this.where_
  w.c_ = c
  w.l_ = l
  if (isNaN(this.x)) {
    w.c_ = c
    w.l_ = l
    console.error(this.x)
  }
}

/**
 * The type checking mechanism is fine grained compared to blockly's.
 * The check_ is used more precisely.
 * For example, elif bricks cannot connect to the suite connection, only the next connection.
 * @param {eYo.Magnet.Dflt} other Magnet to compare against.
 * @param {Boolean} [force]  checks even if a connection is hidden or incog.
 * @return {boolean} True if the connections share a type.
 * @private
 * @suppress {accessControls}
 */
eYo.Magnet.Dflt_p.checkType_ = function (other, force) {
  if (!eYo.Events.recordingUndo) {
    // we are undoing or redoing
    // we will most certainly reach a state that was valid
    // some time ago
    return true
  }
  if (this.check_ && !this.check_.length) {
    return false
  }
  if (other.check_ && !other.check_.length) {
    return false
  }
  var m4tA = this.blackMagnet
  var m4tB = other.blackMagnet
  if (!m4tA || !m4tB) {
    return true
  }
  var dlgtA = m4tA.brick
  var dlgtB = m4tB.brick
  // short stop if one of the connection is hidden or disabled
  // except when we try to establish a connection with a wrapped brick.
  // in either case, returns true iff the connetion is aready established
  if (m4tA.wrapped_) {
    if (m4tA.target) {
      return m4tB === m4tA.target
    }
  } else if (m4tB.wrapped_) {
    if (m4tB.target) {
      return m4tA === m4tB.target
    }
  } else if (!force && dlgtA.isready && dlgtB.isready && (m4tA.incog_ || m4tB.incog_ || m4tA.hidden_ || m4tB.hidden_)) { // the `force` argument may be useless now that there is a readiness test.
    return m4tA === m4tB.target
  }
  var typeA = dlgtA.type // the brick type is not up to date
  var typeB = dlgtB.type // the brick type is not up to date
  var checkA = m4tA.check_
  var checkB = m4tB.check_
  if (m4tA.isSlot) {
    if (dlgtA.locked_) {
      return m4tA.target === m4tB
    }
    if (checkA) {
      if (checkB) {
        if (checkA.some(t => checkB.indexOf(t) >= 0)) {
          return true
        }
      } else {
        return checkA.indexOf(typeB) >= 0
      }
    }
    return true
  }
  if (m4tB.isSlot) {
    if (dlgtB.locked_) {
      return m4tA === m4tB.target
    }
    if (checkB) {
      if (checkA) {
        if (checkB.some(t => checkA.indexOf(t) >= 0)) {
          return true
        }
      } else if (checkB.indexOf(typeA) < 0) {
        return false
      } else {
        return true
      }
    }
    return true
  }
  if (checkA && checkA.indexOf(typeB) < 0) {
    return false
  }
  if (checkB && checkB.indexOf(typeA) < 0) {
    return false
  }
  return true
}

/**
 * This method returns a string describing this Magnet in developer terms
 * (English only). Intended to on be used in console logs and errors.
 * @return {string} The description.
 */
eYo.Magnet.Dflt_p.toString = function() {
  var msg
  var b3k = this.brick
  if (!b3k) {
    return 'Orphan Magnet'
  } else if (this.isOutput) {
    msg = 'Output Magnet of '
  } else if (this.isHead) {
    msg = 'Top Magnet of '
  } else if (this.isFoot) {
    msg = 'Bottom Magnet of '
  } else if (this.isSuite) {
    msg = 'Suite Magnet of '
  } else if (this.isLeft) {
    msg = 'Left statement Magnet of '
  } else if (this.isRight) {
    msg = 'Right statement Magnet of '
  } else {
    var parent = this.slot
    if (parent) {
      msg = 'Parent "' + parent.name + '" connection on '
    } else {
      console.warn('Magnet not actually connected to source')
      return 'Orphan Magnet'
    }
  }
  msg += b3k.type ? `"${b3k.type}" brick` : 'Brick'
  if (b3k.id) {
    msg += ` (id="${b3k.id}")`
  }
  return msg
}

/**
 * Connect two magnets together.  `This` is the magnet on the superior
 * brick.
 * Add hooks to allow customization.
 * This is a critical piece of code.
 * There are 3 different kinds of problems:
 * 1) the orphan management
 * 2) the check management
 * 3) the undo management
 * All this must fit together well.
 * Undo management must occur at a higher level.
 * Then orphan management at a middle level
 * Finally the check management once the state is modified.
 * We assume that breaking one connection does not cascade into another
 * connection break.
 * @param {eYo.Magnets.prototype} childM4t  A magnet on an inferior brick.
 * @private
 * @suppress {accessControls}
 */
eYo.Magnet.Dflt_p.connect_ = function (childM4t) {
  // `this` is actually the superior magnet
  var parentM4t = this
  var parent = parentM4t.brick
  var child = childM4t.brick
  var parentOldT4t = parentM4t.target
  var oldParentT4t = childM4t.target
  var oldChildT4t = parentM4t.target
  var unwrappedM4t = parentM4t.unwrappedMagnet
  var m4t
  if (parent.board !== child.board) {
    return
  }
  var attach_orphan = () => {
    if (parentOldT4t) {
      // Parent magnet is already connected to something.
      // Disconnect it and reattach it or bump it as needed.
      if (parentOldT4t.isOutput) {
        // Attempt to reattach the orphan at the end of the newly inserted
        // brick.  Since this brick may be a row, walk down to the end
        // or to the first free magnet.
        /*
        * Find the first free magnet in the given brick
        * that positively checks type with the given potential target magnet.
        * @param {eYo.Brick.Dflt} brick The brick.
        * @param {eYo.Magnet.Dflt} child The inferior brick.
        * @private
        * @suppress {accessControls}
        */
        var freeMagnet = (brick, magnet) => {
          return brick.someSlot(slot => {
            var ans = slot.magnet
            if (ans) {
              if (brick = ans.targetBrick) {
                return freeMagnet(brick, magnet)
              } else if (ans.checkType_(magnet)) {
                return ans
              }
            }
          })
        }
        if ((m4t = freeMagnet(child, parentOldT4t))) {
          // both magnets are free, no ∞ loop
          m4t.connect_(parentOldT4t)
          parentOldT4t = null
        }
      } else if (parentOldT4t.isHead) {
        var brick = child.footMost
        if ((m4t = brick.foot_m) && parentOldT4t.checkType_(m4t)) {
          m4t.connect(parentOldT4t)
          parentOldT4t = null
        }
      } else if (parentOldT4t.isLeft) {
        var brick = child.rightMost
        if ((m4t = brick.right_m) && parentOldT4t.checkType_(m4t)) {
          m4t.connect(parentOldT4t)
          otherM4t = null
        }
      }
      parentOldT4t && (parentOldT4t.bumpAwayFrom_(parentM4t))
    }
  }
  var link = () => {
    parentM4t.target_ = childM4t
    childM4t.target_ = parentM4t
    child.parent = parent
  }
  var connect2 = () => {
    // Disconnect any existing parent on the child connection.
    eYo.Events.fireBrickMove(child, () => {
      childM4t.disconnect() // move may start here
      attach_orphan()
      link()
      if (parent.ui.rendered) {
        parent.updateDisabled()
      }
      if (child.ui.rendered) {
        child.updateDisabled()
      }
      if (parent.ui.rendered && child.ui.rendered) {
        if (parentM4t.isFoot || parentM4t.isRight) {
          child.render()
        } else {
          // Child brick does not change shape.  Rendering the parent node will
          // move its connected children into position.
          parent.render()
        }
      }
      // move ends after parent's rendering
    })
  }
  var connect1 = () => {
    connect2()
    if (parentM4t.wrapped_) {
      child.hasFocus && (parent.focusOn())
      child.wrapped_ = true
    } else {
      // if this connection was selected, the newly connected brick should be selected too
      if (parentM4t.hasFocus) {
        var P = parent
        do {
          if (P.hasFocus) {
            child.focusOn()
            break
          }
        } while ((P = P.group))
      }
    }
    if (oldChildT4t && childM4t !== oldChildT4t) {
      var oldChild = oldChildT4t.brick
      if (oldChild) {
        if (oldChild.wrapped_) {
          eYo.Events.recordingUndo && (oldChild.dispose(true))
        } else if (!oldChildT4t.targetBrick) {
          // another chance to reconnect the orphan
          // just in case the check_ has changed in between
          // which might be the case for the else_part bricks
          if (oldChildT4t.isOutput) {
            child.someSlot(slot => {
              if (!slot.incog) {
                var m4t, t9k
                if ((m4t = slot.magnet)) {
                  if (m4t.hidden_ && !m4t.wrapped_) {
                    return
                  }
                  if ((t9k = m4t.targetBrick)) {
                    if (plug(t9k)) {
                      return true
                    }
                  } else if (m4t.checkType_(oldChildT4t)) {
                    m4t.connect(oldChildT4t)
                    return true
                  }
                }
              }
            })
          } else {
            P = child.footMost
            var m4t
            if ((m4t = P.foot_m) && m4t.checkType_(oldChildT4t)) {
              m4t.connect(oldChildT4t)
            }
          }
        }
      }
    }
    childM4t.hasFocus && (childM4t.focusOff())
    parentM4t.hasFocus && (parentM4t.focusOff())
    child.incog = parentM4t.incog
  }
  eYo.Events.groupWrap(() => {
    parent.change.wrap(() => { // Disable rendering until changes are made
      child.change.wrap(() => {
        parent.initUI(child.hasUI)
        child.initUI(parent.hasUI)
        parentM4t.willConnect(childM4t)
        if (unwrappedM4t !== parentM4t) {
          unwrappedM4t.willConnect(childM4t)
        }
        // (unwrappedM4t !== parentM4t) && unwrappedM4t.willConnect(childM4t)
        eYo.Do.tryFinally(() => {
          childM4t.willConnect(parentM4t)
          eYo.Do.tryFinally(() => {
            parent.willConnect(parentM4t, childM4t)
            eYo.Do.tryFinally(() => {
              child.willConnect(childM4t, parentM4t)
              eYo.Do.tryFinally(
                connect1, // 
                () => { // finally
                  parentM4t.startOfStatement && (child.changeDone())
                  eYo.Magnet.connectedParent = parentM4t
                  // next must absolutely run because of possible undo management
                  child.didConnect(childM4t, oldParentT4t, oldChildT4t)
                }
              )
            }, () => { // finally
              // next must absolutely run because of possible undo management
              parent.didConnect(parentM4t, oldChildT4t, oldParentT4t)
            })
          }, () => { // finally
            unwrappedM4t.bindField && (unwrappedM4t.bindField.visible = false)
            // next must absolutely run because of possible undo management
            parentM4t.didConnect(oldParentT4t, oldChildT4t)
            if (unwrappedM4t !== parentM4t) {
              unwrappedM4t.didConnect(oldParentT4t, oldChildT4t)
            }
            // (unwrappedM4t !== parentM4t) && unwrappedM4t.didConnect(oldParentT4t, oldChildT4t)
          })
        }, () => { // finally
          childM4t.didConnect(oldChildT4t, oldParentT4t)
          eYo.Magnet.connectedParent = eYo.NA
          childM4t.bindField && (childM4t.bindField.visible = false) // unreachable ?
        })
      })
    })
  })
  var ui
  if (ui = child.ui) {
    ui.didConnect(childM4t, oldChildT4t, oldParentT4t)
  }
  if (ui = parent.ui) {
    ui.didConnect(parentM4t, oldParentT4t, oldChildT4t)
  }
  if ((unwrappedM4t !== parentM4t) && (ui = unwrappedM4t.ui)) {
    ui.didConnect(parentM4t, oldParentT4t, oldChildT4t)
  }
}

/**
 * Tighten_ the magnet and its target.
 */
eYo.Magnet.Dflt_p.tighten = function() {
  var m4t = this.target
  if (m4t) {
    var xy = m4t.whereInBoard
    if (xy.x != 0 || xy.y != 0) {
      this.targetBrick.moveTo(xy)
    }
  }
}

/**
 * Scrolls the receiver to the top left part of the board.
 * Does nothing if the brick is already in the visible are,
 * and is not forced.
 * @param {Boolean} force  flag
 */
eYo.Magnet.Dflt_p.scrollToVisible = function (force) {
  this.brick.scrollToVisible(force)
}

/**
 * Move the brick(s) belonging to the connection to a point where they don't
 * visually interfere with the specified connection.
 * @param {eYo.Magnet.Dflt} m4t The connection to move away
 *     from.
 * @private
 * @suppress {accessControls}
 */
eYo.Magnet.Dflt_p.bumpAwayFrom_ = function (m4t) {
  var brick = this.brick
  if (!brick.board || brick.board.desk.desktop.isDragging) {
    return
  }
  // Move the root brick.
  var root = brick.root
  if (root.isInFlyout) {
    // Don't move bricks around in a flyout.
    return
  }
  if (!root.board) {
    return
  }
  var reverse = false
  if (!root.movable) {
    // Can't bump an uneditable brick away.
    // Check to see if the other brick is movable.
    root = m4t.brick.root
    if (!root.board || !root.movable) {
      return
    }
    // Swap the connections and move the 'static' connection instead.
    m4t = this
    reverse = true
  }
  // Raise it to the top for extra visibility.
  var selected = root.hasFocus
  selected || root.ui.addSelect()
  var dxy = eYo.Where.xy(eYo.Motion.SNAP_RADIUS, eYo.Motion.SNAP_RADIUS).backward(this.xy)
  if (reverse) {
    // When reversing a bump due to an uneditable brick, bump up.
    dxy.y = -dxy.y
  }
  // Bump to the right of the brick
  if (m4t.target) {
    dxy.x += m4t.targetBrick.width
  }
  root.moveBy(dxy)
  selected || root.ui.removeFocus()
}

/**
 * Hide this connection, as well as all down-stream connections on any brick
 * attached to this connection.  This happens when a brick is collapsed.
 */
eYo.Magnet.Dflt_p.hideAll = function() {
  this.hidden = true
  var t9k = this.targetBrick
  if (t9k) {
    t9k.descendants.forEach(brick => {
      brick.getMagnets_(true).forEach(m4t => m4t.hideAll())
    })
  }
}

/**
 * Find all nearby compatible magnets to the receiver.
 * Type checking does not apply, since this function is used for bumping.
 * @param {number} maxLimit The maximum radius to another connection, in
 *     board units.
 * @return {!Array<!eYo.Magnet>} List of magnets.
 * @private
 */
eYo.Magnet.Dflt_p.neighbours_ = function(maxLimit) {
  return this.dbOpposite.getNeighbours(this, maxLimit)
}

/**
 * Unhide the receiver, as well as all down-stream magnets on any brick
 * attached to it.  This happens when a brick is expanded.
 */
eYo.Magnet.Dflt_p.unhideAll = function() {
  this.hidden = false
  if (this.isSuperior) {
    var t9k = this.targetBrick
    t9k && (t9k.collapsed
        ? Object.values(t9k.magnets)
        : t9k.getMagnets_(true)).forEach(m4t => m4t.unhideAll())
  }
}

// Position
{
  /**
   * Find the closest compatible connection to this connection.
   * @param {eYo.Connection} conn The connection searching for a compatible
   *     mate.
   * @param {number} maxRadius The maximum radius to another connection.
   * @param {eYo.Where} dxy Offset between this connection's location
   *     in the database and the current location (as a result of dragging).
   * @return {!{connection: ?eYo.Connection, radius: number}} Contains two
   *     properties:' connection' which is either another connection or null,
   *     and 'radius' which is the distance.
   */
  var searchForClosest = (db, magnet, maxRadius, dxy) => {
    // Don't bother.
    if (!db.length) {
      return {magnet: null, radius: maxRadius}
    }
    var where = new eYo.Where(magnet.where).forward(dxy)
    // findPositionForConnection finds an index for insertion, which is always
    // after any block with the same y index.  We want to search both forward
    // and back, so search on both sides of the index.
    var closestIndex = db.findIndex_(where.y)
    var bestMagnet = null
    var bestRadius = maxRadius
    var temp;

    // Walk forward and back on the y axis looking for the closest x,y point.
    var min = closestIndex - 1
    while (min >= 0) {
      temp = db[min--]
      var radius = where.distance(temp.where)
      if (radius < maxRadius && magnet.isConnectionAllowed(temp)) {
        bestMagnet = temp
        bestRadius = radius
      }
    }
    var max = closestIndex
    while (max < db.length) {
      temp = db[max++]
      var radius = where.distance(temp.where)
      if (radius < maxRadius && magnet.isConnectionAllowed(temp)) {
        bestMagnet = temp
        bestRadius = radius
      }
    }
    // If there were no valid connections, bestConnection will be null.
    return {magnet: bestMagnet, radius: bestRadius}
  }
  /**
   * Find the closest compatible connection to this connection.
   * All parameters are in board units.
   * @param {eYo.Where} maxLimit The maximum radius to another connection.
   * @param {eYo.Where} dxy Horizontal offset between this connection's location
   *     in the database and the current location (as a result of dragging).
   * @return {!{connection: ?eYo.Magnet, radius: number}} Contains two
   *     properties: 'connection' which is either another connection or null,
   *     and 'radius' which is the distance.
   * @suppress{accessControls}
   */
  eYo.Magnet.Dflt_p.closest =  function (maxLimit, dxy) {
    if (this.hidden_) {
      return {}
    }
    return searchForClosest(this.dbOpposite_, this, maxLimit, dxy)
  }
}

/**
 * Move this magnet to the location given by its offset within the brick and
 * the location of the brick's top left corner.
 * @param {eYo.Where} blockTL The location of the top left corner
 *     of the brick, in board coordinates.
 */
eYo.Magnet.Dflt_p.moveToOffset = function(blockTL) {
  this.moveTo(blockTL.forward(this.where))
}

/**
 * Change the magnet's global coordinates.
 * @param {eYo.Where} here
 */
eYo.Magnet.Dflt_p.moveTo = function(here) {
  if (!this.where.equals(here) || (!here.x && !here.y)) {
    // Remove it from its old location in the database (if already present)
    this.inDB_ = false
    this.where.set(here)
    // Insert it into its new location in the database.
    this.hidden || (this.inDB_ = true)
  }
}

/**
 * Change the connection's coordinates.
 * Relative move with respect to the actual position.
 * @param {eYo.Where} dxy Change to coordinates, in board units.
 */
eYo.Magnet.Dflt_p.moveBy = function(dxy) {
  this.moveTo(this.where.forward(dxy))
}

/**
 * Returns the distance between this magnet and another magnet in
 * board units.
 * @param {eYo.Magnet.Dflt} other The other connection to measure
 *     the distance to.
 * @return {number} The distance between magnets, in board units.
 */
eYo.Magnet.Dflt_p.distance = function(other) {
  return this.where.distance(other.where)
}

{
  var parentM4t, parent, childM4t, child, unwrappedM4t
  var unlink = () => {
    // the work starts here
    if (parentM4t.wrapped_) {
      // currently unwrapping a brick,
      // this occurs while removing the parent
      // if the parent was selected, select the child
      child.wrapped_ = false
      parent.hasFocus && (child.focusOn())
    }
    // Now do the job
    parentM4t.target_ = null
    childM4t.target_ = null
    child.parent_ = null // Beware of the underscore here too !!!
  }
  /**
   * Disconnect this magnet from its target.
   * @return{Boolean} true iff there was a connection.
   */
  eYo.Magnet.Dflt_p.disconnect = function() {
    if (this.isSuperior) {
      // Superior brick.
      parentM4t = this
      if (!(childM4t = this.target)) {
        return false
      }
    } else {
      // Inferior brick.
      if (!(parentM4t = this.target)) {
        return false
      }
      childM4t = this
    }
    parent = parentM4t.brick
    child = childM4t.brick
    unwrappedM4t = parentM4t.unwrappedMagnet
    eYo.Events.groupWrap(() => {
      eYo.Events.fireBrickMove(child, () => {
        child.change.wrap(() => { // `this` is catched
          parent.change.wrap(() => { // `this` is catched
            eYo.Do.tryFinally(() => {
              parentM4t.willDisconnect()
              ;(unwrappedM4t !== parentM4t) && unwrappedM4t.willDisconnect()
              eYo.Do.tryFinally(() => {
                childM4t.willDisconnect()
                eYo.Do.tryFinally(() => {
                  parent.willDisconnect(parentM4t)
                  eYo.Do.tryFinally(() => {
                    child.willDisconnect(childM4t)
                    eYo.Do.tryFinally(() => {
                      unlink(parentM4t, childM4t)
                    }, () => { // finally
                      // next is not strong enough to save rendering
                      // eYo.Magnet.disconnectedParent = parentM4t
                      // eYo.Magnet.disconnectedChild = childM4t
                      // eYo.Magnet.disconnectedParent = eYo.NA
                      // eYo.Magnet.disconnectedChild = eYo.NA
                      parent.changeInputDone && (parent.changeInputDone()) // list are special
                      parentM4t.bindField && (parentM4t.bindField.visible = true) // no wrapped test
                      childM4t.bindField && (childM4t.bindField.visible = true) // unreachable ?
                    })
                  }, () => { // finally
                    child.didDisconnect(childM4t, parentM4t)
                  })
                }, () => { // finally
                  parent.didDisconnect(parentM4t, childM4t)
                })
              }, () => { // finally
                childM4t.didDisconnect(parentM4t)
              })
            }, () => { // finally
              parentM4t.didDisconnect(childM4t)
              ;(unwrappedM4t !== parentM4t) && unwrappedM4t.didDisconnect(childM4t)
            })
          })
        })
        child.changeDone()
        child.consolidate()
        parent.changeDone()
        parent.consolidate()
        var ui
        ;(ui = child.ui) && ui.didDisconnect(parentM4t)
        ;(ui = parent.ui) && ui.didDisconnect(childM4t)
        ;(unwrappedM4t !== parentM4t) && (ui = unwrappedM4t.ui) && ui.didDisconnect(childM4t)
      })
      // Rerender the parent so that it may reflow.
      // this will be done later
      if (parent.ui.rendered) {
        parent.render()
      }
      if (child.ui.rendered) {
        child.updateDisabled()
        child.render()
      }
    })
    child.parent = null
    return true
  }
}

/**
 * Connect the receiver to another magnet.
 * @param {eYo.Magnet.Dflt} other  The magnet to connect to.
 */
eYo.Magnet.Dflt_p.connect = function(other) {
  if (this.target === other) {
    return;
  }
  switch (this.canConnectWithReason_(other)) {
    case eYo.Magnet.CAN_CONNECT:
      break
    case eYo.Magnet.REASON_SELF_CONNECTION:
      throw 'Attempted to connect a brick to itself.'
    case eYo.Magnet.REASON_DIFFERENT_WORKSPACES:
      // Usually this means one brick has been deleted.
      throw 'Bricks not on same board.'
    case eYo.Magnet.REASON_WRONG_TYPE:
      throw 'Attempt to connect incompatible types.'
    case eYo.Magnet.REASON_TARGET_NULL:
      throw 'Target connection is null.'
    case eYo.Magnet.REASON_CHECKS_FAILED:
      throw `Connection checks failed. ${this} expected ${this.check_}, but found ${other.check_}`
    default:
      throw 'Unknown connection failure: this should never happen!'
  }
  // Determine which brick is superior (higher in the source stack).
  this.isSuperior
    ? this.connect_(other)
    : other.connect_(this)
}


/**
 * Checks whether the current connection can connect with the target
 * connection.
 * @param {eYo.Magnet.Dflt} target Magnet to check compatibility with.
 * @return {number} eYo.Magnet.CAN_CONNECT if the connection is legal,
 *    an error code otherwise.
 * @private
 */
eYo.Magnet.Dflt_p.canConnectWithReason_ = function(target) {
  if (!target) {
    return eYo.Magnet.REASON_TARGET_NULL
  }
  if (this.isSuperior) {
    var dlgt_A = this.brick
    var dlgt_B = target.brick
  } else {
    var dlgt_B = this.brick
    var dlgt_A = target.brick
  }
  if (dlgt_A && dlgt_A === dlgt_B) {
    return eYo.Magnet.REASON_SELF_CONNECTION
  } else if (target.type !== this.opposite_type) {
    return eYo.Magnet.REASON_WRONG_TYPE
  } else if (dlgt_A && dlgt_B && dlgt_A.board !== dlgt_B.board) {
    return eYo.Magnet.REASON_DIFFERENT_WORKSPACES
  } else if (!this.checkType_(target)) {
    return eYo.Magnet.REASON_CHECKS_FAILED
  }
  return eYo.Magnet.CAN_CONNECT
}

/**
 * Check if the two connections can be dragged to connect to each other.
 * A sealed connection is never allowed.
 * @param {eYo.Magnet.Dflt} candidate A nearby connection to check.
 * @param {Boolean} [ignoreDistance]
 * @return {boolean} True if the connection is allowed, false otherwise.
 */
eYo.Magnet.Dflt_p.isConnectionAllowed = function (candidate, maxRadius) {
  if (this.wrapped_ || candidate.wrapped_) {
    return false
  }
  if (goog.isDef(maxRadius) && this.distance(candidate) > maxRadius) {
    return false
  }
  // Type checking.
  if (this.canConnectWithReason_(candidate) !== eYo.Magnet.CAN_CONNECT) {
    return false
  }
  if (!candidate.isSuperior) {
    if (candidate.target || this.target) {
      return false
    }
  }
  var its_brick = candidate.targetBrick
  if (candidate.isSlot && candidate.target &&
      !its_brick.isMovable) {
    return false;
  }

  // Don't let a brick with no foot magnet bump other bricks out of the
  // stack.  Similarly, replacing a terminal statement with another terminal statement
  // is allowed.
  if (this.isHead &&
      candidate.target &&
      !this.brick.foot_m &&
      its_brick.foot_m) {
    return false;
  }

  do {
    if (this.brick === its_brick) {
      return false // candidate is contained in `this` owner
    }
  } while ((its_brick = its_brick.parent))

  return true
}