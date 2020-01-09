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

eYo.require('stmt')
eYo.require('expr.list')

/// /////// gobal/nonlocal statement
/**
 * Class for a Delegate, non_void_identifier_list brick.
 * This brick may be wrapped.
 * Not normally called directly, eYo.Brick.Create(...) is preferred.
 * For edython.
 */
eYo.expr.list.makeSubclass(eYo.t3.Expr.non_void_identifier_list, {
  list: {
    check: eYo.t3.Expr.Check.non_void_identifier_list,
    presep: ',',
    mandatory: 1
  }
})

/**
 * Class for a Delegate, global_stmt.
 * For edython.
 */
eYo.Stmt.makeClass(eYo.t3.stmt.global_stmt, {
  data: {
    variant: {
      all: [
        eYo.key.PASS,
        eYo.key.CONTINUE,
        eYo.key.BREAK,
        eYo.key.GLOBAL,
        eYo.key.NONLOCAL,
        eYo.key.DEL,
        eYo.key.RETURN
      ],
      init: eYo.key.PASS,
      synchronize (builtin, after) /** @suppress {globalThis} */ {
        builtin()
        var b3k = this.brick
        b3k.identifiers_s.incog = after !== eYo.key.GLOBAL && after !== eYo.key.NONLOCAL
        b3k.del_s.incog = after !== eYo.key.DEL
        b3k.return_s.incog = after !== eYo.key.RETURN
      },
      xml: {
        save (element, opt) /** @suppress {globalThis} */ {
        },
        load (element) /** @suppress {globalThis} */ {
          this.brick.variant_p = element.getAttribute(eYo.key.EYO)
        }
      },
      fromType (type) /** @suppress {globalThis} */ {
        this.set({
          [eYo.t3.Stmt.pass_stmt]: eYo.key.PASS,
          [eYo.t3.Stmt.Continue_stmt]: eYo.key.CONTINUE,[eYo.t3.stmt.Break_stmt]: eYo.key.BREAK,
          [eYo.t3.Stmt.global_stmt]: eYo.key.GLOBAL,
          [eYo.t3.Stmt.nonlocal_stmt]: eYo.key.NONLOCAL,
          [eYo.t3.Stmt.del_stmt]: eYo.key.DEL,
          [eYo.t3.Stmt.return_stmt]: eYo.key.RETURN
        } [type])
      }
    }
  },
  fields: {
    variant: {
      reserved: ''
    }
  },
  slots: {
    identifiers: {
      order: 1,
      promise: eYo.t3.Expr.non_void_identifier_list,
      xml: {
        key: 'list',
        save (element) /** @suppress {globalThis} */ {
          var variant = this.brick.variant_p
          if (variant === eYo.key.GLOBAL || variant === eYo.key.NONLOCAL) {
            this.save(element)
          }
        },
        load (element) /** @suppress {globalThis} */ {
          var variant = this.brick.variant_p
          if (variant === eYo.key.GLOBAL || variant === eYo.key.NONLOCAL) {
            this.load(element)
          }
        }
      }
    },
    del: {
      order: 2,
      wrap: eYo.t3.Expr.Target_list,
      xml: {
        key: 'list',
        save (element) /** @suppress {globalThis} */ {
          if (this.brick.variant_p === eYo.key.DEL) {
            this.save(element)
          }
        },
        load (element) /** @suppress {globalThis} */ {
          if (this.brick.variant_p === eYo.key.DEL) {
            this.load(element)
          }
        }
      }
    },
    return: {
      order: 3,
      wrap: eYo.t3.Expr.optional_expression_list,
      xml: {
        key: 'list',
        save (element) /** @suppress {globalThis} */ {
          if (this.brick.variant_p === eYo.key.RETURN) {
            this.save(element)
          }
        },
        load (element) /** @suppress {globalThis} */ {
          if (this.brick.variant_p === eYo.key.RETURN) {
            this.load(element)
          }
        }
      }
    }
  }
})

;[
  'pass',
  'continue',
  'break',
  'nonlocal',
  'del',
  'return'
].forEach((k) => {
  k = k + '_stmt'
  eYo.C9r.register(k, (eYo.Stmt[k] = eYo.stmt.global_stmt))
})

/**
 * The type and connection depend on the properties modifier, value and variant.
 * For edython.
 */
eYo.Stmt.global_stmt.prototype.getType = eYo.C9r.decorateChange(
  'getType',
  function () {
    this.setupType(
      {
        [eYo.key.PASS]: eYo.t3.Stmt.pass_stmt,
        [eYo.key.CONTINUE]: eYo.t3.Stmt.Continue_stmt,
        [eYo.key.BREAK]: eYo.t3.Stmt.Break_stmt,
        [eYo.key.GLOBAL]: eYo.t3.Stmt.global_stmt,
        [eYo.key.NONLOCAL]: eYo.t3.Stmt.nonlocal_stmt,
        [eYo.key.DEL]: eYo.t3.Stmt.del_stmt,
        [eYo.key.RETURN]: eYo.t3.Stmt.return_stmt
      } [this.variant_p]
    )
    return this.type
  }
)

/**
 * The xml `eyo` attribute of this brick, as it should appear in the saved data.
 * For edython.
 * @return !String
 */
eYo.Stmt.global_stmt.prototype.xmlAttr = function () {
  return this.variant_p
}

/**
 * Populate the context menu for the given brick.
 * @param {eYo.Brick.Dflt} brick The brick.
 * @param {eYo.MenuManager} mngr mngr.menu is the menu to populate.
 * @private
 */
eYo.Stmt.global_stmt.prototype.populateContextMenuFirst_ = function (mngr) {
  var current = this.variant_p
  var variants = this.variant_d.getAll()
  var F = (i) => {
    var key = variants[i]
    var content = goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
      eYo.do.CreateSPAN(key, 'eyo-code-reserved')
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
  mngr.shouldSeparate()
  F = (i) => {
    var key = variants[i]
    var content = goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
      eYo.do.CreateSPAN(key, 'eyo-code-reserved'),
      eYo.do.CreateSPAN(' …', 'eyo-code-placeholder')
    )
    var menuItem = mngr.newMenuItem(content, () => {
      this.variant_p = key
    })
    mngr.addChild(menuItem, true)
    menuItem.setEnabled(key !== current)
  }
  F(3)
  F(4)
  F(5)
  F(6)
  mngr.shouldSeparate()
  return eYo.stmt.global_stmt.SuperProto_.populateContextMenuFirst_.Call(this, mngr)
}
