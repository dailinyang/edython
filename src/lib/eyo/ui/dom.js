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

goog.provide('eYo.Dom')

goog.require('eYo.Driver')

goog.require('goog.events');
goog.forwardDeclare('goog.dom');

/**
 * Model for dom utilities
 * @param {eYo.Factory} factory
 * @constructor
 */
eYo.Dom = function (factory) {
  eYo.Dom.superClass_.constructor.call(this, factory)
}
goog.inherits(eYo.Dom, eYo.Driver)

/**
 * The TOUCH_MAP lookup dictionary specifies additional touch events to fire,
 * in conjunction with mouse events.
 * @type {Object}
 */
eYo.Dom.TOUCH_MAP = {}
if (window && window.PointerEvent) {
  Object.defineProperties(eYo.Dom.TOUCH_MAP, {
    'mousedown': { value: ['pointerdown'] },
    'mouseenter': { value: ['pointerenter'] },
    'mouseleave': { value: ['pointerleave'] },
    'mousemove': { value: ['pointermove'] },
    'mouseout': { value: ['pointerout'] },
    'mouseover': { value: ['pointerover'] },
    'mouseup': { value: ['pointerup', 'pointercancel'] },
    'touchend': { value: ['pointerup'] },
    'touchcancel': { value: ['pointercancel'] }
  })
} else if (goog.events.BrowserFeature.TOUCH_ENABLED) {
  Object.defineProperties(eYo.Dom.TOUCH_MAP, {
    'mousedown': { value: ['touchstart'] },
    'mousemove': { value: ['touchmove'] },
    'mouseup': { value: ['touchend', 'touchcancel'] },
  })
}

/**
 * Is this event a right-click?
 * @param {!Event} e Mouse event.
 * @return {boolean} True if right-click.
 */
eYo.Dom.isRightButton = e => {
  if (e.ctrlKey && goog.userAgent.MAC) {
    // Control-clicking on Mac OS X is treated as a right-click.
    // WebKit on Mac OS X fails to change button to 2 (but Gecko does).
    return true
  }
  return e.button === 2
}

/**
 * Sets the CSS transform property on an element. This function sets the
 * non-vendor-prefixed and vendor-prefixed versions for backwards compatibility
 * with older browsers. See http://caniuse.com/#feat=transforms2d
 * @param {!Element} node The node which the CSS transform should be applied.
 * @param {string} transform The value of the CSS `transform` property.
 */
eYo.Dom.setCssTransform = function(node, transform) {
  node.style['transform'] = transform
  node.style['-webkit-transform'] = transform // 2014
}

/**
 * Bind an event to a function call. When calling the function, verifies that
 * it belongs to the touch stream that is currently being processed, and splits
 * multitouch events into multiple events as needed.
 * @param {!EventTarget} node Node upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {?Object} thisObject The value of 'this' in the function.
 * @param {!Function} callback Function to call when event is triggered.
 * @param {boolean=} opt.noCaptureIdentifier True if triggering on this event
 *     should not block execution of other event handlers on this touch or other
 *     simultaneous touches.
 * @param {boolean=} opt.noPreventDefault True if triggering on this event
 *     should prevent the default handler.  False by default.
 * @return {!Array.<!Array>} Opaque data that can be passed to unbindEvent.
 */
