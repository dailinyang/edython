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

console.warn('THIS MUST BE AN EXPRESSION')
/**
 * Class for a Delegate, docstring_stmt.
 * For edython.
 */
eYo.Stmt.makeClass(eYo.T3.Stmt.docstring_stmt, {
  link: eYo.T3.Expr.longliteral,
  computed: {
    /**
     * @readonly
     * @property {Boolean}  always true
     */
    isWhite () {
      return true
    },
  }
}, true)