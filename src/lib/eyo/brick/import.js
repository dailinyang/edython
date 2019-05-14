/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview Block delegates for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Brick.Import')

goog.require('eYo.Msg')
goog.require('eYo.Brick.List')
goog.require('eYo.Brick.Stmt')
goog.require('goog.dom');

/// //////////////     module_as      ///////////////////
/*
import_module ::= "import" non_void_module_as_list
non_void_module_as_list ::= module_as ( "," module_as )*
# module_as is not just an identifier, to simplify the UI management
# module might represent here an object from a python module
module_as ::= module ["as" identifier]
module ::= module_name ['.' module]
#name  ::=  identifier
name ::= IGNORE
module_name ::= identifier
*/

/**
 * Class for a Delegate, non_void_module_as_list brick.
 * This brick may be wrapped.
 * Not normally called directly, eYo.Brick.create(...) is preferred.
 * For edython.
 */
eYo.Brick.List.makeSubclass('non_void_module_as_list', {
  list: {
    check: eYo.T3.Expr.Check.non_void_module_as_list,
    mandatory: 1,
    presep: ',',
    hole_value: 'module'
  }
})

/**
 * Class for a Delegate, non_void_import_identifier_as_list brick.
 * This brick may be wrapped.
 * Not normally called directly, eYo.Brick.create(...) is preferred.
 * For edython.
 */
eYo.Brick.List.makeSubclass('non_void_import_identifier_as_list', {
  list: {
    check: eYo.T3.Expr.Check.non_void_import_identifier_as_list,
    mandatory: 1,
    presep: ',',
    hole_value: 'name',
    placeholder: eYo.Msg.Placeholder.IDENTIFIER
  }
})

/// //////////////     import_stmt      ///////////////////

/**
 * Class for a Delegate, import_stmt.
 * The value property is used to store the module.
 * For edython.
 */