eYo.Dom.bindEvent = (node, name, thisObject, callback, opt) => {
  if (goog.isFunction(thisObject)) {
    opt = callback
    callback = thisObject
    thisObject = null
  }
  goog.asserts.assert(goog.isFunction(callback))
  var handled = false
  var wrapFunc = e => {
    var noCaptureIdentifier = opt && opt.noCaptureIdentifier
    // Handle each touch point separately.  If the event was a mouse event, this
    // will hand back an array with one element, which we're fine handling.
    eYo.Dom.forEachTouch(e, event => {
      if (noCaptureIdentifier || eYo.Dom.shouldHandleEvent(event)) {
        if (/^touch/i.test(event.type)) {
          // Map the touch event's properties to the event.
          var p = event.changedTouches[0]
          event.clientX = p.clientX
          event.clientY = p.clientY
        }
        thisObject
        ? callback.call(thisObject, event)
        : callback(event)
        handled = true
      }
    })
  }
  var bindData = []
  if (window && window.PointerEvent && (name in eYo.Dom.TOUCH_MAP)) {
    eYo.Dom.TOUCH_MAP[name].forEach(type => {
      node.addEventListener(type, wrapFunc, false)
      bindData.push([node, type, wrapFunc])
    })
  } else {
    node.addEventListener(name, wrapFunc, false)
    bindData.push([node, name, wrapFunc])
    // Add equivalent touch event.
    if (name in eYo.Dom.TOUCH_MAP) {
      var touchWrapFunc = e => {
        wrapFunc(e)
        // Calling preventDefault stops the browser from scrolling/zooming the
        // page.
        var preventDef = !opt ||!opt.noPreventDefault
        if (handled && preventDef) {
          e.preventDefault()
        }
      }
      eYo.Dom.TOUCH_MAP[name].forEach(type => {
        node.addEventListener(type, touchWrapFunc, false)
        bindData.push([node, type, touchWrapFunc])
      })
    }
  }
  return bindData
}

/**
 * Unbind one or more events event from a function call.
 * @param {!Array.<!Array>} bindData Opaque data from bindEvent.
 *     This list is emptied during the course of calling this function.
 * @return {!Function} The function call.
 */
eYo.Dom.unbindEvent = bindData => {
  while (bindData.length) {
    var d = bindData.pop()
    var func = d[2]
    d[0].removeEventListener(d[1], func, false)
  }
  return func
}

/**
 * Insert a node after a reference node.
 * Contrast with node.insertBefore function.
 * @param {!Element} after New element to insert.
 * @param {!Element} before Existing element to precede new node.
 * @private
 */
eYo.Dom.insertAfter = function(node, before) {
  var parent = before.parentNode
  if (!parent) {
    throw 'Reference node has no parent.'
  }
  var after = before.nextSibling
  if (after) {
    parent.insertBefore(node, after)
  } else {
    parent.appendChild(node)
  }
}

/**
 * Bind mouse events.
 * @param {!Object} listener A mouse down or touch start event listener.
 * @param {!Element} element A mouse down or touch start event.
 * @param {?Object} opt  Option data: suffix, option flags: willUnbind, and bindEventWithChecks_'s options
 * @package
 */
eYo.Dom.bindMouseEvents = (listener, element, opt) => {
  ;[
    'mousedown',
    'mousemove',
    'mouseup'
  ].forEach(k => {
    var f = listener['on_' + k + ((opt && opt.suffix) || '')]
    if (goog.isFunction(f)) {
      var ans = eYo.Dom.bindEvent(element, k, listener, f, opt)
      if (opt && opt.willUnbind) {
        var ra = listener.bind_data_ || (listener.bind_data_ = [])
        ra.push(ans)
      }
    }
  })
}

/**
 * Bind mouse events.
 * @param {!Event} e A mouse down or touch start event.
 * @package
 */
eYo.Dom.unbindMouseEvents = function(listener) {
  listener.bind_data_ && listener.bind_data_.forEach(data => eYo.Dom.unbindEvent(data))
}


/**
 * Split an event into an array of events, one per changed touch or mouse
 * point.
 * @param {!Event} e A mouse event or a touch event with one or more changed
 * touches.
 * @param {!Function} f A function to be executed for each event, signature (<!Event>e) -> undefined.
 * @return {!Array.<!Event>} An array of mouse or touch events.  Each touch
 *     event will have exactly one changed touch.
 */
