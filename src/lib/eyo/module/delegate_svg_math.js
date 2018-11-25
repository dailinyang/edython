/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview Math module blocks for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.DelegateSvg.Math')

goog.require('eYo.Msg')
goog.require('eYo.DelegateSvg.Stmt')

goog.require('eYo.DelegateSvg.List')
goog.require('eYo.DelegateSvg.Primary')

goog.require('eYo.Tooltip')
goog.require('eYo.FlyoutCategory')

goog.require('eYo.Model.math__module')

/**
 * Populate the context menu for the given block.
 * @param {!Blockly.Block} block The block.
 * @param {!eYo.MenuManager} mgr mgr.menu is the menu to populate.
 * @private
 */
// eYo.DelegateSvg.Expr.math__call_expr.populateMenu = function (mgr) {
//   var block = this.block_
//   var eyo = block.eyo
//   // populate the menu with the functions in the same category
//   var name_get = eyo.data.name.get()
//   var model = eYo.Model.math__module
//   var item_get = model.getItem(name_get)
//   var items = model.getItemsInCategory(item_get.category)
//   var module = eyo.data.fromFlag.get() ? '' : 'math.'
//   var F = function (i) {
//     var item = model.getItem(items[i])
//     var type = model.data.types[item.type]
//     var args = type === 'data' ? '' : '(...)'
//     if (item !== item_get) {
//       var content =
//       goog.dom.createDom(goog.dom.TagName.SPAN, 'eyo-code',
//         module,
//         item.names[0],
//         args
//       )
//       var menuItem = mgr.newMenuItem(content, function () {
//         eyo.data.name.set(item.names[0])
//       })
//       mgr.addChild(menuItem, true)
//     }
//   }
//   for (var i = 0; i < items.length; i++) {
//     F(i)
//   }
//   mgr.shouldSeparate()
//   var contents = {
//     'number-theoretic-and-representation-functions' : 'floor, ceil, gcd,...',
//     'power-and-logarithmic-functions' : 'sqrt, exp, log,...',
//     'trigonometric-functions' : 'sin, cos, atan2,...',
//     'angular-conversion' : 'degrees, radians',
//     'hyperbolic-functions' : 'sinh, cosh,...',
//     'special-functions' : 'erf, gamma, lgamma',
//     'constants' : 'pi, e, tau, inf, nan'
//   }
//   F = function (i) {
//     var category = categories[i]
//     if (i !== item_get.category) {
//       var menuItem = mgr.newMenuItem(contents[category] || category, function () {
//         var items = eYo.Model.math__module.getItemsInCategory(i)
//         var item = eYo.Model.math__module.getItem(items[0])
//         eyo.data.name.set(item.names[0])
//       })
//       mgr.addChild(menuItem, true)
//     }
//   }
//   var categories = model.data.categories
//   for (var i = 0; i < categories.length - 1; i++) {
//     F(i)
//   }
//   mgr.shouldSeparate()
// }

