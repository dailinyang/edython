/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License CeCILL-B
 */
/**
 * @fileoverview BlockSvg delegates for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('edY.DelegateSvg.Argument')

goog.require('edY.DelegateSvg.List')

/**
 * Class for a DelegateSvg, keyword_item block.
 * Not normally called directly, edY.DelegateSvg.create(...) is preferred.
 * For edython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
edY.DelegateSvg.Expr.makeSubclass('keyword_item', {
  tiles: {
    identifier: {
      order: 1,
      check: edY.T3.Expr.identifier,
      hole_value: 'key',
    },
    expression: {
      order: 3,
      fields: {
        label: '=',
      },
      check: edY.T3.Expr.Check.expression,
      hole_value: 'value',
    },
  },
})

/**
 * List consolidator for argument list.
 * Rules are a bit stronger than python requires originally
 * 1) If there is a comprehension, it must be alone.
 * 2) positional arguments come first, id est expression and starred expressions
 * 3) then come keyword items or double starred expressions
 * Main entry: consolidate
 * @param {!String} single, the required type for a single element....
 */
// edY.Consolidator.Arguments = function() {
//   edY.Consolidator.Arguments.superClass_.constructor.call(this, edY.Consolidator.Arguments.data)
// }
// goog.inherits(edY.Consolidator.Arguments, edY.Consolidator.List)

// edY.Consolidator.Arguments.data = {
//   check: null,
//   empty: true,
//   presep: ',',
// }
edY.Consolidator.List.makeSubclass('Arguments', {
  check: null,
  empty: true,
  presep: ',',
}, edY.Consolidator.List, edY.Consolidator)
/**
 * Prepare io, just before walking through the input list.
 * Subclassers may add their own stuff to io.
 * @param {!Blockly.Block} block, owner or the receiver.
 */
edY.Consolidator.Arguments.prototype.getIO = function(block) {
  var io = edY.Consolidator.Arguments.superClass_.getIO.call(this, block)
  io.first_keyword = io.last_positional = io.unique = -1
  return io
}

/**
 * Once the whole list has been managed,
 * there might be unwanted things.
 * @param {object} io
 */
edY.Consolidator.Arguments.prototype.doCleanup = function () {
  // preparation: walk through the list of inputs and
  // find the key inputs
  var Type = {
    UNCONNECTED: 0,
    ARGUMENT: 1,
    KEYWORD: 2,
    COMPREHENSION: 3,
  }
    /**
   * Whether the input corresponds to an identifier...
   * Called when io.input is connected.
   * @param {Object} io, parameters....
   */
  var getCheckType = function(io) {
    var target = io.c8n.targetConnection
    if (!target) {
      return Type.UNCONNECTED
    }
    var check = target.check_
    if (goog.array.contains(check, edY.T3.Expr.comprehension)) {
      io.unique = io.i
      return Type.COMPREHENSION
    } else if (goog.array.contains(check, edY.T3.Expr.expression_star_star) || goog.array.contains(check, edY.T3.Expr.keyword_item)) {
      return Type.KEYWORD
    } else {
      return Type.ARGUMENT
    }
  }
  var setupFirst = function (io) {
    io.first_keyword = io.last_positional = io.unique = -1
    this.setupIO(io, 0)
    while (!!io.edy&& io.unique < 1) {
      switch ((io.edy.parameter_type_ = getCheckType(io))) {
        case Type.ARGUMENT:
        io.last_positional = io.i
        break
        case Type.KEYWORD:
        if (io.first_keyword < 0) {
          io.first_keyword = io.i
        }
        break
        case Type.COMPREHENSION:
        io.unique = io.i
      }
      this.nextInput(io)
    }
  }
  return function(io) {
    edY.Consolidator.Arguments.superClass_.doCleanup.call(this, io)
    setupFirst.call(this, io)
    if (io.unique >= 0) {
      // remove whatever comes before and after the io.unique
      this.setupIO(io, 0)
      while (io.i < io.unique--) {
        this.disposeAtI(io)
        this.setupIO(io)
      }
      this.setupIO(io, 1)
      while (io.i < io.list.length) {
        this.disposeAtI(io)
        this.setupIO(io)
      }
    } else
    // move parameters that are not placed correctly (in edY sense)
    if (io.first_keyword>=0) {
      while (io.first_keyword < io.last_positional) {
        this.setupIO(io, io.first_keyword + 2)
        while (io.i <= io.last_positional) {
          if (io.edy.parameter_type_ === Type.ARGUMENT) {
            // move this to io.first_keyword
            var c8n = io.c8n
            var target = c8n.targetConnection
            c8n.disconnect()
            while (io.i > io.first_keyword) {
              this.setupIO(io, io.i - 2)
              var t = io.c8n.targetConnection
              io.c8n.disconnect()
              c8n.connect(t)
              c8n = io.c8n
            }
            c8n.connect(target)
            io.first_keyword += 2
            this.setupIO(io, io.first_keyword + 2)
          } else {
            this.setupIO(io, io.i + 2)
          }
        }
        // io.last_positional = io.first_keyword - 2
        setupFirst.call(this, io)
      }
    }
  }
} ()

/**
 * Returns the required types for the current input.
 * This does not suppose that the list of input has been completely consolidated
 * @param {!Object} io parameter.
 */
edY.Consolidator.Arguments.prototype.getCheck = function() {
  var cache = {}
  return function (io) {
    var can_positional, can_keyword, can_comprehension
    if (io.unique >= 0 || io.list.length === 1 || io.list.length === 3 && io.i === 1) {
      can_positional = can_keyword = can_comprehension = true
    } else {
      can_comprehension = false
      if (io.first_keyword<0 || io.i <= io.first_keyword) {
        can_positional = true
      }
      if (io.i >= io.last_positional) {
        can_keyword = true
      }
    }
    var K = 0
    if (can_positional) {
      K += 1
    }
    if (can_keyword) {
      K += 2
    }
    if (can_comprehension) {
      K += 4
    }
    var out = cache[K]
    if (out) {
      return out
    }
    out = []
    if (can_positional) {
      out = edY.T3.Expr.Check.expression.slice()
      out.push(edY.T3.Expr.expression_star)      
    }
    if (can_keyword) {
      out.push(edY.T3.Expr.keyword_item)
      out.push(edY.T3.Expr.expression_star_star)      
    }
    if (can_comprehension) {
      out.push(edY.T3.Expr.comprehension)      
    }
    return cache[K] = out
  }
} ()

/**
 * Class for a DelegateSvg, argument_list block.
 * This block may be sealed.
 * Not normally called directly, edY.DelegateSvg.create(...) is preferred.
 * For edython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
edY.DelegateSvg.List.makeSubclass('argument_list', {
  list: {
    check: edY.T3.Expr.Check.argument_any,
    consolidator: edY.Consolidator.List,
    empty: true,
    presep: ',',
    hole_value: 'name',
  },
})

/**
 * Class for a DelegateSvg, argument_list_comprehensive block.
 * This block may be sealed.
 * Not normally called directly, edY.DelegateSvg.create(...) is preferred.
 * For edython.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @constructor
 */
edY.DelegateSvg.List.makeSubclass('argument_list_comprehensive', {
  list: {
    consolidator: edY.Consolidator.Arguments,
    empty: true,
    presep: ',',
    hole_value: 'name',
  },
})

edY.DelegateSvg.Argument.T3s = [
  edY.T3.Expr.keyword_item,
  edY.T3.Expr.starred_expression, // from Expr
  edY.T3.Expr.argument_list,
  edY.T3.Expr.argument_list_comprehensive,
]