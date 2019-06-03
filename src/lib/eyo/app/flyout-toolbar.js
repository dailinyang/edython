/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Flyout toolbar extension, in progress.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.FlyoutToolbar')

goog.require('eYo')
goog.forwardDeclare('eYo.FlyoutToolbar')

goog.require('eYo.MenuRenderer')
goog.require('eYo.MenuButtonRenderer')
goog.require('goog.dom')
goog.require('goog.math.Coordinate')
goog.require('goog.ui.Select')

/**
 * Class for a flyout toolbar.
 * @constructor
 */
eYo.FlyoutToolbar = function(flyout, switcher) {
  this.flyout_ = flyout
  this.switcher_ = switcher || eYo.App.flyoutToolbarSwitcher
  if (this.switcher_) {
    goog.dom.removeNode(this.switcher_)
  }
}

/**
 * Dispose of this flyout toolbar.
 * Unlink from all DOM elements to prevent memory leaks.
 */
eYo.FlyoutToolbar.prototype.dispose = function() {
  if (this.onButtonDownWrapper_) {
    eYo.Dom.unbindEvent(this.onButtonDownWrapper_)
    this.onButtonDownWrapper_ = eYo.VOID
  }
  if (this.onButtonEnterWrapper_) {
    eYo.Dom.unbindEvent(this.onButtonEnterWrapper_);
    this.onButtonEnterWrapper_ = eYo.VOID
  }
  if (this.onButtonLeaveWrapper_) {
    eYo.Dom.unbindEvent(this.onButtonLeaveWrapper_);
    this.onButtonLeaveWrapper_ = eYo.VOID
  }
  if (this.onButtonUpWrapper_) {
    eYo.Dom.unbindEvent(this.onButtonUpWrapper_);
    this.onButtonUpWrapper_ = eYo.VOID
  }
  if (this.selectControl_) {
    this.selectControl_.unlisten(this.listenableKey)
    this.selectControl_ = eYo.VOID
  }
}

/**
 * Creates the flyout toolbar's DOM.
 * @param {Object} dom helper.
 * @return {!Element} The flyout toolbar's div.
 */
eYo.FlyoutToolbar.prototype.doSelectGeneral = function (e) {
  var board = this.flyout_.targetBoard_
  if (board && this.selectControl_) {
    var category = this.selectControl_.getValue()
    var list = eYo.FlyoutCategory[category]
    if (list.length) {
      this.flyout_.show(list)
    }
  }
}

// toolbar height
eYo.FlyoutToolbar.prototype.MARGIN = eYo.Padding.t
eYo.FlyoutToolbar.prototype.HEIGHT = 2 * (eYo.Font.lineHeight + 2 * eYo.FlyoutToolbar.prototype.MARGIN)

eYo.FlyoutToolbar.prototype.BUTTON_RADIUS = eYo.FlyoutToolbar.prototype.HEIGHT / 4
// left margin
eYo.FlyoutToolbar.prototype.BUTTON_MARGIN = eYo.FlyoutToolbar.prototype.BUTTON_RADIUS / 8

/**
 * Slide out.
 * @param {!Event} e Mouse up event.
 * @private
 */
eYo.FlyoutToolbar.prototype.onButtonDown_ = function(e) {
  this.isDown = true
  window.addEventListener('mouseup', this.notOnButtonUp_)
  this.onButtonEnter_(e)
  eYo.Dom.gobbleEvent(e)
}

/**
 * That is catched when the flyout has the focus.
 * @param {!Event} e Mouse up event.
 * @private
 */
eYo.FlyoutToolbar.prototype.onButtonEnter_ = function(e) {
  if (this.isDown) {
    goog.dom.classlist.add(this.control_, 'eyo-flash')
  }
};

/**
 * Unhilight.
 * @param {!Event} e Mouse up event.
 * @private
 */
eYo.FlyoutToolbar.prototype.onButtonLeave_ = function(e) {
  goog.dom.classlist.remove(this.control_, 'eyo-flash')
};

/**
 * Slide out.
 * @param {!Event} e Mouse up event.
 * @private
 */
eYo.FlyoutToolbar.prototype.onButtonUp_ = function(e) {
  window.removeEventListener('mouseup', this.notOnButtonUp_)
  if (this.isDown) {
    this.isDown = false
    var el = document.querySelector('#eyo-flyout-dropdown .dropdown.show')
    if (el) {
      goog.dom.classlist.remove('show')
    }
    this.flyout_.slide()
    this.onButtonLeave_(e)
    var gesture = this.flyout_.targetBoard_.getGesture(e)
    if (gesture) {
      gesture.cancel()// comes from flyout button
    }
    eYo.Dom.gobbleEvent(e)
  }
};
// Sometimes this error has poped up.
// console.error(`Uncaught TypeError: this.onButtonLeave_ is not a function
// at eYo.FlyoutToolbar.notOnButtonUp_`)

/**
 * Mouse up catcher.
 * @param {!Event} e Mouse up event.
 * @private
 */
eYo.FlyoutToolbar.prototype.notOnButtonUp_ = function(e) {
  window.removeEventListener('mouseup', this.notOnButtonUp_)
  this.onButtonLeave_(e)
  var gesture = this.targetBoard_.getGesture(e)
  if (gesture) {
    gesture.cancel()// comes from flyout button
  }
  eYo.Dom.gobbleEvent(e)
}

/**
 * Resize.
 * @param {!Float} width.
 * @param {!Float} height.
 * @private
 */
eYo.FlyoutToolbar.prototype.resize = function(width, height) {
  var height = this.HEIGHT
  var margin = this.MARGIN
  var big_radius = 1.25 * eYo.Unit.rem
  var radius = 1.125 * eYo.Unit.rem
  var h = radius * 0.75

  this.div_.style.width = width + 'px'
  // this.div_.style.height = height + 'px'

  var path = this.pathControl_
  if (this.flyout_.closed) {
    path.setAttribute('d',
      `M${margin + h + this.flyout_.CORNER_RADIUS},${radius} l${-h},${-radius/2} l 0,${radius} z`
    )
  } else {
    path.setAttribute('d',
      `M ${this.flyout_.CORNER_RADIUS},${radius} l${h},${-radius/2} l 0,${radius} z`
    )
  }
};

/**
 * Update the view based on coordinates calculated in position().
 * @param {number} width The computed width of the flyout's SVG group
 * @param {number} height The computed height of the flyout's SVG group.
 * @param {number} x The computed x origin of the flyout's SVG group.
 * @param {number} y The computed y origin of the flyout's SVG group.
 * @private
 */
eYo.FlyoutToolbar.prototype.positionAt_ = function(width, height, x, y) {
  this.flyout_.targetBoard_.ui_driver.flyoutToolbarPositionAt(width, height, x, y)
  this.div_.style.left = x + 'px'
  this.div_.style.top = y + 'px'
};