eYo.Dom.forEachTouch = eYo.Dom.prototype.forEachTouch = (e, f) => {
  if (e.changedTouches) {
    e.changedTouches.forEach(t => {
      var newEvent = {
        type: e.type,
        changedTouches: [t],
        target: e.target,
        stopPropagation: function() {  e.stopPropagation() },
        preventDefault: function() { e.preventDefault() }
      }
      f(newEvent)
    })
  } else {
    f(e)
  }
}

/**
 * @param {eYo.Brick|eYo.Workspace|eYo.Flyout}
 */
eYo.Dom.clearBoundEvents = (bfw) => {
  var dom = bfw.dom || bfw.dom
  var bound = dom = dom.bound
  bound && Object.values(bound).forEach(item => eYo.Dom.unbindEvent(item))
}

/**
 * Decide whether we should handle or ignore this event.
 * Mouse and touch events require special checks because we only want to deal
 * with one touch stream at a time.  All other events should always be handled.
 * @param {!Event} e The event to check.
 * @return {boolean} True if this event should be passed through to the
 *     registered handler; false if it should be blocked.
 */
eYo.Dom.shouldHandleEvent = e => {
  return !eYo.Dom.isMouseOrTouchEvent(e) || eYo.Dom.checkTouchIdentifier(e)
}

/**
 * Check whether a given event is a touch event or a pointer event.
 * @param {!Event} e An event.
 * @return {boolean} true if it is a touch event; false otherwise.
 */
eYo.Dom.isTouchEvent = e => {
  return /^touch|^pointer/i.test(e.type)
}

/**
 * Check whether a given event is a touch event or a pointer event.
 * @param {!Event} e An event.
 * @return {boolean} true if it is a touch event; false otherwise.
 */
eYo.Dom.isMouseOrTouchEvent = e => {
  return /^mouse|^touch|^pointer/i.test(e.type)
}

/**
 * Check whether the touch identifier on the event matches the current saved
 * identifier.  If there is no identifier, that means it's a mouse event and
 * we'll use the identifier "mouse".  This means we won't deal well with
 * multiple mice being used at the same time.  That seems okay.
 * If the current identifier was unset, save the identifier from the
 * event.  This starts a drag/gesture, during which touch events with other
 * identifiers will be silently ignored.
 * @param {!Event} e Mouse event or touch event.
 * @return {boolean} Whether the identifier on the event matches the current
 *     saved identifier.
 */
eYo.Dom.checkTouchIdentifier = (() => {
  var touchIdentifier = null
  /**
   * Clear the touch identifier that tracks which touch stream to pay attention
   * to.  This ends the current drag/gesture and allows other pointers to be
   * captured.
   */
  eYo.Dom.clearTouchIdentifier = function() {
    touchIdentifier = null
  }
  return e => {
    var identifier = eYo.Dom.touchIdentifierFromEvent(e)

    // if (Blockly.touchIdentifier_ )is insufficient because Android touch
    // identifiers may be zero.
    if (touchIdentifier != undefined && touchIdentifier != null) {
      // We're already tracking some touch/mouse event.  Is this from the same
      // source?
      return touchIdentifier == identifier
    }
    if (e.type == 'mousedown' || e.type == 'touchstart' || e.type == 'pointerdown') {
      // No identifier set yet, and this is the start of a drag.  Set it and
      // return.
      touchIdentifier = identifier
      return true
    }
    // There was no identifier yet, but this wasn't a start event so we're going
    // to ignore it.  This probably means that another drag finished while this
    // pointer was down.
    return false
  }
})()

/**
 * Get the touch identifier from the given event.  If it was a mouse event, the
 * identifier is the string 'mouse'.
 * @param {!Event} e Mouse event or touch event.
 * @return {string} The touch identifier from the first changed touch, if
 *     defined.  Otherwise 'mouse'.
 */
eYo.Dom.touchIdentifierFromEvent = e => {
  var x
  return e.pointerId != undefined
  ? e.pointerId
  : ((x = e.changedTouches) && (x = x[0]) && (x = x.identifier) != undefined && x != null)
    ? x
    : 'mouse'
}

