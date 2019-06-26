/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Board metrics model.
 * @author jerome.laurens@u-bourgogne.fr
 */
'use strict'

goog.provide('eYo.Metrics')

goog.forwardDeclare(eYo.Board)
goog.forwardDeclare(eYo.Geometry)

/**
 * The `content` rect is enclosing all the bricks.
 * Its coordinates define the board coordinates.
 * The `view` rectangle corresponds to the view port.
 * Its coordinates correspond to screen coordinates or at least
 * the enclosing graphical element's coordinates.
 * @param {?eYo.Board} board the owner board.
 * @constructor
 */
eYo.Metrics = function (board) {
  this.board_ = board
  this.port_ = new eYo.Rect()
  this.view_ = new eYo.Rect()
  this.box_ = new eYo.Rect()
  this.scroll_ = this.scrollDefault.clone
  this.scale_ = 1
  this.updateDepth_ = 0
}

Object.defineProperties(eYo.Metrics.prototype, {
  board: {
    get () {
      return this.board_
    }
  },
  options: {
    get () {
      return this.board_ && this.board_.options.zoom || {}
    }
  },
  /**
   * Bricks visible dimensions are propotional to this value.
   * Doubling the scale will double the size of the bricks on screen.
   * Each time the scale changes, an `update` message is sent.
   * The same holds for other properties.
   * @type {Number} Positive scale factor.
   */
  scale: {
    get () {
      return this.scale_
    },
    set (newValue) {
      if (newValue <= 0) {
        newValue = 1
      }
      if (this.scale_ !== newValue) {
        var options = this.options
        if (options && options.maxScale &&
          newValue > options.maxScale) {
            newValue = options.maxScale
        } else if (options && options.minScale &&
          newValue < options.minScale) {
            newValue = options.minScale
        }
        this.scale_ = newValue
        this.board_ && this.board_.didScale()
      }
    }
  },
  /**
   * How much is the port rect scrolled.
   * When there are some top bricks and the scale is big enough,
   * the view region is bigger than the port region and scrolling
   * is possible.
   * 
   * When this point is (0,0) the view topleft corner
   * (with a small margin offset)
   * and the (0,0) point in the content are exactly
   * at the same location on screen.
   * 
   * @type {eYo.Where} 
   */
  scroll: {
    get () {
      return this.scroll_.clone
    },
    set (newValue) {
      var r = this.scrollLimits(eYo.Where.xy())
      if (newValue.x < r.x) {
        newValue.x = r.x
      }
      if (newValue.x > r.x_max) {
        newValue.x = r.x_max
      }
      if (newValue.y < r.y) {
        newValue.y = r.y
      }
      if (newValue.y > r.y_max) {
        newValue.y = r.y_max
      }
      if (!this.scroll_.equals(newValue)) {
        this.wrapUpdate(() => this.scroll_.set(newValue))
      }
    }
  },
  /**
   * The view rect is the visible rectangle on screen (the view port).
   * For the main board it is the bounding rect of the enclosing
   * desk's div. For a flyout, it is generally smaller.
   * It is used for clipping the svg.
   * @type {eYo.Rect} 
   */
  view: {
    get () {
      return this.view_.clone
    },
    set (newValue) {
      if (!this.view_.equals(newValue)) {
        this.wrapUpdate(() => this.view_.set(newValue))
      }
    }
  },
  /**
   * The port rect is at least enclosing all the bricks.
   * In board coordinates.
   * 
   * The port is virtually unlimited and contains bricks of arbitrary size,
   * within memory capacities of course.
   * The port rect refers to a visual rectangle where
   * all the visible bricks lie.
   * 
   * The main pane is the half plane of the port with equation `c≥0`.
   * The draft pane is the half plane of the port with equation `c≤1`.
   * There is a 1 character width margin to separate both regions.
   * 
   * At initialization time, the dimensions of the port are defined
   * by the `minPort` rectangle.
   * When there is no brick, view and port share the same origin and size.
   * When there are some bricks, the port may be bigger than the view
   * and scrolling may be possible.
   * 
   * The 
   * @type {eYo.Rect} 
   * @readonly 
   */
  port: {
    get () {
      return this.port_.clone
    },
    set (newValue) {
      if (!this.port_.equals(newValue)) {
        this.wrapUpdate(() => {
          this.port_.set(newValue)
        })
      }
    }
  },
  /**
   * The port rect is at least enclosing all the bricks.
   * In view coordinates.
   * @type {eYo.Rect} 
   * @readonly 
   */
  portInView: {
    get () {
      return this.toView(this.port)
    }
  },
  /**
   * Whether line numbering is available or not.
   * When true, an extra margin at the right of the draft board is added
   * to display line numbers.
   * @type {Boolean} 
   * @readonly 
   */
  numbering: {
    get () {
      return this.numbering_
    },
    set (newValue) {
      if (this.numbering_ !== newValue) {
        this.wrapUpdate(() => this.numbering_ = newValue)
      }
    }
  },
  /**
   * The minimum port rect in board coordinates.
   * 
   * @type {eYo.Rect} 
   * @readonly 
   */
  minPort: {
    get () {
      var ans = this.view
      ans.size_.unscale(this.scale)
      ans.origin = this.scrollDefault
      ans.left = -(this.numbering ? 5 : 3) * eYo.Unit.x
      ans.top = -eYo.Unit.y
      return ans
    }
  },
  /**
   * The minimum port rect in board coordinates.
   * 
   * @type {eYo.Rect} 
   * @readonly 
   */
  scrollDefault: {
    get () {
      return eYo.Where.cl(-1.5, -0.25)
    }
  },
  /**
   * The box rect is bigger than the content rect.
   * It is reset each time the content rect changes.
   * @type {eYo.Rect} 
   * @readonly 
   */
  box: {
    get () {
      return this.box_.clone
    },
    set (newValue) {
      if (!this.box_.equals(newValue)) {
        this.wrapUpdate(() => this.box_.set(newValue))
      }
    }
  },
  /**
   * Clone the object.
   */
  clone: {
    get () {
      var ans = new eYo.Metrics()
      ans.scale_ = this.scale_
      ans.view = this.view_
      ans.port = this.port_
      ans.scroll = this.scroll_
      ans.box = this.box_
      ans.board_ = this.board_ // at the end only
      return ans
    }
  },
})

