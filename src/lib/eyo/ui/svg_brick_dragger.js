/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview brickDragger rendering delegate.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.Svg.brickDragger')

goog.require('eYo.Svg')

/**
 * Initializes the brickDragger SVG ressources.
 * @param {!eYo.brickDragger} brickDragger
 */
eYo.Svg.prototype.brickDraggerInit = function(dragger) {
  if (dragger.dom) {
    return
  }
  var dom = this.basicInit(dragger)
  var svg = dom.svg
  svg.dragSurface = dragger.desk.dom.svg.brickDragSurface
}

/**
 * Dispose of the given slot's rendering resources.
 * @param {!eYo.brickDragger} brickDragger
 */
eYo.Svg.prototype.brickDraggerDispose = eYo.Dom.decorateDispose(function (brickDragger) {
  var svg = brickDragger.dom.svg
  if (svg) {
    svg.dragSurface = null
    dom.svg = null
  }
})

/**
 * Start dragging.
 * @param {!eYo.brickDragger} brickDragger
 */
eYo.Svg.prototype.brickDraggerStart = function (brickDragger) {
  var div = brickDragger.desk.dom.div_
  brickDragger.transformCorrection_ = eYo.Svg.getTransformCorrection(div)
  // Move the brick dragged to the drag surface
  // The translation for drag surface bricks,
  // is equal to the current relative-to-surface position,
  // to keep the position in sync as it moves on/off the surface.
  var brick = brickDragger.brick_
  var board = brick.board
  var canvas = board.dom.svg.canvas_
  var dragSurface = brickDragger.desk.dom.svg.brickDragSurface
  dragSurface.dom.svg.canvas_.setAttribute(
    'transform',
    canvas.getAttribute('transform')
  )
  // Execute the move on the top-level SVG component
  dragSurface.show(brick.dom.svg.group_)
}

/**
 * End dragging.
 * @param {!eYoBrickDragger} dragger
 */
eYo.Svg.prototype.brickDraggerEnd = function (dragger) {
  dragger.transformCorrection_ = null
  this.disconnectStop()
  var b3k = dragger.brick
  // Translate to current position, turning off 3d.
  var bds = b3k.desk.dom.svg.brickDragSurface
  b3k.xyMoveBy(bds.surfaceXY_)
  bds.clearAndHide(b3k.board.dom.svg.canvas_)
}