/**
 * Prevents default behavior and stop propagation.
 * @param {Event} e
 */
eYo.Dom.gobbleEvent = e => {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 */
eYo.Dom.isTargetInput = e => {
  return e.target.type == 'textarea' || e.target.type == 'text' ||
         e.target.type == 'number' || e.target.type == 'email' ||
         e.target.type == 'password' || e.target.type == 'search' ||
         e.target.type == 'tel' || e.target.type == 'url' ||
         e.target.isContentEditable
}

Object.defineProperties(eYo.Dom, {
  /**
   * Length in ms for a touch to become a long press.
   */
  LONG_PRESS: { value: 750 },
  /**
   * Required name space for HTML elements.
   * @const
   */
  HTML_NS: { value: 'http://www.w3.org/1999/xhtml' },
  SVG_NS: { value: 'http://www.w3.org/2000/svg' },
  XLINK_NS: { value: 'http://www.w3.org/1999/xlink' },
  /**
   * Check if 3D transforms are supported by adding an element
   * and attempting to set the property.
   * @return {boolean} true if 3D transforms are supported.
   */
  is3dSupported: {
    get: (() => {
      var is3dSupported
      return function() {
        if (is3dSupported !== undefined) {
          return is3dSupported
        }
        // CC-BY-SA Lorenzo Polidori
        // stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        if (!goog.global.getComputedStyle) {
          return false;
        }

        var el = document.createElement('p');
        var has3d = 'none';
        var transforms = {
          'webkitTransform': '-webkit-transform',
          'OTransform': '-o-transform',
          'msTransform': '-ms-transform',
          'MozTransform': '-moz-transform',
          'transform': 'transform'
        };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
          if (el.style[t] !== undefined) {
            el.style[t] = 'translate3d(1px,1px,1px)'
            var computedStyle = goog.global.getComputedStyle(el)
            if (!computedStyle) {
              // getComputedStyle in Firefox returns null when blockly is loaded
              // inside an iframe with display: none.  Returning false and not
              // caching is3dSupported means we try again later.  This is most likely
              // when users are interacting with blocks which should mean blockly is
              // visible again.
              // See https://bugzilla.mozilla.org/show_bug.cgi?id=548397
              document.body.removeChild(el)
              return false
            }
            has3d = computedStyle.getPropertyValue(transforms[t])
          }
        }
        document.body.removeChild(el)
        return (is3dSupported = has3d !== 'none')
      }
    }) ()
  }
})

/**
 * Context menus on touch devices are activated using a long-press.
 * Unfortunately the contextmenu touch event is currently (2015) only supported
 * by Chrome.  This function is fired on any touchstart event, queues a task,
 * which after about a second opens the context menu.  The tasks is killed
 * if the touch event terminates early.
 * @param {!Event} e Touch start event.
 * @param {eYo.Gesture} gesture The gesture that triggered this longStart.
 * @private
 */
eYo.Dom.longStart_ = (() => {
  var pid = 0
  /**
   * Nope, that's not a long-press.  Either touchend or touchcancel was fired,
   * or a drag hath begun.  Kill the queued long-press task.
   * @private
   */
  eYo.Dom.longStop_ = () => {
    if (pid) {
      clearTimeout(pid)
      pid = 0
    }
  }
  return (e, gesture) => {
    eYo.Dom.longStop_()
    // Punt on multitouch events.
    if (e.changedTouches && e.changedTouches.length != 1) {
      return;
    }
    pid = setTimeout(() => {
      // Additional check to distinguish between touch events and pointer events
      if (e.changedTouches) {
        // TouchEvent
        e.button = 2  // Simulate a right button click.
        // e was a touch event.  It needs to pretend to be a mouse event.
        e.clientX = e.changedTouches[0].clientX
        e.clientY = e.changedTouches[0].clientY
      }
      // Let the gesture route the right-click correctly.
      if (gesture) {
        gesture.handleRightClick(e)
      }
    }, eYo.Dom.LONG_PRESS)
  }
})()