/**
 * Sever the links and dispose of the resources.
 */
eYo.Metrics.prototype.dispose = function () {
  this.board_ = null
  this.box_.dispose()
  this.scroll_.dispose()
  this.view_.dispose()
  this.port_.dispose()
  this.box_ = this.scroll_ = this.view_ = this.port_ = null
}

/**
 * Update the board.
 */
eYo.Metrics.prototype.update = function () {
  this.board_ && this.board_.metricsDidChange()
}

/**
 * Update the board.
 */
eYo.Metrics.prototype.wrapUpdate = function (do_it) {
  try {
    ++this.updateDepth_
    do_it()
  } finally {
    if(--this.updateDepth_) {
      return
    }
    this.update()
  }
}

/**
 * Convert the given argument from `board` coordinates to `view` coordinates.
 * @param{eYo.Rect | eYo.Where} WR
 */
eYo.Metrics.prototype.toView = function (WR) {
  // Referential(content) = (origin: O, basis: {I, J})
  // Referential(view) = (origin: o, basis: {i, j})
  // I = i * scale, J = j * scale
  // o + scroll = O, scroll is a vector in view coordinates
  // P = o + (x, y) •{i, j}
  //   = O + (X, Y) • {I, J}
  //   = o + scroll • {i, j} + (X, Y) * scale • {i, j} 
  //  (x, y) = scroll + (X, Y) * scale
  //  (X, Y) = ((x, y) - scroll) / scale
  return WR.scale(this.scale).forward(this.scroll_)
}

/**
 * Convert the given argument from `view` coordinates to `board` coordinates.
 * @param{eYo.Rect | eYo.Where} wr
 */
eYo.Metrics.prototype.fromView = function (wr) {
  return wr.backward(this.scroll_).unscale(this.scale)
}

/**
 * The scroll limits in view coordinates.
 * Used for scrolling, gives the limiting values of the `scroll` property.
 * @param{eYo.Size} margin  Extra margin in board coordinates, in general, it is the size of some brick.
 */
eYo.Metrics.prototype.scrollLimits = function (margin) {
  var min = this.minPort // visible area when scroll is default
  var ans = this.port // available area
  ans.right -= min.right
  ans.bottom -= min.bottom + margin.height
  var scroll = this.scrollDefault
  ans.left -= scroll.x + margin.width
  ans.top -= scroll.y + margin.height
  ans.origin_.forward(this.scrollDefault)
  ans.unscale(this.scale).mirror()
  return ans
}

/**
 * Get the dragging limits.
 * Reference is the brick board.
 * @param{?eYo.Rect} rect
 */
eYo.Metrics.prototype.getDraggingLimits = function (rect) {
  var view = this.minPort
  var limits = this.port
  if (rect) {

  }
}

/**
 * Test whether the receiver equals the given metrics object.
 * @param {!eYo.Metrics} rhs Another metrics.
 * @return {boolean} Whether the two sets of metrics are equivalent.
 * @private
 */
eYo.Metrics.prototype.equals = function(rhs) {
  return rhs && this.view.equals(rhs.view) &&
  this.scale === rhs.scale &&
  this.scroll.equals(rhs.scroll) &&
  this.port.equals(rhs.port)
}
