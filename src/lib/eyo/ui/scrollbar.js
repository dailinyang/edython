/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Dom utils.
 * @author jerome.laurens@u-bourgogne.fr
 */
'use strict'

goog.provide('eYo.Scrollbar')
goog.provide('eYo.Scroller')

goog.require('eYo')

goog.forwardDeclare('eYo.Board')

goog.forwardDeclare('goog.dom')
goog.forwardDeclare('goog.events')

/**
 * Class for a pair of scrollbars.  Horizontal and vertical.
 * @param {!eYo.Board} board Board to bind the scrollbars to.
 * @constructor
 */
eYo.Scroller = function(board) {
  this.board_ = board
  this.hScroll = new eYo.Scrollbar(
    this,
    true,
    'eyo-main-board-scrollbar'
  )
  this.vScroll = new eYo.Scrollbar(
    this,
    false,
    'eyo-main-board-scrollbar'
  )
  this.cornerRect_ = new eYo.Rect()
  this.disposeUI = eYo.Do.nothing
  board.hasUI && this.makeUI()
}

Object.defineProperties(eYo.Scroller.prototype, {
  /**
   * @type{eYo.Board} The scrolled board...
   * @readonly
   */
  board: {
    get () {
      return this.board_
    }
  },
  /**
   * @type{eYo.Driver} The ui driver...
   * @readonly
   */
  ui_driver: {
    get () {
      return this.board_.ui_driver
    }
  },
  hasUI: {
    get () {
      return this.makeUI === eYo.Do.nothing
    }
  },
  /**
   * Set/get whether this scrollbar's container is visible.
   * @param {boolean} visible Whether the container is visible.
   */
  containerVisible: {
    get () {
      return this.hScroll.containerVisible || this.vScroll.containerVisible
    },
    set (newValue) {
      this.hScroll.containerVisible = newValue
      this.vScroll.containerVisible = newValue
    }
  },
  /**
   * Is the scrollbar visible.  Non-paired scrollbars disappear when they aren't
   * needed.
   * @return {boolean} True if visible.
   */
  visible: {
    get () {
      return this.hScroll.visible || this.vScroll.visible
    }
  },
})

/**
 * Previously recorded metrics from the board.
 * @type {Object}
 * @private
 */
eYo.Scroller.prototype.makeUI = function () {
  this.makeUI = eYo.Do.nothing
  this.ui_driver.scrollerInit(this)
  delete this.disposeUI
}

/**
 * Previously recorded metrics from the board.
 * @type {Object}
 * @private
 */
eYo.Scroller.prototype.disposeUI = function () {
  this.disposeUI = eYo.Do.nothing
  delete this.makeUI
  this.hScroll.disposeUI()
  this.vScroll.disposeUI()
  this.ui_driver.scrollerDispose(this)
}

/**
 * Previously recorded metrics from the board.
 * @type {Object}
 * @private
 */
eYo.Scroller.prototype.oldMetrics_ = null;

/**
 * Dispose of this pair of scrollbars.
 * Unlink from all DOM elements to prevent memory leaks.
 */
eYo.Scroller.prototype.dispose = function() {
  this.disposeUI()
  this.board_ = null
  this.oldMetrics_ = null
  this.hScroll.dispose()
  this.hScroll = null
  this.vScroll.dispose()
  this.vScroll = null
  this.cornerRect_.dispose()
  this.cornerRect_ = null
}

/**
 * Recalculate both of the scrollbars' locations and lengths.
 * Also reposition the corner rectangle.
 */
eYo.Scroller.prototype.layout = function() {
  // Look up the host metrics once, and use for both scrollbars.
  var hostMetrics = this.board_.metrics
  if (!hostMetrics) {
    // Host element is likely not visible. Not any longer
    return
  }
  // In order to layout properly, cross visibility is required
  this.hScroll.layout(hostMetrics, true)
  this.vScroll.layout(hostMetrics, true)
  this.hScroll.layout(hostMetrics, false)
  this.vScroll.layout(hostMetrics, false)
  // layout the corner
  var r = this.cornerRect_
  var rr = this.vScroll.viewRect
  r.left = rr.left
  r.right = rr.right
  rr = this.hScroll.viewRect
  r.top = rr.top
  r.bottom = rr.bottom
  // Reposition the corner square.
  this.ui_driver.scrollerPlaceCorner(this)
}

