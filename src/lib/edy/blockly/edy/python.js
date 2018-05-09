/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License CeCILL-B
 */
/**
 * @fileoverview General python support.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('edY.Python')

goog.require('edY')

/*
 * List of all the python keywords as given by
 * import keyword; print(keyword.kwlist)
 * as of Python 3.5.
 * @const{!array} of arrays of keyworks gathered by length
 * @author{Jérôme LAURENS}
 *
 */
edY.Python.KWs = [[], [],
  ['as', 'if', 'in', 'is', 'or'],
  ['and', 'def', 'del', 'for', 'not', 'try'],
  ['None', 'True', 'elif', 'else', 'from', 'pass', 'with'],
  ['False', 'break', 'class', 'raise', 'while', 'yield'],
  ['assert', 'except', 'global', 'import', 'lambda', 'return'],
  ['finally'],
  ['continue', 'finally', 'nonlocal']]

/**
 * Whereas a string is a python keyword.
 * @param {string} type The type of the connection.
 */
edY.Python.isKeyword = function (s) {
  var KWs = edY.Python.KWs[s.length]
  return KWs && KWs.indexOf(s) >= 0
}

goog.require('edY.Delegate')

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @constructor
 */
edY.Delegate.prototype.toPython = function (block) {
  goog.asserts.assert(false, 'Missing toPython implementation for '+block.type)
}

goog.require('edY.DelegateSvg')

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @return some python code
 */
edY.DelegateSvg.prototype.toPythonExpression = function (block) {
  var components = []
  this.toPythonExpressionComponents(block, components)
  return components.join('')
}

/**
 * Convert the block to python code components.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @param {!array} components the array of python code strings, will be joined to make the code.
 * @return the last element of components
 */
edY.DelegateSvg.prototype.toPythonExpressionComponents = function (block, components) {
  var last = components[components.length-1]
  var c8n, target
  var FFF = function(x, is_operator) {
    if (x.length) {
      if (is_operator) {
        x = ' ' + x + ' '
      } else {
        if (last && last.length) {
          var mustSeparate = last[last.length-1].match(/[,;:]/)
          var maySeparate = mustSeparate || edY.XRE.id_continue.test(last[last.length-1])
        }
        if (mustSeparate || (maySeparate && edY.XRE.id_continue.test(x[0]))) {
          components.push(' ')
        }
      }
      components.push(x)
      last = x
    }
    return true
  }
  var FF = function(field, is_operator) {
    return field && FFF(field.getText(), is_operator)
  }
  var doOneModel = function(D) {
    if (!D) {
      return
    }
    FF(D.fields.prefix)
    FF(D.fields.label)
    FF(D.fields.start)
    FF(D.fields.identifier) || FF(D.fields.input) || FF(D.fields.comment) || FF(D.fields.number) || FF(D.fields.string) || FF(D.fields.longString) || FF(D.fields.operator, true)
    if ((c8n = D.input.connection)) {
      if ((target = c8n.targetBlock())) {
        FFF(target.edy.toPythonExpression(target))
      } else if (!c8n.edy.optional_) {
        last = '<MISSING '+D.input.name+'>'
        components.push(last)
      }
    }
    FF(D.fields.end)
  }
  doOneModel(this.ui.i_1)
  doOneModel(this.ui.i_2)
  doOneModel(this.ui.i_3)
  return last
}

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python, a statement block.
 * @param {!string}indent, the indentation level for the .
 * @return some python code
 */
edY.DelegateSvg.prototype.toPythonStatement = function (block, indent, is_deep) {
  var components = []
  this.toPythonStatementComponents(block, components, indent, is_deep)
  return components.join('\n')
}

/**
 * Convert the block to python code components.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @param {!array} components the array of python code strings, will be joined to make the code.
 * @return None
 */
edY.DelegateSvg.prototype.toPythonStatementComponents = function (block, components, indent, is_deep) {
  var Cs = []
  if (block.disabled && indent.indexOf('#') < 0) {
    indent += '# '
  }
  components.push(indent+this.toPythonExpression(block))
  if (this.ui.suite) {
    var input = this.ui.suite.input
    if (input) {
      var c8n = input.connection
      if (c8n) {
        var target = c8n.targetBlock()
        if (target && !target.edy.toPythonStatementComponents(target, components, indent+'    ', true) || !target && !c8n.edy.optional_) {
          components.push(indent+'    <MISSING '+input.name+'>')
        }
      }
    }
  }
  if (is_deep && block.nextConnection) {
    var target = block.nextConnection.targetBlock()
    if (target) {
      var out = target.edy.toPythonStatementComponents(target, components, indent, true)
    }
  }
  return out
}

goog.require('edY.DelegateSvg.Expr')

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @return some python code
 */
edY.DelegateSvg.Expr.prototype.toPython = function (block, is_deep) {
  return this.toPythonExpression(block)
}

goog.require('edY.DelegateSvg.List')

/**
 * Convert the block to python code components.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @param {!array} components the array of python code strings, will be joined to make the code.
 * @return the last element of components
 */
edY.DelegateSvg.List.prototype.toPythonExpressionComponents = function (block, components) {
  this.consolidate(block)
  var last = components[components.length-1]
  var e8r = block.edy.inputEnumerator(block)
  while (e8r.next()) {
    var c8n = e8r.here.connection
    if (c8n) {
      var target = c8n.targetBlock()
      if (target) {
        last = target.edy.toPythonExpressionComponents(target, components)
        // NEWLINE
      } else if (!c8n.edy.optional_ && !c8n.edy.s7r_) {
        last = '<MISSING ELEMENT>'
        components.push(last)
        // NEWLINE
      } else {
        for (var j = 0, field; (field = e8r.here.fieldRow[j++]);) {
          var x = field.getText()
          if (x.length) {
            if (last && last.length) {
              var mustSeparate = last[last.length-1].match(/[,;:]/)
              var maySeparate = mustSeparate || edY.XRE.id_continue.test(last[last.length-1])
            }
            if (mustSeparate || (maySeparate && edY.XRE.id_continue.test(x[0]))) {
              components.push(' ')
            }
            components.push(x)
            last = x              
          }
        }
      }
    }
  }
  return last
}

goog.require('edY.DelegateSvg.Stmt')

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @return some python code
 */
edY.DelegateSvg.Stmt.prototype.toPython = function (block, is_deep) {
  return this.toPythonStatement(block, '', is_deep)
}

goog.require('edY.DelegateSvg.Control')

/**
 * Convert the block to python code.
 * For edython.
 * @param {!Blockly.Block} block The owner of the receiver, to be converted to python.
 * @constructor
 */
edY.DelegateSvg.Control.prototype.toPython = function (block, is_deep) {
  return this.toPythonStatement(block, '', is_deep)
}