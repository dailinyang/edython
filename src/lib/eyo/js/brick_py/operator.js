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

eYo.require('expr')

eYo.provide('brick.operator')

/**
 * Class for a Delegate, [...] op ... brick.
 * Multiple ops.
 * Abstract class.
 * For edython.
 */
eYo.expr.Dflt.makeSubclass('binary', {
  data: {
    operator: { // only one field with that key,
      init: '+',
      validate (after) /** @suppress {globalThis} */ {
        var m = eYo.expr.Binary.getTypeForOperator(after)
        return m !== eYo.t3.Expr.unset
          ? after
          : eYo.INVALID
      },
      synchronize (builtin, after) /** @suppress {globalThis} */ {
        builtin()
        var d = this.field.ui_driver_mngr
        d && (d.makeReserved(this.field, ['in', 'or', 'and'].indexOf(after) >= 0))
      },
      fromType (type) /** @suppress {globalThis} */ {
        if (type === eYo.t3.Expr.m_expr) {
          this.set('*')
        } else if (type === eYo.t3.Expr.A_expr) {
          this.set('+')
        } else if (type === eYo.t3.Expr.or_test) {
          this.set('or')
        } else if (type === eYo.t3.Expr.And_test) {
          this.set('and')
        } else if (type === eYo.t3.Expr.power) {
          this.set('**')
        } else if (type === eYo.t3.Expr.Shift_expr) {
          this.set('<<')
        } else if (type === eYo.t3.Expr.And_expr) {
          this.set('&')
        } else if (type === eYo.t3.Expr.xor_expr) {
          this.set('^')
        } else if (type === eYo.t3.Expr.or_expr) {
          this.set('|')
        } else if (type === eYo.t3.Expr.number_comparison) {
          this.set('<')
        } else if (type === eYo.t3.Expr.object_comparison) {
          this.set('in')
        }
      }
    },
    lhs: {
      init: '',
      synchronize: true
    },
    rhs: {
      init: '',
      synchronize: true
    }
  },
  slots: {
    lhs: {
      order: 1,
      fields: {
        bind: {
          endEditing: true,
          placeholder () /** @suppress {globalThis} */ {
            var type = this.brick.type
            return {
              [eYo.t3.Expr.m_expr]: 1,
              [eYo.t3.Expr.A_expr]: 1,
              [eYo.t3.Expr.or_test]: 'test',
              [eYo.t3.Expr.And_test]: 'test',
              [eYo.t3.Expr.power]: 1,
              [eYo.t3.Expr.Shift_expr]: 1,
              [eYo.t3.Expr.And_expr]: 1,
              [eYo.t3.Expr.xor_expr]: 1,
              [eYo.t3.Expr.or_expr]: 1,
              [eYo.t3.Expr.number_comparison]: '1',
              [eYo.t3.Expr.object_comparison]: 'object'
            } [type]
          }
        }
      },
      check (type) /** @suppress {globalThis} */ {
        var m = eYo.expr.Binary.getOperatorModelForType(type)
        if (!m) {
          console.error('NO MODEL FOR', type)
        }
        return m && m.lhs
      }
    },
    rhs: {
      order: 2,
      fields: {
        operator: {
          order: 1,
          value: ''
        },
        bind: {
          order: 2,
          endEditing: true,
          placeholder () /** @suppress {globalThis} */ {
            var type = this.brick.type
            return {
              [eYo.t3.Expr.m_expr]: 1,
              [eYo.t3.Expr.A_expr]: 1,
              [eYo.t3.Expr.or_test]: 'test',
              [eYo.t3.Expr.And_test]: 'test',
              [eYo.t3.Expr.power]: 1,
              [eYo.t3.Expr.Shift_expr]: 1,
              [eYo.t3.Expr.And_expr]: 1,
              [eYo.t3.Expr.xor_expr]: 1,
              [eYo.t3.Expr.or_expr]: 1,
              [eYo.t3.Expr.number_comparison]: '1',
              [eYo.t3.Expr.object_comparison]: 'container'
            } [type]
          }
        }
      },
      check (type) /** @suppress {globalThis} */ {
        var m = eYo.expr.Binary.getOperatorModelForType(type)
        return m && m.rhs
      }
    }
  },
  out: {
    check (type) /** @suppress {globalThis} */ {
      return type
    }
  }
})

