/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview BlockSvg delegates for edython, primary blocks.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.DelegateSvg.Primary')

goog.require('eYo.Msg')
goog.require('eYo.DelegateSvg.Expr')
goog.require('eYo.DelegateSvg.Stmt')
goog.require('goog.dom');

/**
 * Class for a DelegateSvg, attributeref.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Expr.makeSubclass('attributeref', {
  data: {
    attribute: {
      init: '',
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.Do.typeOfString(newValue)
        return type.raw === eYo.T3.Expr.builtin__name
        || type.expr === eYo.T3.Expr.identifier
        || type.expr === eYo.T3.Expr.dotted_name
        ? {validated: newValue} : null
      },
      synchronize: true
    }
  },
  slots: {
    primary: {
      order: 1,
      check: eYo.T3.Expr.Check.primary,
      plugged: eYo.T3.Expr.primary,
      hole_value: 'primary'
    },
    attribute: {
      order: 2,
      fields: {
        separator: '.',
        edit: {
          validate: true,
          endEditing: true,
          placeholder: eYo.Msg.Placeholder.ATTRIBUTE,
          variable: true
        }
      }
    }
  }
})

/**
 * Class for a DelegateSvg, subscription and slicing.
 * Due to the ambibuity, it is implemented only once for both.
 * Slicing is richer.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Expr.makeSubclass('slicing', {
  data: {
    variant: { // data named 'variant' have `xml = false`, by default
      NAME: eYo.Key.NAME,
      PRIMARY: eYo.Key.PRIMARY,
      all: [
        eYo.Key.NAME,
        eYo.Key.PRIMARY
      ],
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.data.name.setIncog(newValue !== this.NAME) // not the slot !
        var slot = this.owner_.slots.primary
        slot.required = newValue === this.PRIMARY
        slot.setIncog(!slot.required)
      }
    },
    name: {
      init: '',
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.Do.typeOfString(newValue).expr
        return type === eYo.T3.Expr.identifier
        || type === eYo.T3.Expr.dotted_name
        ? {validated: newValue} : null
      },
      synchronize: true
    }
  },
  slots: {
    name: {
      order: 1,
      fields: {
        edit: {
          validate: true,
          endEditing: true,
          placeholder: eYo.Msg.Placeholder.IDENTIFIER,
          variable: true
        }
      }
    },
    primary: {
      order: 2,
      check: eYo.T3.Expr.Check.primary,
      plugged: eYo.T3.Expr.primary,
      hole_value: 'primary',
      xml: {
        didLoad: /** @suppress {globalThis} */ function () {
          if (this.isRequiredFromDom()) {
            var variant = this.owner.data.variant
            variant.set(variant.model.PRIMARY)
          }
        }
      }
    },
    slice: {
      order: 3,
      fields: {
        start: '[',
        end: ']'
      },
      wrap: eYo.T3.Expr.slice_list
    }
  },
  output: {
    check: [eYo.T3.Expr.subscription, eYo.T3.Expr.slicing]
  }
})

eYo.DelegateSvg.Expr.subscription = eYo.DelegateSvg.Expr.slicing
eYo.DelegateSvg.Manager.register('subscription')

/**
 * Consolidate the block.
 * @param {!Blockly.Block} block The block.
 */
