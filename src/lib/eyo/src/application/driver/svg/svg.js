/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Rendering delegate.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.require('eYo.Dom')

goog.provide('eYo.Svg')

goog.require('eYo.Decorate')

goog.require('eYo.T3.Profile')
goog.require('eYo.Field')

goog.forwardDeclare('eYo.Svg.Brick')
goog.forwardDeclare('eYo.Svg.Slot')
goog.forwardDeclare('eYo.Svg.Field')
goog.forwardDeclare('eYo.Slot')
goog.forwardDeclare('eYo.Brick')
goog.forwardDeclare('eYo.Style')
goog.forwardDeclare('goog.userAgent')

/**
 * A namespace.
 * @name{eYo.Svg}
 * @namespace
 */
eYo.Svg = Object.create(null)

/**
 * A namespace.
 * @name{eYo.Svg.Decorate}
 * @namespace
 */
eYo.Svg.Decorate = Object.create(null)

/**
 * Svg driver manager.
 * @param {eYo.Application} owner
 */
eYo.Svg.Mgr = (() => {
  var drivers = set()
  var me = function (owner) {
    eYo.Svg.Mgr.superClass_.constructor.call(this, owner)
    drivers.forEach(name => {
      this[name[0].toUpperCase() + name.substr(1)] = new eYo.Svg[name]()
    })
  }
  /**
   * Convenient automatic subclasser.
   * @param {String} name
   */
  eYo.Svg.makeSubclass = (name) => {
    drivers.add(name)
    eYo.Svg[name] = function () {
      eYo.Svg[name].superClass_.constructor.call(this)
    }
    goog.inherits(eYo.Svg[name], eYo.Dom[name])
  }
  return me
})()
goog.inherits(eYo.Svg.Mgr, eYo.Owned)


/**
 * Decorator for initUI.
 */
eYo.Svg.Decorate.initUI = (constructor, f) => {
  return function (object, ...rest) {
    var dom = constructor.superClass_.initUI.apply(object, ...rest)
    if (dom) {
      dom.svg = Object.create(null)
      f.apply(object, ...rest)
      return dom
    }
  }
}

/**
 * Decorator for disposeUI.
 */
eYo.Svg.Decorate.disposeUI = (constructor, f) => {
  return function (object, ...rest) {
    var dom = object.dom
    if (dom) {
      f.apply(object, ...rest)
      dom.svg = null
      constructor.superClass_.disposeUI.apply(object, ...rest)
    }
  }
}

eYo.Svg.prototype.withBBox = true

/**
 * Helper method for creating SVG elements.
 * @param {string} name Element's tag name.
 * @param {!Object} attrs Dictionary of attribute names and values.
 * @param {Element} parent Optional parent on which to append the element.
 * @return {!SVGElement} Newly created SVG element.
 */
eYo.Svg.newElement = function(name, attrs, parent) {
  var e = /** @type {!SVGElement} */
      document.createElementNS(eYo.Dom.SVG_NS, name)
  for (var key in attrs) {
    var value = attrs[key]
    value && e.setAttribute(key, value)
  }
  // IE defines a unique attribute "runtimeStyle", it is NOT applied to
  // elements created with createElementNS. However, Closure checks for IE
  // and assumes the presence of the attribute and crashes.
  if (document.body.runtimeStyle) {  // Indicates presence of IE-only attr.
    e.runtimeStyle = e.currentStyle = e.style
  }
  parent && (parent.appendChild(e))
  return e
}

/**
 * Helper method for creating SVG root elements.
 * @return {!Element} parent
 * @param {string} className.
 * @return {!SVGElement} Newly created SVG element.
 */
eYo.Svg.newElementSvg = function(parent, className) {
  return eYo.Svg.newElement('svg', {
    xmlns: eYo.Dom.SVG_NS,
    'xmlns:html': eYo.Dom.HTML_NS,
    'xmlns:xlink': eYo.Dom.XLINK_NS,
    version: '1.1',
    class: className | ''
  },
  parent)
}

/**
 * Regular expressions.
 */
Object.defineProperties(eYo.Svg, {
  TRANSLATE_REGEX_: { value: /translate\s*\(\s*([-+\d.,e]+)([ ,]\s*([-+\d.,e]+)\s*\))/ },
  TRANSLATE_2D_REGEX_: { value: /transform\s*:\s*translate\s*\(\s*([-+\d.,e]+)px([ ,]\s*([-+\d.,e]+)\s*)px\)?/ },
  TRANSLATE_3D_REGEX_: { value: /transform\s*:\s*translate3d\(\s*([-+\d.,e]+)px([ ,]\s*([-+\d.,e]+)\s*)px([ ,]\s*([-+\d.,e]+)\s*)px\)?/ }
})