/**
 * Place the scroller.
 * @private
 */
eYo.Scroller.prototype.place = function() {
  var s
  ;(s = this.hScroll) && s.place()
  ;(s = this.vScroll) && s.place()
}

/**
 * Class for a pure SVG scrollbar.
 * This technique offers a scrollbar that is guaranteed to work, but may not
 * look or behave like the system's scrollbars.
 * @param {!eYo.Board|eYo.Scroller} bs Board to bind the scrollbar to, or scroller. Owner of the receiver.
 * @param {boolean} horizontal True if horizontal, false if vertical.
 * @param {string=} opt_class A class to be applied to this scrollbar.
 * @constructor
 */
eYo.Scrollbar = function(bs, horizontal, opt_class) {
  if (bs instanceof eYo.Scroller) {
    this.board_ = bs.board
    this.scroller_ = bs  
  } else {
    this.board_ = bs
    this.scroller_ = null  
  }
  this.disposeUI = eYo.Do.nothing
  this.horizontal_ = horizontal
  this.viewRect_ = new eYo.Rect()
  this.oldMetrics_ = null
  this.board_.hasUI && this.makeUI(opt_class)
}

Object.defineProperties(eYo.Scrollbar, {
  /**
   * Width of vertical scrollbar or height of horizontal scrollbar in CSS pixels.
   * Scrollbars should be larger on touch devices.
   */
  thickness: {
    value: goog.events.BrowserFeature.TOUCH_ENABLED ? 26 : 16
  },
})

Object.defineProperties(eYo.Scrollbar.prototype, {
  /**
   * @type{eYo.Board} The scrolled board...
   * @readonly
   */
  board: {
    get () {
      return this.board_
    }
  },
  /**
   * Is the scrollbar visible.  Should non-paired scrollbars disappear when they aren't
   * needed?
   * @return {boolean} True if visible.
   */
  visible: {
    get () {
      return this.visible_
    },
    /**
     * Set whether the scrollbar is visible.
     * Only applies to non-paired scrollbars?
     * @param {boolean} newValue True if visible.
     */
    set (newValue) {
      var visibilityChanged = (newValue != this.visible_)
      this.visible_ = newValue
      if (visibilityChanged) {
        this.updateDisplay_()
      }
    }
  },
  /**
   * Set whether the scrollbar's container is visible and update
   * display accordingly if visibility has changed.
   * @param {boolean} visible Whether the container is visible
   */
  containerVisible: {
    get () {
      return this.containerVisible_
    },
    set (newValue) {
      if (newValue != this.containerVisible_) {
        this.containerVisible_ = newValue
        this.updateDisplay_()
      }
    }
  },
})

