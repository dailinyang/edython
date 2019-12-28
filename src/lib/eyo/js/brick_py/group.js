/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Bricks for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('Stmt')

eYo.forwardDeclare('Msg')

goog.forwardDeclare('goog.dom')

/**
 * @name{eYo.Stmt.Group}
 * Class for a Delegate, base group statement brick.
 * Base group is subclassed into Group and Control.
 * For edython.
 */
eYo.Stmt.Dflt.makeSubclass('Group', {
  head (type) /** @suppress {globalThis} */ {
    return null
  },
  left: eYo.NA,
  right: {
    check (type) /** @suppress {globalThis} */ {
      return this.brick.suite
      ? [eYo.T3.Stmt.comment_stmt]
      : eYo.T3.Stmt.Right.simple_stmt
    },
    fields: {
      label: { // don't call it 'operator'
        reserved: ':',
        hidden: false
      }
    }
  },
  suite (type) /** @suppress {globalThis} */ {
    return this.brick.right
    ? []
    : null
  },
  foot (type) /** @suppress {globalThis} */ {
    return null
  },
  valued: {
    isGroup: true,
  }
})

/**
 * Class for a Delegate, if_part brick.
 * Not normally called directly, eYo.Brick.create(...) is preferred.
 * For edython.
 */
eYo.Stmt.Group.makeSubclass('Branch', {
  data: {
    variant: {
      all: [
        eYo.Key.IF,
        eYo.Key.ELIF,
        eYo.Key.ELSE,
        eYo.Key.WHILE
      ],
      init: eYo.Key.IF,
      synchronize (newValue) /** @suppress {globalThis} */ {
        this.synchronize(newValue)
        this.brick.if_d.incog = newValue === eYo.Key.ELSE
      },
      fromType (type) /** @suppress {globalThis} */ {
        if (type === eYo.T3.Stmt.while_part) {
          this.set(eYo.Key.WHILE)
        } else if (type === eYo.T3.Stmt.elif_part) {
          this.set(eYo.Key.ELIF)
        } else if (type === eYo.T3.Stmt.else_part) {
          this.set(eYo.Key.ELSE)
        } else if (type === eYo.T3.Stmt.try_else_part) {
          this.set(eYo.Key.ELSE)
        } else if (type === eYo.T3.Stmt.last_else_part) {
          this.set(eYo.Key.ELSE)
        } else {
          this.set(eYo.Key.IF)
        }
      },
      xml: {
        save (element, opt) /** @suppress {globalThis} */ {
        },
        load (element) /** @suppress {globalThis} */ {
          this.brick.variant_p = element.getAttribute(eYo.Key.EYO)
        },
      },
      isChanging (oldValue, newValue) /** @suppress {globalThis} */ { // same code for primary bricks
        this.brick.consolidateType()
        this.brick.consolidateMagnets()
        this.duringChange(oldValue, newValue)
      },
    },
    if: {
      init: '',
      placeholder: eYo.Msg.Placeholder.CONDITION,
      validate: false, // use the python interpreter to validate this
      synchronize: true,
    }
  },
  fields: {
    variant: {
      reserved: ''
    }
  },
  slots: {
    if: {
      order: 1,
      fields: {
        bind: {
          endEditing: true
        }
      },
      check: eYo.T3.Expr.Check.namedexpr_test
    }
  },
  head (type) /** @suppress {globalThis} */ {
    return eYo.T3.Stmt.Previous[type.substring(4)]
  },
  foot (type) /** @suppress {globalThis} */ {
    return eYo.T3.Stmt.Next[type.substring(4)]
  },
})

/**
 * The xml `eyo` attribute of this brick, as it should appear in the saved data.
 * For edython.
 * @return {String}
 */
eYo.Stmt.Branch.prototype.xmlAttr = function () {
  return this.variant_p
}

/**
 * getBaseType.
 * The type depends on the variant and the modifiers.
 * As side effect, the subtype is set.
 * When the type changes, the connections may change,
 * and when the connection changes, the type changes.
 * Each type change may imply a disconnection.
 * At least, the type may change to a value when no connection is connected.
 */