eYo.Brick.Stmt.makeSubclass('import_stmt', {
  data: {
    variant: {
      all: [
        eYo.Key.IMPORT,
        eYo.Key.FROM_MODULE_IMPORT,
        eYo.Key.FROM_MODULE_IMPORT_STAR
      ],
      init: eYo.Key.IMPORT,
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        var O = this.owner
        O.import_module_d.requiredIncog = newValue === eYo.Key.IMPORT
        O.from_d.requiredIncog = newValue !== eYo.Key.IMPORT
        O.import_d.requiredIncog = newValue === eYo.Key.FROM_MODULE_IMPORT
        O.import_star_s.requiredIncog = newValue === eYo.Key.FROM_MODULE_IMPORT_STAR
      }
    },
    import_module: {
      init: '',
      placeholder: eYo.Msg.Placeholder.TERM,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var p5e = eYo.T3.Profile.get(newValue)
        return p5e === eYo.T3.Profile.void
        || p5e.raw === eYo.T3.Expr.builtin__name
        || p5e.expr === eYo.T3.Expr.identifier
        || p5e.expr === eYo.T3.Expr.parent_module
        || p5e.expr === eYo.T3.Expr.dotted_name
        || newValue === '...'
        ? {validated: newValue} : null
        // return this.getAll().indexOf(newValue) < 0? null : {validated: newValue} // what about the future ?
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        if (newValue) {
          this.owner.variant_p = eYo.Key.IMPORT
        }
      },
      synchronize: true,
      xml: {
        save: /** @suppress {globalThis} */ function (element, opt) {
          if (!this.owner.import_module_s.unwrappedTarget) {
            this.save(element, opt)
          }
        }
      }
    },
    from: {
      init:'',
      placeholder: eYo.Msg.Placeholder.MODULE,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var p5e = eYo.T3.Profile.get(newValue, null)
        var variant = this.owner.variant_p
        return p5e === eYo.T3.Profile.void
        || p5e.expr === eYo.T3.Expr.identifier
        || p5e.expr === eYo.T3.Expr.dotted_name
        || ((variant !== eYo.Key.FROM_MODULE_IMPORT_STAR)
          && (p5e.expr === eYo.T3.Expr.parent_module || newValue === '...'))
            ? {validated: newValue} : null
      },
      synchronize: true,
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        if (newValue) {
          var O = this.owner
          if (O.variant_p === eYo.Key.IMPORT) {
            // STAR of not ?
            O.variant_p = O.import_s.unwrappedTarget
            ? eYo.Key.FROM_MODULE_IMPORT
            : eYo.Key.FROM_MODULE_IMPORT_STAR
          }
        }
      }
    },
    import: {
      init: '',
      placeholder: eYo.Msg.Placeholder.TERM,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var p5e = eYo.T3.Profile.get(newValue)
        return p5e === eYo.T3.Profile.void
        || p5e.expr === eYo.T3.Expr.identifier
        ? {validated: newValue} : null
        // return this.getAll().indexOf(newValue) < 0? null : {validated: newValue} // what about the future ?
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        if (newValue) {
          this.owner.variant_p = eYo.Key.FROM_MODULE_IMPORT
        }
      },
      synchronize: true,
      xml: {
        save: /** @suppress {globalThis} */ function (element, opt) {
          if (!this.owner.import_s.unwrappedTarget) {
            this.save(element, opt)
          }
        }
      }
    }
  },
  slots: {
    import_module: {
      order: 1,
      fields: {
        label: 'import',
        bind: {
          endEditing: true
        }
      },
      promise: eYo.T3.Expr.non_void_module_as_list,
      didConnect: /** @suppress {globalThis} */ function (oldTargetM4t, targetOldM4t) {
        var parent = this.brick.parent
        parent && (parent.variant_p = eYo.Key.IMPORT)
      }
    },
    from: {
      order: 2,
      fields: {
        label: 'from',
        bind: {
          endEditing: true,
          variable: true // change this to/with a `module` data
        }
      },
      check: /** @suppress {globalThis} */ function (type) {
        var v = this.brick.variant_p
        return v === eYo.Key.FROM_MODULE_IMPORT_STAR
        ? [
          eYo.T3.Expr.unset,
          eYo.T3.Expr.identifier,
          eYo.T3.Expr.dotted_name
        ] : [
          eYo.T3.Expr.unset,
          eYo.T3.Expr.identifier,
          eYo.T3.Expr.dotted_name,
          eYo.T3.Expr.parent_module
        ]
      },
      didLoad: /** @suppress {globalThis} */ function () {
        if (this.isRequiredFromSaved()) {
          var O = this.owner
          if (O.variant_p === eYo.Key.IMPORT) {
            // STAR of not ?
            O.variant_p = O.import_s.unwrappedTarget
            ? eYo.Key.FROM_MODULE_IMPORT
            : eYo.Key.FROM_MODULE_IMPORT_STAR
          }
        }
      },
      didConnect: /** @suppress {globalThis} */ function (oldTargetM4t, targetOldM4t) {
        var O = this.brick
        if (O.variant_p === eYo.Key.IMPORT) {
          // STAR of not ?
          O.variant_p = O.import_s.unwrappedTarget
          ? eYo.Key.FROM_MODULE_IMPORT
          : eYo.Key.FROM_MODULE_IMPORT_STAR
        }
      }
    },
    import: {
      order: 3,
      fields: {
        label: 'import',
        bind: {
          endEditing: true
        }
      },
      promise: eYo.T3.Expr.non_void_import_identifier_as_list,
      didLoad: /** @suppress {globalThis} */ function () {
        if (this.isRequiredFromSaved()) {
          this.owner.variant_p = eYo.Key.FROM_MODULE_IMPORT
        }
      },
      didConnect: /** @suppress {globalThis} */ function (oldTargetM4t, targetOldM4t) {
        var parent = this.brick.parent
        parent && (parent.variant_p = eYo.Key.FROM_MODULE_IMPORT)
      }
    },
    import_star: {
      order: 4,
      fields: {
        label: {
          value: 'import *',
          css: 'reserved'
        }
      },
      xml: {
        save: /** @suppress {globalThis} */ function (element, opt) {
          if (this.owner.variant_p === eYo.Key.FROM_MODULE_IMPORT_STAR) {
            element.setAttribute('star', 'true')
          }
        },
        load: /** @suppress {globalThis} */ function (element) {
          if (element.getAttribute('star') === 'true') {
            this.owner.variant_p = eYo.Key.FROM_MODULE_IMPORT_STAR
          }
        }
      }
    }
  },
  init: /** @suppress {globalThis} */ function () {
    eYo.Brick.Stmt.registerImport(this)
  },
  deinit: /** @suppress {globalThis} */ function () {
    eYo.Brick.Stmt.unregisterImport(this)
  }
}, true)

eYo.Do.addProtocol(eYo.Brick.Stmt, 'Register', 'Import', function (delegate) {
  return !delegate.isInFlyout
})