eYo.t3.Expr.Check.Binary.forEach(k => {
  if (k !== eYo.t3.Expr.Any) {
    k = k.substring(4)
    eYo.C9r.register(k, (eYo.expr[k] = eYo.expr.Binary))
  }
})

;[
  'power',
  'and_test',
  'or_test',
  'comparison',
  'number_comparison',
  'object_comparison'
].forEach(k => {
  eYo.C9r.register(k, (eYo.expr[k] = eYo.expr.Binary))
})

/**
 * Get the operator model.
 * For edython.
 * @return a dictionary
 */
eYo.expr.Binary.getOperatorModelForType = function (type) {
  return {
    [eYo.t3.Expr.m_expr]: {
      lhs: eYo.t3.Expr.Check.m_expr_all,
      rhs: eYo.t3.Expr.Check.u_expr_all
    },
    [eYo.t3.Expr.A_expr]: {
      lhs: eYo.t3.Expr.Check.A_expr_all,
      rhs: eYo.t3.Expr.Check.m_expr_all
    },
    [eYo.t3.Expr.or_test]: {
      lhs: eYo.t3.Expr.Check.or_test_all,
      rhs: eYo.t3.Expr.Check.And_test_all
    },
    [eYo.t3.Expr.And_test]: {
      lhs: eYo.t3.Expr.Check.And_test_all,
      rhs: eYo.t3.Expr.Check.not_test_all
    },
    [eYo.t3.Expr.power]: {
      lhs: eYo.t3.Expr.Check.Await_or_primary,
      rhs: eYo.t3.Expr.Check.u_expr_all
    },
    [eYo.t3.Expr.Shift_expr]: {
      lhs: eYo.t3.Expr.Check.Shift_expr_all,
      rhs: eYo.t3.Expr.Check.A_expr_all
    },
    [eYo.t3.Expr.And_expr]: {
      lhs: eYo.t3.Expr.Check.And_expr_all,
      rhs: eYo.t3.Expr.Check.Shift_expr_all
    },
    [eYo.t3.Expr.xor_expr]: {
      lhs: eYo.t3.Expr.Check.xor_expr_all,
      rhs: eYo.t3.Expr.Check.And_expr_all
    },
    [eYo.t3.Expr.or_expr]: {
      lhs: eYo.t3.Expr.Check.or_expr_all,
      rhs: eYo.t3.Expr.Check.xor_expr_all
    },
    [eYo.t3.Expr.Comparison]: {
      lhs: eYo.t3.Expr.Check.Comparison,
      rhs: eYo.t3.Expr.Check.Comparison
    },
    [eYo.t3.Expr.number_comparison]: {
      lhs: eYo.t3.Expr.Check.Comparison,
      rhs: eYo.t3.Expr.Check.Comparison
    },
    [eYo.t3.Expr.object_comparison]: {
      lhs: eYo.t3.Expr.Check.Comparison,
      rhs: eYo.t3.Expr.Check.Comparison
    }
  } [type]
}

/**
 * Get the operator model.
 * For edython.
 * @return a dictionary
 */
eYo.expr.Binary.getTypeForOperator = function (op) {
  if (['*', '//', '/', '%', '@'].indexOf(op) >= 0) {
    return eYo.t3.Expr.m_expr
  }
  if (['+', '-'].indexOf(op) >= 0) {
    return eYo.t3.Expr.A_expr
  }
  if (['<', '>', '==', '>=', '<=', '!='].indexOf(op) >= 0) {
    return eYo.t3.Expr.number_comparison
  }
  if ('or' === op) {
    return eYo.t3.Expr.or_test
  }
  if ('and' === op) {
    return eYo.t3.Expr.And_test
  }
  if (['is', 'is not', 'in', 'not in'].indexOf(op) >= 0) {
    return eYo.t3.Expr.object_comparison
  }
  if ('**' === op) {
    return eYo.t3.Expr.power
  }
  if (['<<', '>>'].indexOf(op) >= 0) {
    return eYo.t3.Expr.Shift_expr
  }
  if ('&' === op) {
    return eYo.t3.Expr.And_expr
  }
  if ('^' === op) {
    return eYo.t3.Expr.xor_expr
  }
  if ('|' === op) {
    return eYo.t3.Expr.or_expr
  }
  return eYo.t3.Expr.unset
}