eYo.DelegateSvg.Expr.slicing.prototype.consolidate = function (block) {
  if (this.slots.primary.isRequiredFromDom()) {
    this.slots.primary.setRequiredFromDom(false)
    this.data.variant.set(this.data.variant.model.PRIMARY)
  }
  eYo.DelegateSvg.Expr.slicing.superClass_.consolidate.call(this, block)
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Expr.slicing.prototype.populateContextMenuFirst_ = function (block, mgr) {
  var variant = this.data.variant
  var current = variant.get()
  var F = function (content, j) {
    var menuItem = new eYo.MenuItem(content, function () {
      block.eyo.data.variant.set(j)
    })
    mgr.addChild(menuItem, true)
    menuItem.setEnabled(j !== current)
  }
  var name = this.data.name.get()
  var content =
  goog.dom.createDom(goog.dom.TagName.SPAN, null,
    eYo.Do.createSPAN(name || eYo.Msg.Placeholder.IDENTIFIER, name ? 'eyo-code' : 'eyo-code-placeholder'),
    eYo.Do.createSPAN('[…]', 'eyo-code')
  )
  F(content, variant.NAME)
  content =
  goog.dom.createDom(goog.dom.TagName.SPAN, null,
    eYo.Do.createSPAN(eYo.Msg.Placeholder.EXPRESSION, 'eyo-code-placeholder'),
    eYo.Do.createSPAN('[…]', 'eyo-code')
  )
  F(content, variant.PRIMARY)
  mgr.shouldSeparate()
  return eYo.DelegateSvg.Expr.slicing.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

/**
 * Class for a DelegateSvg, base call block.
 * As call is already a reserved message in javascript,
 * we use call_expr instead.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Expr.makeSubclass('base_call_expr', {
  data: {
    callerFlag: {
      init: false, // true when `foo` is expected instead of `foo(…)`
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          if (this.get()) {
            element.setAttribute('caller', 'true')
          }
        },
        load: /** @suppress {globalThis} */ function (element) {
          var attr = element.getAttribute('caller')
          this.set(attr && attr === 'true')
        }
      },
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        var ary = this.data.ary
        var ary_get = ary.get()
        var slots = this.owner_.slots
        slots.z_ary.setIncog(newValue || ary_get !== ary.Z_ARY)
        slots.unary.setIncog(newValue || ary_get !== ary.UNARY)
        slots.binary.setIncog(newValue || ary_get !== ary.BINARY)
        slots.ternary.setIncog(newValue || ary_get !== ary.TERNARY)
        slots.quadary.setIncog(newValue || ary_get !== ary.QUADARY)
        slots.pentary.setIncog(newValue || ary_get !== ary.PENTARY)
        slots.n_ary.setIncog(newValue || ary_get !== ary.N_ARY)
      }
    },
    ary: {
      order: 10,
      N_ARY: 'N',
      Z_ARY: '0',
      UNARY: '1',
      BINARY: '2',
      TERNARY: '3',
      QUADARY: '4',
      PENTARY: '5',
      all: ['0', '1', '2', '3', '4', '5', 'N'], // default value is Infinity
      init: 'N',
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        var caller = this.data.callerFlag.get()
        var slots = this.owner_.slots
        slots.z_ary.setIncog(caller || newValue !== this.Z_ARY)
        slots.unary.setIncog(caller || newValue !== this.UNARY)
        slots.binary.setIncog(caller || newValue !== this.BINARY)
        slots.ternary.setIncog(caller || newValue !== this.TERNARY)
        slots.quadary.setIncog(caller || newValue !== this.QUADARY)
        slots.pentary.setIncog(caller || newValue !== this.PENTARY)
        slots.n_ary.setIncog(caller || newValue !== this.N_ARY)
      }
    },
    name: {
      order: 1,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.Do.typeOfString(newValue)
        return type.raw === eYo.T3.Expr.builtin__name
        || type.expr === eYo.T3.Expr.identifier
        || type.expr === eYo.T3.Expr.dotted_name
        ? {validated: newValue} : null
        // return this.getAll().indexOf(newValue) < 0? null : {validated: newValue} // what about the future ?
      },
      consolidate: /** @suppress {globalThis} */ function () {
        this.didChange(undefined, this.get())
      },
      synchronize: true,
      xml: {
        didLoad: /** @suppress {globalThis} */ function () {
          if (this.isRequiredFromDom()) {
            var variant = this.owner.data.variant
            var current = variant.get()
            if (current !== variant.NAME && current !== variant.BUILTIN) {
              variant.set(variant.NAME)
            }
          }
        }
      }
    },
    isOptionalUnary: {
      order: 2000,
      noUndo: true,
      xml: false,
      validate: /** @suppress {globalThis} */ function (newValue) {
        return goog.isBoolean(newValue) ? {validated: newValue} : null
      },
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        this.owner_.slots.unary.input.connection.eyo.optional_ = this.get()
      }
    }
  },
  slots: {
    name: {
      order: 50,
      fields: {
        edit: {
          validate: true,
          endEditing: true,
          placeholder: eYo.Msg.Placeholder.IDENTIFIER
        }
      }
    },
    n_ary: {
      order: 100,
      fields: {
        start: '(',
        end: ')'
      },
      wrap: eYo.T3.Expr.argument_list
    },
    z_ary: {
      order: 101,
      fields: {
        start: '(',
        end: ')'
      }
    },
    unary: {
      order: 102,
      fields: {
        start: '(',
        end: ')'
      },
      check: eYo.T3.Expr.Check.argument_any,
      optional: false
    },
    binary: {
      order: 103,
      fields: {
        start: '(',
        end: ')'
      },
      wrap: eYo.T3.Expr.argument_list_2
    },
    ternary: {
      order: 104,
      fields: {
        start: '(',
        end: ')'
      },
      wrap: eYo.T3.Expr.argument_list_3
    },
    quadary: {
      order: 105,
      fields: {
        start: '(',
        end: ')'
      },
      wrap: eYo.T3.Expr.argument_list_4
    },
    pentary: {
      order: 106,
      fields: {
        start: '(',
        end: ')'
      },
      wrap: eYo.T3.Expr.argument_list_5
    }
  },
  output: {
    check: [eYo.T3.Expr.call_expr]
  }
})

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 * @suppress {globalThis}
*/
eYo.DelegateSvg.Expr.base_call_expr.populateMenu = function (block, mgr) {
  var caller = this.data.callerFlag
  var current = caller.get()
  var content = this.contentTemplate(block)
  var content = current
  ? goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
    content,
    '(…)'
  )
  : content
  var menuItem = new eYo.MenuItem(content, function () {
    caller.setTrusted(!current)
  })
  mgr.addChild(menuItem, true)
  var data = this.data.ary
  var current_ary = data.get()
  var self = this
  var F = function (ary, args) {
    if (ary !== current_ary) {
      var content = goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
        self.contentTemplate(block),
        '(',
        args,
        ')'
      )
      var menuItem = new eYo.MenuItem(content, self.doAndRender(block, function () {
        data.setTrusted(ary)
        caller.setTrusted(false)
      }, true))
      mgr.addChild(menuItem, true)
    }
  }
  F(data.Z_ARY, '')
  F(data.UNARY, '…')
  F(data.BINARY, '…, …')
  F(data.TERNARY, '…, …, …')
  F(data.N_ARY, '…, …, …, ...')
  mgr.shouldSeparate()
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 * @suppress {globalThis}
*/
eYo.DelegateSvg.Expr.base_call_expr.populateMenuCaller = function (block, mgr) {
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Expr.base_call_expr.prototype.populateContextMenuFirst_ = function (block, mgr) {
  eYo.DelegateSvg.Expr.base_call_expr.populateMenu.call(this, block, mgr)
  eYo.DelegateSvg.Expr.base_call_expr.populateMenuCaller.call(this, block, mgr)
  mgr.shouldSeparate()
  return eYo.DelegateSvg.Expr.base_call_expr.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

/**
 * Class for a DelegateSvg, base call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.makeSubclass('base_call_stmt', {
  link: eYo.T3.Expr.base_call_expr
})

/**
 * Template for contextual menu content.
 * @param {!Blockly.Block} block The block.
 */
eYo.DelegateSvg.Expr.base_call_expr.prototype.contentTemplate = eYo.DelegateSvg.Stmt.base_call_stmt.prototype.contentTemplate = function (block) {
  return this.data.name.get() || 'foo'
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Stmt.base_call_stmt.prototype.populateContextMenuFirst_ = function (block, mgr) {
  eYo.DelegateSvg.Expr.base_call_expr.populateMenu.call(this, block, mgr)
  eYo.DelegateSvg.Expr.base_call_expr.populateMenuCaller.call(this, block, mgr)
  mgr.shouldSeparate()
  return eYo.DelegateSvg.Stmt.call_stmt.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

/**
 * Class for a DelegateSvg, module call block.
 * This is for a call with a module prefix.
 * The same block will run for explicit and implicit calls
 * eg `math.sqrt` and `sqrt`. In order to switch between both options,
 * we add an `fromFlag` data similar to the `variant` data but with only 2 values.
 * For edython.
 */
eYo.DelegateSvg.Expr.base_call_expr.makeSubclass('module__call_expr', {
  data: {
    fromFlag: {
      init: false, // there is no `from … import …`, use fully qualified `foo.bar`
      undo: false,
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          if (this.get()) {
            element.setAttribute('from', 'true')
          }
        },
        load: /** @suppress {globalThis} */ function (element) {
          var attr = element.getAttribute('from')
          this.set(attr && attr === 'true')
        }
      },
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        var incog = this.get()
        this.owner_.slots.module.setIncog(incog)
        this.owner_.slots.dot.setIncog(incog)
      }
    },
    module: {
      order: 2,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.Do.typeOfString(newValue)
        return newValue && (
        type.raw === eYo.T3.Expr.builtin__name
        || type.expr === eYo.T3.Expr.identifier
        || type.expr === eYo.T3.Expr.dotted_name
        ) ? {validated: newValue} : null
        // return this.getAll().indexOf(newValue) < 0? null : {validated: newValue} // what about the future ?
      },
      consolidate: /** @suppress {globalThis} */ function () {
        this.didChange(undefined, this.get())
      },
      synchronize: true
    }
  },
  slots: {
    module: {
      order: 10,
      fields: {
        edit: {
          endEditing: true,
          placeholder: eYo.Msg.Placeholder.MODULE
        }
      }
    },
    dot: {
      order: 20,
      fields: {
        separator: '.'
      }
    }
  },
  output: {
    check: [eYo.T3.Expr.call_expr, eYo.T3.Expr.module__call_expr]
  }
})

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 * @suppress {globalThis}
*/
eYo.DelegateSvg.Expr.module__call_expr.populateMenu = function (block, mgr, args) {
  var data = this.data.fromFlag
  var flag = data.get()
  var name = this.data.name.get() || eYo.Msg.Placeholder.IDENTIFIER
  var content = goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
    block.eyo.contentTemplate(block, true),
    args
  )
  var menuItem = new eYo.MenuItem(content, function () {
    data.setTrusted(!flag)
  })
  mgr.addChild(menuItem, true)
  eYo.DelegateSvg.Expr.base_call_expr.populateMenuCaller.call(this, block, mgr)
  mgr.shouldSeparate()
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Expr.module__call_expr.prototype.populateContextMenuFirst_ = function (block, mgr) {
  eYo.DelegateSvg.Expr.base_call_expr.populateMenu.call(this, block, mgr)
  mgr.shouldSeparate()
  eYo.DelegateSvg.Expr.module__call_expr.populateMenu.call(this, block, mgr, '(…)')
  return eYo.DelegateSvg.Expr.base_call_expr.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

/**
 * Class for a DelegateSvg, call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.base_call_stmt.makeSubclass('module__call_stmt', {
  link: eYo.T3.Expr.module__call_expr
})

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Stmt.module__call_stmt.prototype.populateContextMenuFirst_ = function (block, mgr) {
  eYo.DelegateSvg.Expr.base_call_expr.populateMenu.call(this, block, mgr)
  mgr.shouldSeparate()
  eYo.DelegateSvg.Expr.module__call_expr.populateMenu.call(this, block, mgr, '(…)')
  mgr.shouldSeparate()
  return eYo.DelegateSvg.Stmt.base_call_expr.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

/**
 * Get the module.
 * @param {!Blockly.Block} block The block.
 */
eYo.DelegateSvg.Expr.module__call_expr.prototype.getModule = eYo.DelegateSvg.Stmt.module__call_stmt.prototype.getModule = function (block) {
  return this.data.module.get()
}

/**
 * Template for contextual menu content.
 * @param {!Blockly.Block} block The block.
 */
eYo.DelegateSvg.Expr.module__call_expr.prototype.contentTemplate = eYo.DelegateSvg.Stmt.module__call_stmt.prototype.contentTemplate = function (block, invert) {
  var flag = this.data.fromFlag.get()
  if (invert) {
    flag = !flag
  }
  var module = this.getModule(block)
  var name = this.data.name.get()
  if (name) {
    if (!flag) {
      if (module) {
        return module + '.' + name
      }
    } else {
      return name
    }
  } else {
    name = goog.dom.createDom(
      goog.dom.TagName.SPAN,
      'eyo-code-placeholder',
      eYo.Msg.Placeholder.IDENTIFIER,
    )
  }
  if (!flag) {
    if (!module) {
      module = goog.dom.createDom(
        goog.dom.TagName.SPAN,
        'eyo-code-placeholder',
        eYo.Msg.Placeholder.MODULE,
      )
    }
    return goog.dom.createDom(
      goog.dom.TagName.SPAN,
      'eyo-code',
      module,
      '.',
      name
    )
  } else {
    return name
  }
}

/**
 * Class for a DelegateSvg, call block.
 * As call is already a reserved message in javascript,
 * we use call_expr instead.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Expr.base_call_expr.makeSubclass('call_expr', {
  data: {
    variant: {
      order: 100,
      NAME: eYo.Key.NAME,
      BUILTIN: eYo.Key.BUILTIN,
      EXPRESSION: eYo.Key.EXPRESSION,
      EXPRESSION_ATTRIBUTE: eYo.Key.EXPRESSION_ATTRIBUTE, // the name is the attribute
      all: [
        eYo.Key.NAME,
        eYo.Key.BUILTIN,
        eYo.Key.EXPRESSION,
        eYo.Key.EXPRESSION_ATTRIBUTE
      ],
      init: eYo.Key.NAME,
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        var data = this.data.name
        var slot
        if (newValue === this.EXPRESSION_ATTRIBUTE) {
          data.required = true
          data.setIncog()
          this.owner_.slots.dot.setIncog(false)
          slot = this.owner_.slots.expression
          slot.required = true
          slot.setIncog()
        } else if (newValue === this.EXPRESSION) {
          data.required = false
          data.setIncog()
          this.owner_.slots.dot.setIncog(true)
          slot = this.owner_.slots.expression
          slot.required = true
          slot.setIncog()
        } else /* if (newValue === this.NAME || newValue === this.BUILTIN) */ {
          data.required = true
          data.setIncog()
          this.owner_.slots.dot.setIncog(true)
          slot = this.owner_.slots.expression
          slot.required = false
          slot.setIncog()
        }
        // force sync, usefull when switching to and from EXPRESSION_ATTRIBUTE variant
        this.data.name.synchronize()
      }
    },
    ary: {
      validate: /** @suppress {globalThis} */ function (newValue) {
        // only for builtin functions
        if (this.data.variant.get() === this.data.variant.model.BUILTIN) {
          switch (this.data.name.get()) {
            case 'int':
            case 'float':
            case 'complex':
            case 'len':
            case 'input':
            return newValue === this.UNARY ? {validated: newValue}: null
            case 'trunc':
            return this.BINARY ? {validated: newValue}: null
            case 'list':
            case 'set':
            case 'min':
            case 'max':
            case 'sum':
            default:
            return newValue === this.N_ARY ? {validated: newValue}: null
          }
        }
        return {validated: newValue}
      }
    },
    backup: {
      order: 1000,
      noUndo: true,
      xml: false
    },
    name: {
      all: ['input', 'int', 'float', 'list', 'set', 'len', 'min', 'max', 'sum', 'trunc', 'pow', 'abs', 'complex', 'conjugate'],
      init: 'int',
      main: true,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.Do.typeOfString(newValue)
        return type.raw === eYo.T3.Expr.builtin__name
        || type.expr === eYo.T3.Expr.identifier
        || type.expr === eYo.T3.Expr.dotted_name
        || newValue === ''
        ? {validated: newValue} : null
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        var M = this.data.variant
        var variant = this.data.variant.get()
        var isBuiltin = this.getAll().indexOf(newValue) >= 0
        if (isBuiltin) {
          if (variant === M.NAME) {
            this.data.variant.set(M.BUILTIN)
          }
          switch (newValue) {
            case 'conjugate':
            this.data.ary.set(this.data.ary.Z_ARY)
            break
            case 'int':
            case 'float':
            case 'complex':
            case 'len':
            case 'abs':
            this.data.isOptionalUnary.set(false)
            this.data.ary.set(this.data.ary.UNARY)
            break
            case 'pow':
            case 'trunc':
            this.data.ary.set(this.data.ary.BINARY)
            break
            case 'input':
            this.data.isOptionalUnary.set(true)
            this.data.ary.set(this.data.ary.UNARY)
            break
            case 'list':
            case 'set':
            case 'min':
            case 'max':
            case 'sum':
            this.data.ary.set(this.data.ary.N_ARY)
          }
        } else {
          if (variant === M.BUILTIN) {
            this.data.variant.set(M.NAME)
          }
          this.data.backup.set(newValue)
        }
      },
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize()
        var field = this.field
        var element = field && field.textElement_
        if (element) {
          var variant = this.data.variant
          var i = variant.get() === variant.BUILTIN ? 0 : 1
          var ra = ['eyo-code', 'eyo-code-reserved']
          goog.dom.classlist.remove(element, ra[i])
          goog.dom.classlist.add(element, ra[1 - i])
        }
      },
      consolidate: /** @suppress {globalThis} */ function () {
        this.didChange(undefined, this.get())
      },
      xml: {
        didLoad: /** @suppress {globalThis} */ function () {
          if (this.isRequiredFromDom()) {
            var variant = this.owner.data.variant
            var current = variant.get()
            if (current == variant.EXPRESSION) {
              variant.set(variant.EXPRESSION_ATTRIBUTE)
            }
          }
        }
      }
    }
  },
  slots: {
    expression: {
      order: 11,
      check: eYo.T3.Expr.Check.primary,
      plugged: eYo.T3.Expr.primary,
      hole_value: 'primary',
      xml: {
        didLoad: /** @suppress {globalThis} */ function () {
          if (this.isRequiredFromDom()) {
            var variant = this.owner.data.variant
            var current = variant.get()
            if (current !== variant.EXPRESSION && current !== variant.EXPRESSION_ATTRIBUTE) {
              var name = this.owner.data.variant.get()
              variant.set(name.length ? variant.EXPRESSION_ATTRIBUTE : variant.EXPRESSION)
            }
          }
        }
      }
    },
    dot: {
      order: 20,
      fields: {
        separator: '.'
      }
    }
  }
})

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 * @suppress {globalThis}
*/
eYo.DelegateSvg.Expr.call_expr.populateMenu = function (block, mgr) {
  var M = this.data.variant.model
  var variant = this.data.variant.get()
  var names = this.data.name.getAll()
  var i_name = names.indexOf(this.data.name.get())
  var oldValue = block.eyo.data.backup.get()
  if (variant !== M.NAME) {
    var content = goog.dom.createDom(goog.dom.TagName.SPAN, null,
      oldValue ? eYo.Do.createSPAN(oldValue, 'eyo-code') : eYo.Do.createSPAN(eYo.Msg.Placeholder.IDENTIFIER, 'eyo-code-placeholder'),
      eYo.Do.createSPAN('(…)', 'eyo-code')
    )
    var menuItem = new eYo.MenuItem(content, this.doAndRender(block, function () {
      this.data.name.setTrusted(oldValue || '')
      this.data.variant.set(M.NAME)
    }, true))
    mgr.addChild(menuItem, true)
  }
  var F = function (i) {
    // closure to catch j
    if (i !== i_name) {
      content = goog.dom.createDom(goog.dom.TagName.SPAN, null,
        eYo.Do.createSPAN(names[i], 'eyo-code-reserved'),
        eYo.Do.createSPAN('(…)', 'eyo-code')
      )
      var menuItem = new eYo.MenuItem(content, block.eyo.doAndRender(block, function () {
        this.data.name.setTrusted(names[i])
        this.data.variant.set(M.BUILTIN)
      }, true))
      mgr.addChild(menuItem, true)
    }
  }
  for (var i = 0; i < names.length; i++) {
    F(i)
  }
  if (variant !== M.EXPRESSION) {
    content = goog.dom.createDom(goog.dom.TagName.SPAN, null,
      eYo.Do.createSPAN(eYo.Msg.Placeholder.EXPRESSION, 'eyo-code-placeholder'),
      eYo.Do.createSPAN('(…)', 'eyo-code')
    )
    menuItem = new eYo.MenuItem(content, block.eyo.doAndRender(block, function () {
      this.data.name.setTrusted(oldValue || '')
      this.data.variant.set(M.EXPRESSION)
    }, true))
    mgr.addChild(menuItem, true)
  }
  if (variant !== M.BUILTIN) {
    mgr.separate()
    eYo.DelegateSvg.Expr.base_call_expr.populateMenu.call(this, block, mgr)
  }
  if (variant !== M.EXPRESSION_ATTRIBUTE) {
    mgr.separate()
    content = goog.dom.createDom(goog.dom.TagName.SPAN, null,
      eYo.Do.createSPAN(eYo.Msg.Placeholder.EXPRESSION, 'eyo-code-placeholder'),
      eYo.Do.createSPAN('.', 'eyo-code-placeholder'),
      eYo.Do.createSPAN(eYo.Msg.Placeholder.IDENTIFIER, 'eyo-code-placeholder'),
      eYo.Do.createSPAN('(…)', 'eyo-code')
    )
    menuItem = new eYo.MenuItem(content, block.eyo.doAndRender(block, function () {
      if (variant === M.BUILTIN) {
        this.data.name.setTrusted(oldValue || '')
      }
      this.data.variant.set(M.EXPRESSION_ATTRIBUTE)
    }, true))
    mgr.addChild(menuItem, true)
  }
  mgr.shouldSeparate()
}

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Expr.call_expr.prototype.populateContextMenuFirst_ = function (block, mgr) {
  eYo.DelegateSvg.Expr.call_expr.populateMenu.call(this, block, mgr)
  return eYo.DelegateSvg.Expr.base_call_expr.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

/**
 * Class for a DelegateSvg, call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.makeSubclass('call_stmt', {
  link: eYo.T3.Expr.call_expr
})

/**
 * Template for contextual menu content.
 * @param {!Blockly.Block} block The block.
 */
eYo.DelegateSvg.Stmt.call_stmt.prototype.contentTemplate = eYo.DelegateSvg.Stmt.base_call_stmt.prototype.contentTemplate

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
eYo.DelegateSvg.Stmt.call_stmt.prototype.populateContextMenuFirst_ = function (block, mgr) {
  eYo.DelegateSvg.Expr.call_expr.populateMenu.call(this, block, mgr)
  return eYo.DelegateSvg.Stmt.call_stmt.superClass_.populateContextMenuFirst_.call(this, block, mgr)
}

eYo.DelegateSvg.Primary.T3s = [
  eYo.T3.Expr.term,
  eYo.T3.Expr.attributeref,
  eYo.T3.Expr.slicing,
  eYo.T3.Expr.subscription,
  eYo.T3.Expr.base_call_expr,
  eYo.T3.Stmt.base_call_stmt,
  eYo.T3.Expr.module__call_expr,
  eYo.T3.Stmt.module__call_stmt,
  eYo.T3.Expr.call_expr,
  eYo.T3.Stmt.call_stmt
]