Object.defineProperties(eYo.Scrollbar.prototype, {
/**
   * @type{eYo.Driver} The ui driver...
   * @readonly
   */
  ui_driver: {
    get () {
      return this.board_.ui_driver
    }
  },
  hasUI: {
    get () {
      return this.makeUI === eYo.Do.nothing
    }
  },
  viewRect: {
    /**
     * The view rectangle
     * @type {eYo.Rect}
     * @readonly
     */
    get () {
      return this.viewRect_.clone
    },
    /**
     * Record the origin of the board that the scrollbar is in, in pixels
     * relative to the injection div origin. This is for times when the scrollbar is
     * used in an object whose origin isn't the same as the main board
     * (e.g. in a flyout.)
     * @param {eYo.Where} newOrigin The coordinates of the scrollbar's origin, in CSS pixels.
     */
    set (newValue) {
      this.viewRect_.set(newValue)
    }
  },
  /**
   * The position of the mouse along this scrollbar's major axis at the start of
   * the most recent drag.
   * Units are CSS pixels, with (0, 0) at the top left of the browser window.
   * For a horizontal scrollbar this is the x coordinate of the mouse down event;
   * for a vertical scrollbar it's the y coordinate of the mouse down event.
   * @type {eYo.Where}
   */
  dragStart_: {
    value: 0,
    writable: true
  },
  /**
   * The length of the scrollbar handle in CSS pixels.
   * @type {number}
   * @private
   */
  handleLength__: {
    value: 0,
    writable: true
  },
  /**
   * The offset of the start of the handle from the scrollbar position,
   * in CSS pixels.
   * @type {number}
   * @private
   */
  handlePosition__: {
    value: 0,
    writable: true
  },
  /**
   * The offset of the start of the handle from the scrollbar position, in CSS
   * pixels.
   * @type {number}
   * @private
   */
  handlePosition_: {
    get () {
      return this.handlePosition__
    },
    /**
     * Set the offset of the scrollbar's handle from the scrollbar's position, and
     * change the SVG attribute accordingly.
     * @param {number} newPosition The new scrollbar handle offset in CSS pixels.
     */
    set (newValue) {
      if (newValue <= 0 || isNaN(newValue) || this.viewLength_ < this.handleLength_) {
        newValue = 0
      } else {
        newValue = Math.min(newValue, this.viewLength_ - this.handleLength_)
      }
      if (this.handlePosition__ !== newValue) {
        this.handlePosition__ = newValue
        this.ui_driver.scrollbarUpdateHandle(this)
      }
    }
  },
  handleLength_: {
    get () {
      return this.handleLength__
    },
    /**
     * Set the length of the scrollbar's handle and change the SVG attribute
     * accordingly.
     * @param {number} newLength The new scrollbar handle length in CSS pixels.
     */
    set (newValue) {
      newValue = Math.min(Math.max(0, newValue), this.viewLength_)
      if (newValue !== this.handleLength__) {
        this.handleLength__ = newValue
        if (this.handlePosition__ + newValue > this.viewLength_) {
          this.handlePosition__ = this.viewLength_ - newValue
        }
        this.ui_driver.scrollbarUpdateView(this)
      }
    }
  },
  viewLength_: {
    get () {
      var size = this.viewRect_.size
      return this.horizontal_ ? size.width : size.height
    },
    /**
     * Set the size of the scrollbar's background and change the SVG attribute
     * accordingly.
     * @param {number} newSize The new scrollbar background length in CSS pixels.
     * @private
     */
    set (newValue) {
      newValue = Math.max(0, newValue)
      var old = this.viewLength_
      if (newValue !== old) {
        var ratio = old ? newValue / old : 1
        var size = this.viewRect_.size_
        this.horizontal_
        ? (size.width = newValue)
        : (size.height = newValue)
        this.handlePosition__ *= ratio
        this.handleLength__ *= ratio
        this.ui_driver.scrollbarUpdateView(this)
      }
    }
  },
  /**
   * Whether the scrollbar handle is visible.
   * @type {boolean}
   * @private
   */
  visible_: {
    value: true,
    writable: true
  },
  /**
   * Whether the board containing this scrollbar is visible.
   * @type {boolean}
   * @private
   */
  containerVisible_: {
    value: true,
    writable: true
  },
})

/**
 * Create all the DOM elements required for a scrollbar.
 * The resulting widget is not sized.
 * @param {string=} opt_class A class to be applied to this scrollbar.
 * @private
 */
eYo.Scrollbar.prototype.makeUI = function(opt_class) {
  if (this.board_.hasUI) {
    this.makeUI = eYo.Do.nothing
    delete this.disposeUI
    return this.ui_driver.scrollbarInit(this, opt_class)
  }
}

/**
 * Dispose of the UI resources
 */
eYo.Scrollbar.prototype.disposeUI = function() {
  this.disposeUI = eYo.Do.nothing
  delete this.makeUI
  return this.ui_driver.scrollbarDispose(this)
}

/**
 * Dispose of this scrollbar and sever the links.
 */
eYo.Scrollbar.prototype.dispose = function() {
  this.disposeUI()
  this.board_ = null
  this.scroller_ = null
}

/**
 * Recalculate the scrollbar's location and its length.
 * When `prepare` is true, updates the visibility status, when `false` it does not.
 * @param {?eYo.Metrics} opt_metrics A data structure describing all the
 * required dimensions.  If not provided, it will be fetched from the board.
 * @param{?Boolean} prepare  True when prepare only.
 */
eYo.Scrollbar.prototype.layout = function(hostMetrics, prepare) {
  if (this.horizontal_) {
    this.layoutHorizontal(hostMetrics, prepare)
  } else {
    this.layoutVertical(hostMetrics, prepare)
  }
  this.place()
}

/**
 * Recalculate a horizontal scrollbar's location on the screen and path length.
 * This should be called when the layout or size of the window has changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 * @param {?Boolean} prepare  True when only preparing.
 */