Object.defineProperties(eYo.Brick.Stmt.import_stmt.prototype, {
  star_p: {
    get () {
      return this.variant_p === eYo.Key.FROM_MODULE_IMPORT_STAR
    },
    set(newValue) {
      if (newValue) {
        this.variant_p = eYo.Key.FROM_MODULE_IMPORT_STAR
      } else if (this.variant_p === eYo.Key.FROM_MODULE_IMPORT_STAR) {
        this.variant_p = eYo.Key.FROM_MODULE_IMPORT
      }
    }
  }
})
/**
 * Returns a dictionary of modules imported by this brick, when not disabled.
 */
eYo.Brick.Stmt.import_stmt.prototype.importedModules = function () {
  if (this.disabled) {
    return
  }
  var modules = {}
  var v = this.variant_p
  if (v === eYo.Key.IMPORT) {
    // non_void_import_identifier_as_list
    this.import_b.inputList.forEach(input => {
      var t_brick = input.targetBrick
      if (t_brick.type === eYo.T3.Expr.identifier) {
        modules[t_brick.target_p] = t_brick.target_p
      } else if (t_brick.type === eYo.T3.Expr.identifier_as) {
        modules[t_brick.target_p] = t_brick.alias_p
      } else { // when connected to an 'any' brick
        var any = t_brick.expression_p
        any && any.split(/\s*,\s*/).forEach(c => {
          var ased = c.split(/\s*as\s*/)
          var name = ased[0]
          name && (modules[name] = ased[1] || name)
        })
      }
    })
  } else /* if (v === eYo.Key.FROM_MODULE_IMPORT[_STAR]) */ {
    modules[p] = this.from_p
  }
  return modules
}

/**
 * When the brick is just a wrapper, returns the wrapped target.
 */
eYo.Brick.Stmt.import_stmt.prototype.getMenuTarget = function () {
  return this
}

/**
 * Populate the context menu for the given brick.
 * @param {!Blockly.Block} brick The brick.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.Brick.Stmt.import_stmt.prototype.populateContextMenuFirst_ = function (mgr) {
  var current = this.variant_p
  var F = (content, variant) => {
    if (variant !== current) {
      var menuItem = mgr.newMenuItem(content, () => {
        this.variant_p = variant
      })
      mgr.addChild(menuItem, true)
      menuItem.setEnabled(variant !== current)
    }
  }
  var from = this.from_p
  var module = from ? from : 'module'
  var style = from ? 'eyo-code' : 'eyo-code-placeholder'
  F(goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
    eYo.Do.createSPAN('import ', 'eyo-code-reserved'),
    eYo.Do.createSPAN(module, style),
    goog.dom.createTextNode(' ['),
    eYo.Do.createSPAN('as', 'eyo-code-reserved'),
    goog.dom.createTextNode(' ...]')
  ), eYo.Key.IMPORT)
  F(goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
    eYo.Do.createSPAN('from ', 'eyo-code-reserved'),
    eYo.Do.createSPAN(module + ' ', style),
    eYo.Do.createSPAN('import ', 'eyo-code-reserved'),
    goog.dom.createTextNode('… ['),
    eYo.Do.createSPAN('as', 'eyo-code-reserved'),
    goog.dom.createTextNode(' …]')
  ), eYo.Key.FROM_MODULE_IMPORT)
  F(goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
    eYo.Do.createSPAN('from ', 'eyo-code-reserved'),
    eYo.Do.createSPAN(module + ' ', style),
    eYo.Do.createSPAN('import *', 'eyo-code-reserved')
  ), eYo.Key.FROM_MODULE_IMPORT_STAR)
  mgr.shouldSeparate()
  return eYo.Brick.Stmt.import_stmt.superClass_.populateContextMenuFirst_.call(this, mgr)
}

/// //////// future
// This is expected to disappear soon
/**
 * Class for a Delegate, future_statement.
 * For edython.
 */
eYo.Brick.Stmt.makeSubclass('future_statement', {
  slots: {
    list: {
      order: 1,
      fields: {
        label: {
          value: 'from __future__ import',
          css: 'reserved'
        }
      },
      wrap: eYo.T3.Expr.non_void_import_identifier_as_list
    }
  }
}, true)

eYo.Brick.Import.T3s = [
  eYo.T3.Expr.identifier,
  eYo.T3.Expr.non_void_module_as_list,
  eYo.T3.Expr.non_void_import_identifier_as_list,
  eYo.T3.Stmt.import_stmt,
  eYo.T3.Stmt.future_statement
]