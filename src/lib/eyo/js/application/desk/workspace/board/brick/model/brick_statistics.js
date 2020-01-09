/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Statistics module bricks for edython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

eYo.require('brick')

eYo.require('msg')

eYo.require('stmt')
eYo.require('expr.list')

eYo.require('expr.primary')
eYo.require('tooltip')

eYo.require('library')
eYo.provide('brick.statistics')

/*
    'pstdev': 7,
    'stdev': 9,
    'median_high': 4,
    'pvariance': 8,
    'variance': 10,
    'median_low': 3,
    'median': 2,
    'median_grouped': 5,
    'StatisticsError': 11,
    'mode': 6,
    'mean': 0,
    'harmonic_mean': 1
 */

;(function () {

  var F = (name, title) => {
    var key = 'statistics__'+name
    title && (eYo.tooltip.Title[key] = title)
    return {
      type: eYo.t3.Expr.Call_expr,
      data: {
        name: name,
        holder: 'statistics',
        dotted: 0
      },
      title: key
    }
  }

eYo.Library.DATA.Basic_statistics__module = [
  {
    type: eYo.t3.Stmt.import_stmt,
    from_p: 'statistics',
    variant_p: eYo.key.FROM_MODULE_IMPORT_STAR,
    title: 'statistics__import_stmt'
  },
  F('mode', 'Mode de l\'argument, une séquence ou un itérateur, en tant que valeur représentative.'),
  F('mean', 'Moyenne arithmétique de l\'argument, une séquence ou un itérateur.'),
  F('harmonic_mean', 'Moyenne harmonique de l\'argument, une séquence ou un itérateur.'),
  F('median', 'Valeur médiane de l\'argument, une séquence ou un itérateur.'),
  F('median_high', 'Valeur médiane (sans moyenne et par excès) de l\'argument, une séquence ou un itérateur.'),
  F('median_low', 'Valeur médiane (sans moyenne et par défaut) de l\'argument, une séquence ou un itérateur.'),
  F('median_grouped', 'Valeur médiane de l\'argument, une séquence ou un itérateur avec répétitions possibles.'),
  F('pstdev', 'Écart type d\'une population'),
  F('pvariance', 'Variance d\'une population'),
  F('stdev', 'Écart type d\'un échantillon d\'une population'),
  F('variance', 'Variance d\'un échantillon d\'une population'),
  F('StatisticsError', 'Exception spécifique au module `statistics`')
]

  var F = (name, title) => {
    var key = 'statistics__'+name
    title && (eYo.tooltip.Title[key] = title)
    return {
      type: eYo.t3.Expr.Call_expr,
      data: {
        name: name,
        holder: 'statistics',
        dotted: 1
      },
      title: key
    }
  }

eYo.Library.DATA.Statistics__module = [
  {
    type: eYo.t3.Stmt.import_stmt,
    variant_p: eYo.key.IMPORT,
    import_module_s: {
      slots: {
        O: {
          type: eYo.t3.Expr.identifier,
          data: 'statistics'
        }
      }
    }
  },
  F('mode'),
  F('mean'),
  F('harmonic_mean'),
  F('median'),
  F('median_high'),
  F('median_low'),
  F('median_grouped'),
  F('pstdev'),
  F('pvariance'),
  F('stdev'),
  F('variance'),
  F('StatisticsError')
]

})()

goog.mixin(eYo.tooltip.Title, {
  statistics__import_stmt: 'Importer le module statistics',
})

eYo.Brick.Statistics.T3s = [
  eYo.t3.Statistics
]