/**
 * The xml `eyo` attribute of this brick, as it should appear in the saved data.
 * For edython.
 * @return !String
 */
eYo.expr.Binary.prototype.xmlAttr = function () {
  var type = this.type
  return type.endsWith('comparison') ? 'comparison' : type.substring(4)
}

/**
 * Consolidate the type of the brick.
 * Unstable state.
 * For edython.
 */
eYo.expr.Binary.prototype.getBaseType = function () {
  return this.constructor.getTypeForOperator(this.operator_p)
}

eYo.t3.Expr.unary = 'eyo:unary' // don't forget it !

/**
 * Class for a Delegate, unary op ... brick.
 * u_expr.
 * For edython.
 */
eYo.expr.Dflt.makeSubclass('unary', {
  xml: {
    types: [
      eYo.t3.Expr.u_expr,
      eYo.t3.Expr.not_test
    ],
    attr: 'unary'
  },
  data: {
    operator: {
      all: ['-', '+', '~', 'not'],
      init: '-',
      validate (after) /** @suppress {globalThis} */ {
        var m = eYo.expr.unary.getTypeForOperator(after)
        return m !== eYo.t3.Expr.unset
          ? after
          : eYo.INVALID
      },
      synchronize (builtin, after) /** @suppress {globalThis} */ {
        builtin()
        var d = this.field.ui_driver_mngr
        d && (d.makeReserved(this.field, after === 'not'))
      },
      fromType (type) /** @suppress {globalThis} */ {
        if (type === eYo.t3.Expr.not_test) {
          this.set('not')
        }
      }
    },
    rhs: {
      init: '',
      placeholder (type) /** @suppress {globalThis} */ {
        return type === eYo.t3.Expr.not_test
         ? 'test'
         : 1
      },
      synchronize: true
    }
  },
  slots: {
    rhs: {
      order: 1000,
      fields: {
        operator: {
          order: 1,
          value: ''
        },
        bind: {
          order: 2,
          validate: true,
          endEditing: true
        }
      },
      check (type) /** @suppress {globalThis} */ {
        var m = eYo.expr.unary.getOperatorModelForType(type)
        return m && m.rhs
      }
    }
  },
  out: {
    check (type) /** @suppress {globalThis} */ {
      return type
    }
  }
})

;[
  'u_expr',
  'not_test'
].forEach(k => {
  eYo.C9r.register(k, (eYo.expr[k] = eYo.expr.unary))
})

/**
 * Get the operator model.
 * For edython.
 * @return a dictionary
 */
eYo.expr.unary.getOperatorModelForType = function (type) {
  return {
    [eYo.t3.Expr.u_expr]: {
      rhs: eYo.t3.Expr.Check.u_expr_all
    },
    [eYo.t3.Expr.not_test]: {
      rhs: eYo.t3.Expr.Check.not_test_all
    }
  } [type]
}

/**
 * Get the operator model.
 * For edython.
 * @return a dictionary
 */
eYo.expr.unary.prototype.getOperatorModel = function () {
  var op = this.operator_p
  return eYo.expr.unary.getOperatorModel(op)
}

/**
 * Consolidate the type of the brick.
 * Unstable state.
 * For edython.
 */
eYo.expr.unary.prototype.getBaseType = function () {
  return this.constructor.getTypeForOperator(this.operator_p)
}

/**
 * Get the operator model.
 * For edython.
 * @return a dictionary
 */
eYo.expr.unary.getTypeForOperator = function (op) {
  if (['+', '-', '~'].indexOf(op) >= 0) {
    return eYo.t3.Expr.u_expr
  }
  if ('not' === op) {
    return eYo.t3.Expr.not_test
  }
  return eYo.t3.Expr.unset
}

eYo.Brick.operator.T3s = [
  eYo.t3.Expr.u_expr,
  eYo.t3.Expr.m_expr,
  eYo.t3.Expr.A_expr,
  eYo.t3.Expr.Shift_expr,
  eYo.t3.Expr.And_expr,
  eYo.t3.Expr.xor_expr,
  eYo.t3.Expr.or_expr,
  eYo.t3.Expr.number_comparison,
  eYo.t3.Expr.object_comparison,
  eYo.t3.Expr.or_test,
  eYo.t3.Expr.And_test,
  eYo.t3.Expr.power
]