/**
 * Return the coordinates of the top-left corner of this element relative to
 * its parent.  Only for SVG elements and children (e.g. rect, g, path).
 * Fixed bug in original code.
 * @param {!Element} element SVG element to find the coordinates of.
 * @return {!eYo.Where} Object with .x and .y properties.
 */
eYo.Svg.prototype.xyInParent = function(element) {
  var xy = new eYo.Where()
  // First, check for x and y attributes.
  var x = element.getAttribute('x')
  if (x) {
    xy.x = parseInt(x, 10)
  }
  var y = element.getAttribute('y')
  if (y) {
    xy.y = parseInt(y, 10)
  }
  // Second, check for transform="translate(...)" attribute.
  var transform = element.getAttribute('transform')
  var r = transform && (transform.match(eYo.Svg.TRANSLATE_REGEX_))
  if (r) {
    xy.x += parseFloat(r[1])
    if (r[3]) {
      xy.y += parseFloat(r[3])
    }
  }
  // Then check for style = transform: translate(...) or translate3d(...)
  var style = element.getAttribute('style');
  if (style && style.indexOf('translate') > -1) {
    var styleComponents = style.match(eYo.Svg.TRANSLATE_2D_REGEX_)
    // Try transform3d if 2d transform wasn't there.
    if (!styleComponents) {
      styleComponents = style.match(eYo.Svg.TRANSLATE_3D_REGEX_)
    }
    if (styleComponents) {
      xy.x += parseFloat(styleComponents[1])
      if (styleComponents[3]) {
        xy.y += parseFloat(styleComponents[3])
      }
    }
  }
  return xy
}

/**
 * Add tooltip to an element
 * @param {!String} key
 */
eYo.Svg.prototype.addTooltip = function (el, title, options) {
  if (goog.isString(title)) {
    el.setAttribute('title', title)
    tippy(el, options)
  } else if (goog.isDef(title)) {
    tippy(el, title)
  }
}

// Private holder of svg ressources
Object.defineProperties(eYo.Field, {
  svg: { value: eYo.VOID, writable: true }
})

/**
 * The css class for the given text
 * For edython.
 * @param {!string} txt The text to yield_expr
 * @return {string}
 */
eYo.Svg.getCssClassForText = function (txt) {
  switch (eYo.T3.Profile.get(txt, null).raw) {
  case eYo.T3.Expr.reserved_identifier:
  case eYo.T3.Expr.reserved_keyword:
    return 'eyo-code-reserved'
  case eYo.T3.Expr.builtin__name:
    return 'eyo-code-builtin'
  default:
    return 'eyo-code'
  }
}

/**
 * Remove an attribute from a element even if it's in IE 10.
 * Similar to Element.removeAttribute() but it works on SVG elements in IE 10.
 * Sets the attribute to null in IE 10, which treats removeAttribute as a no-op
 * if it's called on an SVG element.
 * @param {!Element} element DOM element to remove attribute from.
 * @param {string} attributeName Name of attribute to remove.
 */
eYo.Svg.prototype.removeAttribute = function(element, attributeName) {
  // goog.userAgent.isVersion is deprecated, but the replacement is
  // goog.userAgent.isVersionOrHigher.
  if (goog.userAgent.IE && goog.userAgent.isVersion('10.0')) {
    element.setAttribute(attributeName, null)
  } else {
    element.removeAttribute(attributeName)
  }
}

/**
 * Get the cumulated affine transform of an element.
 * @param {*} element
 */
eYo.Svg.getAffineTransform = (() => {
  var getAffineTransform = (str) => {
    var values = str.split(/\s*,\s*|\)\s*|.*\(/)
    if (values.length > 8) {
      values = str.split(/\s*,\s+|\)\s*|.*\(/)
    }
    if (values.length > 6) {
      values.pop()
      values.shift()
      return new goog.math.AffineTransform(...values.map(m => parseFloat(m)))
    }
  }
  return element => {
    var A
    var parent
    while ((parent = element.parentNode)) {
      var style = window.getComputedStyle(element, null)
      var transform = style.getPropertyValue("transform") ||
        style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform")
      var B = getAffineTransform(transform)
      if (B) {
        A = A ? B.concatenate(A) : B
      }
      element = parent
    }
    return A
  }
})()

/**
 * Get the cumulated affine transform of an element.
 * @param {*} element
 */
eYo.Svg.getTransformCorrection = element => {
  var A = eYo.Svg.getAffineTransform(element)
  if (A) {
    var B = A.createInverse()
    if (B) {
      return (xy) => {
        return {
          x: B.m00_ * xy.x + B.m01_ * xy.y + B.m02_,
          y: B.m10_ * xy.x + B.m11_ * xy.y + B.m12_
        }
      }
    }
  }
}