/**
 * Bind document events, but only once.  Destroying and reinjecting Blockly
 * should not bind again.
 * Bind events for scrolling the workspace.
 * Most of these events should be bound to the SVG's surface.
 * However, 'mouseup' has to be on the whole document so that a block dragged
 * out of bounds and released will know that it has been released.
 * Also, 'keydown' has to be on the whole document since the browser doesn't
 * understand a concept of focus on the SVG image.
 * @private
 */
eYo.Dom.bindDocumentEvents = (() => {
  var already
  return () => {
    if (!already) {
      eYo.Dom.bindEvent(
        document,
        'keydown',
        eYo.Dom.on_keydown
      )
      // longStop needs to run to stop the context menu from showing up.  It
      // should run regardless of what other touch event handlers have run.
      eYo.Dom.bindEvent(
        document,
        'touchend',
        eYo.Dom.longStop_
      )
      eYo.Dom.bindEvent(
        document,
        'touchcancel',
        eYo.Dom.longStop_
      )
      // Some iPad versions don't fire resize after portrait to landscape change.
      if (goog.userAgent.IPAD) {
        eYo.Dom.bindEvent(
          window,
          'orientationchange',
          e => eYo.Svg.factoryResize(eYo.App.factory) // TODO(#397): Fix for multiple workspaces.
        )
      }
    }
    already = true
  }
})()

/**
 * Handle a key-down on SVG drawing surface.
 * The delete block code is.unbindMouseEvents modified
 * @param {!Event} e Key down event.
 * @private
 */
eYo.Dom.on_keydown = e => {
  if (eYo.App.workspace.options.readOnly || eYo.Dom.isTargetInput(e)) {
    // No key actions on readonly workspaces.
    // When focused on an HTML text input widget, don't trap any keys.
    return
  }
  // var deleteBrick = false;
  if (e.keyCode == 9) {
    if (eYo.Navigate.doTab(eYo.Selected.brick, {
        left: e.shiftKey,
        fast: e.altKey || e.ctrlKey || e.metaKey
      })) {
      eYo.Dom.gobbleEvent(e)
    }
  } else if (e.keyCode == 27) {
    // Pressing esc closes the context menu.
    eYo.App.hideChaff()
  } else if (e.keyCode == 8 || e.keyCode == 46) {
    // Delete or backspace.
    // Stop the browser from going back to the previous page.
    // Do this first to prevent an error in the delete code from resulting in
    // data loss.
    e.preventDefault()
    // Don't delete while dragging.  Jeez.
    if (eYo.App.workspace.isDragging) {
      return;
    }
    if (eYo.Selected.brick && eYo.Selected.brick.deletable) {
      eYo.Desktop.deleteBrick(eYo.Selected.brick, e.altKey || e.ctrlKey || e.metaKey);
    }
  } else if (e.altKey || e.ctrlKey || e.metaKey) {
    // Don't use meta keys during drags.
    if (eYo.App.workspace.isDragging) {
      return;
    }
    if (eYo.Selected.brick &&
        eYo.Selected.brick.deletable && eYo.Selected.brick.movable) {
      // Eyo: 1 meta key for shallow copy, more for deep copy
      var deep = (e.altKey ? 1 : 0) + (e.ctrlKey ? 1 : 0) + (e.metaKey ? 1 : 0) > 1
      // Don't allow copying immovable or undeletable bricks. The next step
      // would be to paste, which would create additional undeletable/immovable
      // bricks on the workspace.
      if (e.keyCode == 67) {
        // 'c' for copy.
        eYo.App.hideChaff()
        eYo.Desktop.copyBrick(eYo.Selected.brick, deep)
      } else if (e.keyCode == 88 && !eYo.Selected.brick.workspace.isFlyout) {
        // 'x' for cut, but not in a flyout.
        // Don't even copy the selected item in the flyout.
        eYo.Desktop.copyBrick(eYo.Selected.brick, deep)
        eYo.Desktop.deleteBrick(eYo.Selected.brick, deep)
      }
    }
    if (e.keyCode == 86) {
      // 'v' for paste.
      eYo.App.workspace.paste()
    } else if (e.keyCode == 90) {
      // 'z' for undo 'Z' is for redo.
      eYo.App.hideChaff()
      eYo.App.workspace.undo(e.shiftKey)
    }
  }
  // Common code for delete and cut.
  // Don't delete in the flyout.
  // if (deleteBrick && !eYo.Selected.brick.workspace.isFlyout) {
  //   eYo.Events.group = true
  //   eYo.App.hideChaff();
  //   eYo.Selected.brick.dispose(/* heal */ true, true);
  //   eYo.Events.group = false
  // }
};