eYo.Stmt.Branch.prototype.getBaseType = function () {
  var T3 = eYo.T3.Stmt
  var type = {
    [eYo.Key.IF]: T3.if_part,
    [eYo.Key.ELIF]: T3.elif_part,
    [eYo.Key.WHILE]: T3.while_part
  } [this.variant_p]
  if (!type) {
    var targetMagnet
    if ((targetMagnet = this.head_m.target)) {
      // look at the high connection
      //
      var t9k = targetMagnet.brick
      if ((targetMagnet.check_ && targetMagnet.check_.indexOf(T3.last_else_part) < 0) || (T3.Previous.last_else_part && T3.Previous.last_else_part.indexOf(t9k.type) < 0)) {
        type = T3.try_else_part
      } else if ((targetMagnet.check_ && targetMagnet.check_.indexOf(T3.try_else_part) < 0) || (T3.Previous.try_else_part && T3.Previous.try_else_part.indexOf(t9k.type) < 0)) {
        type = T3.last_else_part
      }
    }
    if (!type && (targetMagnet = this.foot_m.target)) {
      // the high connection did not add any constrain
      // may be the low connection will?
      t9k = targetMagnet.brick
      if ((targetMagnet.check_ && targetMagnet.check_.indexOf(T3.last_else_part) < 0) || (T3.Next.last_else_part && T3.Next.last_else_part.indexOf(t9k.type) < 0)) {
        type = T3.try_else_part
      } else if ((targetMagnet.check_ && targetMagnet.check_.indexOf(T3.try_else_part) < 0) || (T3.Next.try_else_part && T3.Next.try_else_part.indexOf(t9k.type) < 0)) {
        type = T3.last_else_part
      }
    }
  }
  this.setupType(type || T3.else_part) // bad smell, the code has changed
  return this.type_
}

/**
 * Populate the context menu for the given brick.
 * @param {eYo.Brick.Dflt} brick The brick.
 * @param {eYo.MenuManager} mngr mngr.menu is the menu to populate.
 * @private
 */
eYo.Stmt.Branch.prototype.populateContextMenuFirst_ = function (mngr) {
  var current = this.variant_p
  var variants = this.variant_d.getAll()
  var F = (i) => {
    var key = variants[i]
    var content = goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
      eYo.Do.createSPAN(key, 'eyo-code-reserved')
    )
    var menuItem = mngr.newMenuItem(content, () => {
      this.variant_p = key
    })
    mngr.addChild(menuItem, true)
    menuItem.setEnabled(key !== current)
  }
  F(0)
  F(1)
  F(2)
  F(3)
  mngr.shouldSeparate()
  return eYo.Stmt.global_stmt.superProto_.populateContextMenuFirst_.call(this, mngr)
}

;[
  'if',
  'elif',
  'else',
  'while',
  'try_else',
  'last_else'
].forEach(name => {
  var k = name + '_part'
  eYo.C9r.register(k, (eYo.Stmt[k] = eYo.Stmt.Branch))
})

/**
 * Will draw the brick. Default implementation does nothing.
 * The print statement needs some preparation before drawing.
 * @param {Brick} brick
 * @private
 */
eYo.Stmt.Group.prototype.willRender_ = function (recorder) {
  eYo.Stmt.Group.superProto_.willRender_.call(this, recorder)
  var field = this.async_f
  if (field) {
    field.visible = this.async_
  }
}

/**
 * Populate the context menu for the given brick.
 * @param {eYo.Brick.Dflt} brick The brick.
 * @param {eYo.MenuManager} mngr mngr.menu is the menu to populate.
 * @private
 */
eYo.Stmt.Group.prototype.populateContextMenuFirst_ = function (mngr) {
  if (this.async_f) {
    var content = goog.dom.createDom(goog.dom.TagName.SPAN, null,
      eYo.Do.createSPAN('async', 'eyo-code-reserved'),
      goog.dom.createTextNode(' ' + eYo.Msg.AT_THE_LEFT)
    )
    if (this.async_) {
      mngr.addRemoveChild(mngr.newMenuItem(content, () => {
        this.async_ = false
      }))
      mngr.shouldSeparateRemove()
    } else {
      mngr.addInsertChild(mngr.newMenuItem(content, () => {
        this.async_ = true
      }))
      mngr.shouldSeparateInsert()
    }
  }
  return eYo.Stmt.Group.superProto_.populateContextMenuFirst_.call(this, mngr)
}

/**
 * Class for a Delegate, for_part brick.
 * Not normally called directly, eYo.Brick.create(...) is preferred.
 * For edython.
 */
eYo.Stmt.Group.makeSubclass('for_part', true, {
  slots: {
    for: {
      order: 1,
      fields: {
        label: 'for'
      },
      wrap: eYo.T3.Expr.target_list
    },
    in: {
      order: 2,
      fields: {
        label: 'in'
      },
      wrap: eYo.T3.Expr.expression_list
    }
  }
})

/**
 * Class for a Delegate, with_part brick.
 * Not normally called directly, eYo.Brick.create(...) is preferred.
 * For edython.
 */
eYo.Stmt.Group.makeSubclass('with_part', true, {
  slots: {
    with: {
      order: 1,
      fields: {
        label: 'with'
      },
      wrap: eYo.T3.Expr.with_item_list
    }
  }
})

eYo.Stmt.Group.T3s = [
  eYo.T3.Stmt.if_part,
  eYo.T3.Stmt.elif_part,
  eYo.T3.Stmt.else_part,
  eYo.T3.Stmt.while_part,
  eYo.T3.Stmt.with_part,
  eYo.T3.Stmt.for_part
]