/**
 * Class for a DelegateSvg, math constant block.
 * As call is already a reserved message in javascript,
 * we use call_expr instead.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
// eYo.DelegateSvg.Expr.math__call_expr.makeSubclass('math__const', {
//   data: {
//     callerFlag: {
//       init: true, // true when `foo` is expected instead of `foo(…)`
//       xml: false,
//       synchronize: false
//     },
//     ary: null,
//     isOptionalUnary: null,
//     mandatory: null,
//     name: {
//       all: ['pi', 'e', 'tau', 'inf', 'nan'],
//       init: 'pi',
//       synchronize: true,
//       validate: true,
//       didChange: false, // do not heritate
//     }
//   },
//   slots: {
//     n_ary: null,
//     z_ary: null,
//     unary: null,
//     binary: null,
//     ternary: null,
//     quadary: null,
//     pentary: null,
//   },
//   output: {
//     check: [eYo.T3.Expr.math__const, eYo.T3.Expr.builtin__object]
//   }
// })

var F = function (name, title) {
  var key = 'math__'+name
  title && (eYo.Tooltip.Title[key] = title)
  return {
    type: eYo.T3.Expr.call_expr,
    data: {
      name: name,
      holder: 'math',
      dotted: 0
    },
    title: key
  }
}
var F_k = function (name, title) {
  var key = 'math__'+name
  title && (eYo.Tooltip.Title[key] = title)
  return {
    type: eYo.T3.Expr.attributeref,
    data: {
      name: name,
      holder: 'math',
      dotted: 0
    },
    title: key
  }
}
eYo.FlyoutCategory.basic_math__module = [
  {
    type: eYo.T3.Stmt.import_stmt,
    data: {
      variant: eYo.Key.FROM_MODULE_IMPORT_STAR,
      from: 'math'
    }
  },
  F('sqrt', 'Racine carrée (square root)'),
  F('pow', 'Fonction puissance (power), préférer l\'opérateur ** pour les entiers'),
  F_k('pi', 'π (approximation)'),
  F('cos', 'Fonction cosinus'),
  F('sin', 'Fonction sinus'),
  F('tan', 'Fonction tangente'),
  F('hypoth', 'Fonction hypothénuse (module), distance euclidienne à l\'origine'),
  F('atan2', 'Fonction angle polaire (argument)'),
  F('degrees', 'Pour convertir en degrés'),
  F('radians', 'Pour convertif en radians'),
  F_k('e', 'e (approximation de la constante d\'Euler)'),
  F('exp', 'Fonction exponentielle'),
  F('log', 'Fonction logarithme népérien, donner un deuxième argument pour changer de base'),
  F('log10', 'Fonction logarithme de base 10'),
  F('gcd', 'Plus grand diviseur commun (pgcd)'),
  F('floor', 'Partie entière par défaut'),
  F('ceil', 'Partie entière par excès'),
  F('trunc', 'Partie tronquée (parmi les deux parties entières, celles qui est le plus proche de 0) '),
  F('factorial', 'Factorielle (n!)'),
  F('acos', 'Fonction arc cosinus'),
  F('asin', 'Fonction arc sinus'),
  F('atan', 'Fonction arc tangente'),
  // F('phi', 'Fonction de répartition de la loi normale centrée réduite'),
  // F('fmod', 'modulo avec des nombres, préférer % pour des arguments entiers'),
  // F('fsum', 'Somme pour des nombres entiers ou non, tient compte de problèmes d\'arrondi'),
  // F('copysign', 'Copie le signe d\'un nombre sur l\'autre'),
  // F('fabs', 'Valeur absolue ou module'),
  // F('modf', 'Parties entière et fractionnaire'),
  // F('frexp', 'Représentation interne m * 2 ** e'),
  // F('ldexp', 'Renvoie  m * 2 ** e, fonction inverse de frexp'),
  // F('isclose', 'Teste si deux valeurs sont proches'),
  // F('isfinite', 'Teste si l\'argument est un nombre fini'),
  // F('isinf', 'Teste si l\'argument est infini (au sens informatique)'),
  // F('isnan', 'Teste si l\'argument n\'est pas un nombre (Not A Number)'),
  // F('cosh', 'Fonction cosinus hyperbolique (ch)'),
  // F('sinh', 'Fonction sinus hyperbolique (sh)'),
  // F('tanh', 'Fonction tangente hyperbolique (th)'),
  // F('acosh', 'Fonction arc cosinus hyperbolique (argch)'),
  // F('asinh', 'Fonction arc sinus hyperbolique (argsh)'),
  // F('atanh', 'Fonction arc tangente hyperbolique (argth)'),
  // F('expm1', 'Fonction exp(x) - 1, avec une meilleure précision près de 0'),
  // F('log1p', 'log(1 + x), avec une meilleure précision près de 0'),
  // F('log10', 'Fonction logarithme de base 10 avec une meilleure précision que (log(x, 10)'),
  // F('log2', 'Fonction logarithme de base 2 avec une meilleure précision que (log(x, 2)'),
  // F('erf', 'Fonction erreur de Gauss'),
  // F('erfc', 'Complément à 1 de la fonction erf'),
  // F('gamma', 'Fonction Gamma d\'Euler'),
  // F('lgamma', 'Logarithme népérien de la fonction Gamma')
]

var F = function (name, title) {
  var key = 'math__'+name
  title && (eYo.Tooltip.Title[key] = title)
  return {
    type: eYo.T3.Expr.call_expr,
    data: {
      name: name,
      holder: 'math',
      dotted: 1
    },
    title: key
  }
}
var F_k = function (name, title) {
  var key = 'math__'+name
  title && (eYo.Tooltip.Title[key] = title)
  return {
    type: eYo.T3.Expr.attributeref,
    data: {
      name: name,
      holder: 'math',
      dotted: 1
    },
    title: key
  }
}
eYo.FlyoutCategory.math__module = [
  {
    type: eYo.T3.Stmt.import_stmt,
    data: {
      variant: eYo.Key.IMPORT
    },
    slots: {
      import_module: {
        slots: {
          O: {
            type: eYo.T3.Expr.identifier,
            data: 'math',
          },
        },
      }
    }
  },
  F('sqrt', 'Racine carrée (square root)'),
  F('pow', 'Fonction puissance (power), préférer l\'opérateur ** pour les entiers'),
  F_k('pi', 'π (≅)'),
  F_k('tau', 'τ (≅ 2π)'),
  F('cos', 'Fonction cosinus'),
  F('sin', 'Fonction sinus'),
  F('tan', 'Fonction tangente'),
  F('hypoth', 'Fonction hypothénuse (module), distance euclidienne à l\'origine'),
  F('atan2', 'Fonction angle polaire (argument)'),
  F('degrees', 'Pour convertir en degrés'),
  F('radians', 'Pour convertif en radians'),
  F_k('e', 'e (≅)'),
  F('exp', 'Fonction exponentielle'),
  F('log', 'Fonction logarithme népérien, donner un deuxième argument pour changer de base'),
  F('phi', 'Fonction de répartition de la loi normale centrée réduite'),
  F('gcd', 'Plus grand diviseur commun (pgcd)'),
  F('factorial', 'Factorielle (n!)'),
  F('floor', 'Partie entière par défaut'),
  F('ceil', 'Partie entière par excès'),
  F('trunc', 'Partie tronquée (parmi les deux parties entières, celles qui est le plus proche de 0) '),
  F('fmod', 'modulo avec des nombres, préférer % pour des arguments entiers'),
  F('fsum', 'Somme pour des nombres entiers ou non, tient compte de problèmes d\'arrondi'),
  F('copysign', 'Copie le signe d\'un nombre sur l\'autre'),
  F('fabs', 'Valeur absolue ou module'),
  F('modf', 'Parties entière et fractionnaire'),
  F('frexp', 'Représentation interne m * 2 ** e'),
  F('ldexp', 'Renvoie  m * 2 ** e, fonction inverse de frexp'),
  F('isclose', 'Teste si deux valeurs sont proches'),
  F('isfinite', 'Teste si l\'argument est un nombre fini'),
  F('isinf', 'Teste si l\'argument est infini (au sens informatique)'),
  F_k('inf', '∞'),
  F('isnan', 'Teste si l\'argument n\'est as un nombre (Not A Number)'),
  F_k('nan', 'nan (not a number)'),
  F('acos', 'Fonction arc cosinus'),
  F('asin', 'Fonction arc sinus'),
  F('atan', 'Fonction arc tangente'),
  F('cosh', 'Fonction cosinus hyperbolique (ch)'),
  F('sinh', 'Fonction sinus hyperbolique (sh)'),
  F('tanh', 'Fonction tangente hyperbolique (th)'),
  F('acosh', 'Fonction arc cosinus hyperbolique (argch)'),
  F('asinh', 'Fonction arc sinus hyperbolique (argsh)'),
  F('atanh', 'Fonction arc tangente hyperbolique (argth)'),
  F('expm1', 'Fonction exp(x) - 1, avec une meilleure précision près de 0'),
  F('log1p', 'log(1 + x), avec une meilleure précision près de 0'),
  F('log10', 'Fonction logarithme de base 10 avec une meilleure précision que log(x, 10)'),
  F('log2', 'Fonction logarithme de base 2 avec une meilleure précision que log(x, 2)'),
  F('erf', 'Fonction erreur de Gauss'),
  F('erfc', 'Complément à 1 de la fonction erf'),
  F('gamma', 'Fonction Gamma d\'Euler'),
  F('lgamma', 'Logarithme népérien de la fonction Gamma')
]

goog.mixin(eYo.Tooltip.Title, {
  math__import_stmt: 'Importer le module math',
})

eYo.DelegateSvg.Math.T3s = [
  eYo.T3.Stmt.math__import_stmt,
  eYo.T3.Expr.math__call_expr,
  eYo.T3.Stmt.math__call_stmt,
  eYo.T3.Expr.math__const
]