/**
 * Initialize the basic dom ressources.
 * @param {!Object} object
 * @return {!Object} The object's dom repository.
 */
eYo.Dom.prototype.basicInit = function(object) {
  var dom = object.dom
  if (!dom) {
    dom = object.dom = Object.create(null)
    dom.bound = Object.create(null)
  }
  return dom
}

/**
 * Decorates a function between `clearBoundEvents` and `basicDispose`.
 */
eYo.Dom.decorateDispose = f => {
  return function (object) {
    var dom = object.dom
    if (dom) {
      eYo.Dom.clearBoundEvents(object)
      f.call(this, object)
      this.basicDispose(object)
    }
  }
}

/**
 * Dispose of the basic dom ressources.
 * @param {!Object} object
 */
eYo.Dom.prototype.basicDispose = function(object) {
  var dom = object.dom
  if (dom) {
    dom.bound = null
    object.dom = null
    eYo.Dom.superClass_.dispose.call(this)
  }
}

/**
 * Dispose of the given slot's rendering resources.
 * @param {eYo.Flyout} flyout
 */
eYo.Dom.prototype.flyoutDispose = function (flyout) {
  if (flyout.dom && flyout.dom.toolbarDiv_) {
    goog.dom.removeNode(flyout.dom.toolbarDiv_)
  }
  this.basicDispose(flyout)
}

/**
 * Initialize the factory SVG ressources.
 * @param {!eYo.Factory} factory
 * @return {!Element} The factory's dom repository.
 */
eYo.Dom.prototype.factoryInit = function(factory) {
  if (factory.dom) {
    return
  }
  var dom = this.basicInit(factory)
  var options = factory.options
  var container = options.container
  // no UI if no valid container
  if (goog.isString(container)) {
    container = options.container = document.getElementById(container) ||
        document.querySelector(container)
  }
  if (!goog.dom.contains(document, container)) {
    throw 'Error: container is not in current document.'
  }
  dom.div_ || (dom.div_= container)
  eYo.Dom.bindEvent(
    container,
    'contextmenu',
    e => eYo.Dom.isTargetInput(e) || e.preventDefault()
  )
  return dom
}

/**
 * Dispose of the factory dom resources.
 * @param {!eYo.Factory} factory
 */
eYo.Dom.prototype.factoryDispose = eYo.Dom.decorateDispose(
  function(factory) {
    var dom = factory.dom
    goog.dom.removeNode(dom.div_)
    dom.div_ = null
  }
)

/**
 * Initialize the workspace dom ressources.
 * @param {!eYo.Workspace} workspace
 * @param {!Element|string} container Containing element, or its ID,
 *     or a CSS selector.
 * @param {Object=} opt_options Optional dictionary of options.
 * @return {!eYo.Workspace} Newly created main workspace.
 */
eYo.Dom.prototype.workspaceInit = eYo.Dom.prototype.basicInit

/**
 * Dispose of the workspace dom ressources.
 * @param {!eYo.Workspace} workspace
 * @return {!Object} The workspace's dom repository.
 */
eYo.Dom.prototype.workspaceDispose = eYo.Dom.prototype.basicDispose