/**
 * Return the coordinates of the top-left corner of this element relative to
 * its parent.  Only for SVG elements and children (e.g. rect, g, path).
 * @param {!Element} element SVG element to find the coordinates of.
 * @return {!eYo.Where} Object with .x and .y properties.
 */
eYo.Svg.getRelativeWhere = function(element) {
  var xy = new eYo.Where()
  // First, check for x and y attributes.
  var x = element.getAttribute('x')
  if (x) {
    xy.x = parseInt(x, 10)
  }
  var y = element.getAttribute('y')
  if (y) {
    xy.y = parseInt(y, 10)
  }
  // Second, check for transform="translate(...)" attribute.
  var transform = element.getAttribute('transform')
  var r = transform && transform.match(eYo.Svg.getRelativeWhere.Where_REGEX_)
  if (r) {
    xy.x += parseFloat(r[1])
    if (r[3]) {
      xy.y += parseFloat(r[3])
    }
  }
  // Then check for style = transform: translate(...) or translate3d(...)
  var style = element.getAttribute('style')
  if (style && style.indexOf('translate') > -1) {
    var styleComponents = style.match(eYo.Svg.getRelativeWhere.Where_2D_REGEX_)
    // Try transform3d if 2d transform wasn't there.
    if (!styleComponents) {
      styleComponents = style.match(eYo.Svg.getRelativeWhere.Where_3D_REGEX_)
    }
    if (styleComponents) {
      xy.x += parseFloat(styleComponents[1])
      if (styleComponents[3]) {
        xy.y += parseFloat(styleComponents[3])
      }
    }
  }
  return xy
}

/**
 * Return the scale of this element.
 * @param {!Element} element  The element to find the coordinates of.
 * @return {!number} number represending the scale applied to the element.
 * @private
 */
eYo.Svg.getScale_ = function(element) {
  var scale = 1
  var transform = element.getAttribute('transform')
  if (transform) {
    var transformComponents =
        transform.match(eYo.Svg.getScale_REGEXP_)
    if (transformComponents && transformComponents[0]) {
      scale = parseFloat(transformComponents[1])
    }
  }
  return scale
}

/**
 * For some reason, the string given by `element.style.transform` seems localized
 * in the sense that floats may use commas instead of dots. See https://github.com/electron/electron/issues/6158
 */

// eslint-disable-next-line no-global-assign
var eyo_original_parseFloat = parseFloat
parseFloat = (x) => {
  return eyo_original_parseFloat(goog.isDefAndNotNull(x) && x.replace
    ? x.replace(',', '.')
    : x)
}

// eslint-disable-next-line no-useless-escape
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.,-]+, [0-9\.,\-]+, [0-9\.,\-]+, [0-9\.,\-]+, ([0-9\.,\-]+)p?x?, ([0-9\.,\-]+)p?x?\)/

/**
 * Static regex to pull the x,y values out of an SVG translate() directive.
 * Note that Firefox and IE (9,10) return 'translate(12)' instead of
 * 'translate(12, 0)'.
 * Note that IE (9,10) returns 'translate(16 8)' instead of 'translate(16, 8)'.
 * Note that IE has been reported to return scientific notation (0.123456e-42).
 * @type {!RegExp}
 * @private
 */
eYo.Svg.getRelativeWhere.Where_REGEX_ =
/translate\(\s*([-+\d.,e]+)([ ,]\s*([-+\d.,e]+)\s*\))/

/**
 * Static regex to pull the scale values out of a transform style property.
 * Accounts for same exceptions as Where_REGEXP_.
 * @type {!RegExp}
 * @private
 */
eYo.Svg.getScale_REGEXP_ = /scale\(\s*([-+\d.,e]+)\s*\)/

/**
 * Static regex to pull the x,y,z values out of a translate3d() style property.
 * Accounts for same exceptions as Where_REGEXP_.
 * @type {!RegExp}
 * @private
 */
eYo.Svg.getRelativeWhere.Where_3D_REGEX_ =
  /transform:\s*translate3d\(\s*([-+\d.,e]+)px([ ,]\s*([-+\d.,e]+)\s*)px([ ,]\s*([-+\d.,e]+)\s*)px\)?/

/**
 * Static regex to pull the x,y,z values out of a translate3d() style property.
 * Accounts for same exceptions as Where_REGEXP_.
 * @type {!RegExp}
 * @private
 */
eYo.Svg.getRelativeWhere.Where_2D_REGEX_ =
  /transform:\s*translate\(\s*([-+\d.,e]+)px([ ,]\s*([-+\d.,e]+)\s*)px\)?/
