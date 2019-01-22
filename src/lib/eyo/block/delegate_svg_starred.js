/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview BlockSvg delegates for edython, `star` modifications.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.DelegateSvg.Starred')

goog.require('eYo.Msg')
goog.require('eYo.Decorate')
goog.require('eYo.DelegateSvg')
goog.require('eYo.T3.All')
goog.require('goog.dom');

/**
 * Convenient check list for starred expressions
 */
eYo.T3.Expr.Check._expression_or_parameter = eYo.T3.Expr.Check.expression.concat(eYo.T3.Expr.Check.parameter)

/**
 * Convenient check list for starred expressions
 */
eYo.T3.Expr.Check._or_expr_all_or_parameter_or_target = eYo.T3.Expr.Check.or_expr_all.concat(eYo.T3.Expr.Check.parameter).concat(eYo.T3.Expr.Check.target)

/**
 * Class for a DelegateSvg, starred block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * 
 * Involved types:
 * 
 *   star_expr ::= "*" or_expr_all
 *   expression_star ::= "*" expression
 *   expression_star_star ::= "**" expression
 *   target_star ::= "*" target
 *   star ::= "*"
 *   parameter_star ::= "*" parameter     
 *   parameter_star_star ::= "**" parameter
 * 
 * For edython.
 */

eYo.DelegateSvg.Expr.makeSubclass('Starred', {
  xml: {
    types: [
      eYo.T3.Expr.star_expr,
      eYo.T3.Expr.expression_star,
      eYo.T3.Expr.expression_star_star,
      eYo.T3.Expr.or_expr_star_star,
      eYo.T3.Expr.target_star,
      eYo.T3.Expr.star,
      eYo.T3.Expr.parameter_star,
      eYo.T3.Expr.parameter_star_star
    ]
  },
  data: {
    variant: {
      order: 98,
      all: [eYo.Key.NONE, eYo.Key.STAR],
      init: eYo.Key.NONE, // not a lonely '*'
      validate: /** @suppress {globalThis} */ function (newValue) {
        return newValue === eYo.Key.STAR && this.owner.modifier_p !== '*'
          ? {}
          : {validated: newValue}
      },
      fromType: /** @suppress {globalThis} */ function (type) {
        this.set(type === eYo.T3.Expr.star ? eYo.Key.STAR : eYo.Key.NONE)
      },
      synchronize: /** @suppress {globalThis} */ function (newValue) {
        this.synchronize(newValue)
        this.owner.modified_d.setIncog(newValue === eYo.Key.STAR)
      },
      xml: false
    },
    modifier: {
      order: 99,
      all: ['*', '**'],
      init: '*',
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        if (newValue !== '*') {
          this.owner.variant_p = eYo.Key.NONE
        }
      },
      fromType: /** @suppress {globalThis} */ function (type) {
        /* if (type === eYo.T3.Expr.star) {
          this.set('*')
        } else if (type === eYo.T3.Expr.target_star) {
          this.set('*')
        } else if (type === eYo.T3.Expr.parameter_star) {
          this.set('*')
        } else if (type === eYo.T3.Expr.star_expr) {
          this.set('*')
        } else */ if (type === eYo.T3.Expr.parameter_star_star) {
          this.set('**')
        } else if (type === eYo.T3.Expr.expression_star_star) {
          this.set('**')
        } else if (type === eYo.T3.Expr.or_expr_star_star) {
          this.set('**')
        } else {
          this.set('*')
        }
        // this.set()
      },
      synchronize: true,
      xml: false
    },
    modified: {
      init: '',
      placeholder: eYo.Msg.Placeholder.EXPRESSION,
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        if (newValue.length) {
          this.owner.variant_p = eYo.Key.NONE
        }
      },
      synchronize: true,
      xml: {
        save: /** @suppress {globalThis} */ function (element, opt) {
          this.required = this.owner.variant_p !== eYo.Key.STAR
          this.save(element, opt)
        },
        load: /** @suppress {globalThis} */ function (element, opt) {
          this.load(element, opt)
        }
      },
      didLoad: /** @suppress {globalThis} */ function () {
        this.owner.variant_p = this.isRequiredFromModel()
          ? eYo.Key.NONE
          : eYo.Key.STAR
      }
    }
  },
  fields: {
    modifier: {
      value: '',
      css: 'reserved'
    }
  },
  slots: {
    modified: {
      order: 10,
      fields: {
        bind: {
          endEditing: true
        }
      },
      check: /** @suppress {globalThis} */ function (type) {
        return this.b_eyo.modifier_p === '*'
          ? eYo.T3.Expr.Check._or_expr_all_or_parameter_or_target
          : eYo.T3.Expr.Check._expression_or_parameter
      }
    }
  },
  output: {
    check: /** @suppress {globalThis} */ function (type) {
      // retrieve the block delegate
      var b_eyo = this.b_eyo
      if (b_eyo.variant_p === eYo.Key.STAR) {
        return [eYo.T3.Expr.star]
      }
      var t = b_eyo.modified_t
      var types = []
      if (b_eyo.modifier_p === '*') {
        if (t) {
          if (goog.array.contains(eYo.T3.Expr.Check.or_expr_all, t)) {
            types.push(eYo.T3.Expr.star_expr)
          }
          if (goog.array.contains(eYo.T3.Expr.Check.expression, t)) {
            types.push(eYo.T3.Expr.expression_star)
          }
          if (goog.array.contains(eYo.T3.Expr.Check.target, t)) {
            types.push(eYo.T3.Expr.target_star)
          }
          if (goog.array.contains(eYo.T3.Expr.Check.parameter, t)) {
            types.push(eYo.T3.Expr.parameter_star)
          }
          return types
        }
        return [eYo.T3.Expr.star_expr,
          eYo.T3.Expr.expression_star,
          eYo.T3.Expr.target_star,
          eYo.T3.Expr.parameter_star
        ]
      }
      if(t) {
        if (goog.array.contains(eYo.T3.Expr.Check.or_expr_all, t)) {
          types.push(eYo.T3.Expr.or_expr_star_star)
        }
        if (goog.array.contains(eYo.T3.Expr.Check.expression, t)) {
          types.push(eYo.T3.Expr.expression_star_star)
        }
        if (goog.array.contains(eYo.T3.Expr.Check.parameter, t)) {
          types.push(eYo.T3.Expr.parameter_star_star)
        }
        return types
      }
      return [eYo.T3.Expr.star_expr,
        eYo.T3.Expr.expression_star,
        eYo.T3.Expr.target_star,
        eYo.T3.Expr.parameter_star
      ]
    }
  }
})

/**
 * The type and connection depend on the properties modifier, value and variant.
 * For edython.
 */
eYo.DelegateSvg.Expr.Starred.prototype.getType = eYo.Decorate.onChangeCount(
  'getType',
  function () {
    var check = this.outputConnection.check_
    return check && check[0]
  }
)

/**
 * The xml `eyo` attribute of this block, as it should appear in the saved data.
 * For edython.
 * @return {String}
 */
eYo.DelegateSvg.Expr.Starred.prototype.xmlAttr = function () {
  return this.modifier_p
}

var ra = [
  'star_expr',
  'expression_star',
  'expression_star_star',
  'target_star',
  'star',
  'parameter_star',
  'parameter_star_star'
]
ra.forEach(
    key => {
      eYo.DelegateSvg.Expr[key] = eYo.DelegateSvg.Expr.Starred
      eYo.DelegateSvg.Manager.register(key)
    }
  )
