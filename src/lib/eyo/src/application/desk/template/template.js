/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Template.
 * 
 * @author jerome.laurens@u-bourgogne.fr
 */
'use strict'

goog.provide('eYo.Template')

goog.require('eYo.Pane')
goog.require('eYo.Decorate')

/**
 * Class for a template environment.
 * @param {!eYo.Desk} owner Owner desk.
 * @constructor
 */
eYo.Template = function(owner) {
  eYo.Template.superClass_.constructor.call(this, owner)
}
goog.inherits(eYo.Template, eYo.Pane)

/**
 * Make the user interface.
 */
eYo.Template.prototype.makeUI = eYo.Decorate.makeUI(
  eYo.Template,
  function() {
    this.driver.templateInit(this)
  }
)

/**
 * Dispose of UI resources.
 */
eYo.Template.prototype.disposeUI = eYo.Decorate.disposeUI(
  eYo.Template,
  function() {
    this.driver.templateDispose(this)
  }
)

/**
 * Update the metrics of the receiver.
 */
eYo.Template.prototype.updateMetrics = function () {
  this.ui_driver.templateUpdateMetrics()
}

/**
 * Place the receiver.
 */
eYo.Template.prototype.place = function () {
  this.ui_driver.templatePlace()
}