eYo.Scrollbar.prototype.layoutHorizontal = function(hostMetrics, prepare) {
  hostMetrics || (hostMetrics = this.board.metrics)
  var view = hostMetrics.view
  var content = hostMetrics.port
  var range = content.width - view.width
  if (prepare !== false) {
    this.visible = (view.width > this.scroller_
    ? 2 * eYo.Scrollbar.thickness
    : eYo.Scrollbar.thickness) && (this.scroller_ || range > 0)
    if (prepare) {
      return
    }
  }
  var oldMetrics = this.oldMetrics_
  if (!oldMetrics
    || oldMetrics.scroll.x != hostMetrics.scroll.x
    || oldMetrics.view.width != view.width
    || oldMetrics.port.width != content.width) {
    // The window has been resized or repositioned.
    this.oldMetrics_ = hostMetrics
    var r = this.viewRect_
    r.left = view.left
    r.right = this.scroller_ && this.scroller_.vScroll.visible ? view.right - eYo.Scrollbar.thickness : view.right
    r.top = (r.bottom = view.bottom) - eYo.Scrollbar.thickness
    r.xyInset(0.5)
    // layout the content
    this.handleLength_ = view.width / content.width * r.width
    if (this.handleLength_ === -Infinity || this.handleLength_ === Infinity ||
        isNaN(this.handleLength_)) {
      this.handleLength_ = 0
    }
    // view.x_max - content.x_max <= scroll.x <= view.x_min - content.x_min
    if (range > 0) {
      this.handlePosition_ = (scroll.x - view.x_max + content.x_max) / range * (r.width - this.handleLength_)
    } else {
      this.handlePosition_ = r.width / 2
    }
  }
}

/**
 * Recalculate a vertical scrollbar's location on the screen and path length.
 * This should be called when the layout or size of the window has changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 * @param {?Boolean} prepare  True when preparing.
 */
eYo.Scrollbar.prototype.layoutVertical = function(hostMetrics, prepare) {
  hostMetrics || (hostMetrics = this.board.metrics)
  var view = hostMetrics.view
  var content = hostMetrics.port
  var range = content.height - view.height
  if (prepare !== false) {
    this.visible = (view.height > (this.scroller_
    ? 2 * eYo.Scrollbar.thickness
    : eYo.Scrollbar.thickness)) && (!!this.scroller_ || range > 0)
    if (prepare) {
      return
    }
  }
  var oldMetrics = this.oldMetrics_
  if (!oldMetrics
    || oldMetrics.scroll.y != hostMetrics.scroll.y
    || oldMetrics.view.height != view.height
    || oldMetrics.port.height != content.height) {
    // The window has been resized or repositioned.
    this.oldMetrics_ = hostMetrics
    var r = this.viewRect_
    r.top = view.top
    r.bottom = this.scroller_ && this.scroller_.hScroll.visible
    ? view.bottom - eYo.Scrollbar.thickness
    : view.bottom
    r.left = (r.right = view.right) - eYo.Scrollbar.thickness
    r.xyInset(0.5)
    // layout the content
    this.handleLength_ = view.height / content.height * r.height
    if (this.handleLength_ === -Infinity || this.handleLength_ === Infinity ||
        isNaN(this.handleLength_)) {
      this.handleLength_ = 0
    }
    // view.y_max - content.y_max <= scroll.y <= view.y_min - content.y_min
    if (range > 0) {
      this.handlePosition_ = (scroll.y - view.y_max + content.y_max) / range * (r.height - this.handleLength_)
    } else {
      this.handlePosition_ = r.height / 2
    }
  }
}

/**
 * Update visibility of scrollbar based on whether it thinks it should
 * be visible and whether its containing board is visible.
 * We cannot rely on the containing board being hidden to hide us
 * because it is not necessarily our parent in the DOM.
 */
eYo.Scrollbar.prototype.updateDisplay_ = function() {
  var show = true
  // Check whether our parent/container is visible.
  show = this.containerVisible_ && this.visible_
  this.ui_driver.scrollbarUpdateDisplay(this, show)
}

/**
 * Forwards to the driver.
 * @private
 */
eYo.Scrollbar.prototype.cleanUp_ = function() {
  this.ui_driver.scrollbarCleanUp(this)
}

/**
 * Stop binding to mouseup and mousemove events.  Call this to
 * wrap up lose ends associated with the scrollbar.
 * @private
 */
eYo.Scrollbar.prototype.place = function() {
  this.ui_driver.scrollbarPlace(this)
}

