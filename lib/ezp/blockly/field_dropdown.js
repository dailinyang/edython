/**
 * @license
 * ezPython
 *
 * Copyright 2017 Jérôme LAURENS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Dropdown input field adapted to ezPython.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict';

goog.provide('ezP.FieldDropdown');

goog.require('Blockly.FieldDropdown');


/**
 * Class for an editable dropdown field.
 * @param {(!Array.<!Array>|!Function)} menuGenerator An array of options
 *     for a dropdown list, or a function which generates these options.
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected, with the newly selected value as its sole argument.
 *     If it returns a value, that value (which must be one of the options) will
 *     become selected in place of the newly selected option, unless the return
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
ezP.FieldDropdown = function(menuGenerator, opt_validator) {
  ezP.FieldDropdown.superClass_.constructor.call(this, menuGenerator, opt_validator);
};
goog.inherits(ezP.FieldDropdown, Blockly.FieldDropdown);
//

ezP.FieldDropdown.CSS_CLASS = 'ezp_no_options';

///**
// * Install this dropdown on a block.
// */
//ezP.FieldDropdown.prototype.init = function() {
//  ezP.FieldDropdown.superClass_.init.call(this);
//};

/**
 * Install this dropdown on a block.
 */
ezP.FieldDropdown.prototype.init = function() {
  ezP.FieldDropdown.superClass_.init.call(this);
  this.textElement_.setAttribute('y',ezP.Font.totalAscent);
};

// ezP.FieldDropdown.prototype.init = function() {
//   if (this.fieldGroup_) {
//     // Field has already been initialized once.
//     return;
//   }
//   // Build the DOM.
//   this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
//   if (!this.visible_) {
//     this.fieldGroup_.style.display = 'none';
//   }
//   /** @type {!Element} */
//   this.textElement_ = Blockly.utils.createSvgElement('text',
//       {'class': 'blocklyText', 'y': ezP.Font.totalAscent},
//       this.fieldGroup_);
//
//   this.updateEditable();
//   this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
//   this.mouseDownWrapper_ =
//       Blockly.bindEventWithChecks_(this.fieldGroup_, 'mousedown', this,
//       this.onMouseDown_);
//   // Force a render.
//   this.render_();
// };

///**
// * Create a dropdown menu under the text.
// * @private
// */
//ezP.FieldDropdown.prototype.showEditor_ = function() {
//  Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, null);
//  var menu = this.createMenu_();
//  this.addEventListeners_(menu);
//  this.positionMenu_(menu);
//};

///**
// * Add event listeners for actions on the items in the dropdown menu.
// * @param {!goog.ui.Menu} menu The menu to add listeners to.
// * @private
// */
//ezP.FieldDropdown.prototype.addEventListeners_ = function(menu) {
//  this.addActionListener_(menu);
//  this.addTouchStartListener_(menu);
//  this.addTouchEndListener_(menu);
//};

///**
// * Add a listener for mouse and keyboard events in the menu and its items.
// * @param {!goog.ui.Menu} menu The menu to add listeners to.
// * @private
// */
//ezP.FieldDropdown.prototype.addActionListener_ = function(menu) {
//  var thisField = this;
//
//  function callback(e) {
//    var menu = this;
//    var menuItem = e.target;
//    if (menuItem) {
//      thisField.onItemSelected(menu, menuItem);
//    }
//    Blockly.WidgetDiv.hideIfOwner(thisField);
//    Blockly.Events.setGroup(false);
//  }
//  // Listen for mouse/keyboard events.
//  goog.events.listen(menu, goog.ui.Component.EventType.ACTION, callback);
//};

///**
// * Add a listener for touch start events on menu items.
// * @param {!goog.ui.Menu} menu The menu to add the listener to.
// * @private
// */
//ezP.FieldDropdown.prototype.addTouchStartListener_ = function(menu) {
//  // Listen for touch events (why doesn't Closure handle this already?).
//  function callback(e) {
//    var control = this.getOwnerControl(/** @type {Node} */ (e.target));
//    // Highlight the menu item.
//    control.handleMouseDown(e);
//  }
//  menu.getHandler().listen(menu.getElement(), goog.events.EventType.TOUCHSTART,
//                           callback);
//};

///**
// * Add a listener for touch end events on menu items.
// * @param {!goog.ui.Menu} menu The menu to add the listener to.
// * @private
// */
//ezP.FieldDropdown.prototype.addTouchEndListener_ = function(menu) {
//  // Listen for touch events (why doesn't Closure handle this already?).
//  function callbackTouchEnd(e) {
//    var control = this.getOwnerControl(/** @type {Node} */ (e.target));
//    // Activate the menu item.
//    control.performActionInternal(e);
//  }
//  menu.getHandler().listen(menu.getElement(), goog.events.EventType.TOUCHEND,
//                           callbackTouchEnd);
//};

///**
// * Create and populate the menu and menu items for this dropdown, based on
// * the options list.
// * @return {!goog.ui.Menu} The populated dropdown menu.
// * @private
// */
//ezP.FieldDropdown.prototype.createMenu_ = function() {
//  var menu = new goog.ui.Menu();
//  menu.setRightToLeft(this.sourceBlock_.RTL);
//  var options = this.getOptions();
//  for (var i = 0; i < options.length; i++) {
//    var content = options[i][0]; // Human-readable text or image.
//    var value = options[i][1];   // Language-neutral value.
//    if (typeof content == 'object') {
//      // An image, not text.
//      var image = new Image(content['width'], content['height']);
//      image.src = content['src'];
//      image.alt = content['alt'] || '';
//      content = image;
//    }
//    var menuItem = new goog.ui.MenuItem(content);
//    menuItem.setRightToLeft(this.sourceBlock_.RTL);
//    menuItem.setValue(value);
//    menuItem.setCheckable(true);
//    menu.addChild(menuItem, true);
//    menuItem.setChecked(value == this.value_);
//  }
//  return menu;
//};

///**
// * Place the menu correctly on the screen, taking into account the dimensions
// * of the menu and the dimensions of the screen so that it doesn't run off any
// * edges.
// * @param {!goog.ui.Menu} menu The menu to position.
// * @private
// */
//ezP.FieldDropdown.prototype.positionMenu_ = function(menu) {
//  // Record viewport dimensions before adding the dropdown.
//  var viewportBBox = Blockly.utils.getViewportBBox();
//  var anchorBBox = this.getAnchorDimensions_();
//
//  this.createWidget_(menu);
//  var menuSize = Blockly.utils.uiMenu.getSize(menu);
//
//  if (this.sourceBlock_.RTL) {
//    Blockly.utils.uiMenu.adjustBBoxesForRTL(viewportBBox, anchorBBox, menuSize);
//  }
//  // Position the menu.
//  Blockly.WidgetDiv.positionWithAnchor(viewportBBox, anchorBBox, menuSize,
//      this.sourceBlock_.RTL);
//  // Calling menuDom.focus() has to wait until after the menu has been placed
//  // correctly.  Otherwise it will cause a page scroll to get the misplaced menu
//  // in view.  See issue #1329.
//  menu.getElement().focus();
//};


/**
* Create and render the menu widget inside Blockly's widget div.
* @param {!goog.ui.Menu} menu The menu to add to the widget div.
* @private
*/
ezP.FieldDropdown.prototype.createWidget_ = function(menu) {
 ezP.FieldDropdown.superClass_.createWidget_.call(this, menu);
 Blockly.utils.addClass(menu.getElement(), ezP.FieldDropdown.CSS_CLASS);
};

/**
* JL: No check mark.
* @returns {!Object} The bounding rectangle of the anchor, in window
*     coordinates.
* @private
*/
ezP.FieldDropdown.prototype.getAnchorDimensions_ = function() {
 var boundingBox = this.getScaledBBox_();
 // if (this.sourceBlock_.RTL) {
 //   boundingBox.right += Blockly.FieldDropdown.CHECKMARK_OVERHANG;
 // } else {
 //   boundingBox.left -= Blockly.FieldDropdown.CHECKMARK_OVERHANG;
 // }

 return boundingBox;
};

///**
// * Handle the selection of an item in the dropdown menu.
// * @param {!goog.ui.Menu} menu The Menu component clicked.
// * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
// */
//ezP.FieldDropdown.prototype.onItemSelected = function(menu, menuItem) {
//  var value = menuItem.getValue();
//  if (this.sourceBlock_) {
//    // Call any validation function, and allow it to override.
//    value = this.callValidator(value);
//  }
//  if (value !== null) {
//    this.setValue(value);
//  }
//};

///**
// * Factor out common words in statically defined options.
// * Create prefix and/or suffix labels.
// * @private
// */
//ezP.FieldDropdown.prototype.trimOptions_ = function() {
//  this.prefixField = null;
//  this.suffixField = null;
//  var options = this.menuGenerator_;
//  if (!goog.isArray(options)) {
//    return;
//  }
//  var hasImages = false;
//
//  // Localize label text and image alt text.
//  for (var i = 0; i < options.length; i++) {
//    var label = options[i][0];
//    if (typeof label == 'string') {
//      options[i][0] = Blockly.utils.replaceMessageReferences(label);
//    } else {
//      if (label.alt != null) {
//        options[i][0].alt = Blockly.utils.replaceMessageReferences(label.alt);
//      }
//      hasImages = true;
//    }
//  }
//  if (hasImages || options.length < 2) {
//    return;  // Do nothing if too few items or at least one label is an image.
//  }
//  var strings = [];
//  for (var i = 0; i < options.length; i++) {
//    strings.push(options[i][0]);
//  }
//  var shortest = Blockly.utils.shortestStringLength(strings);
//  var prefixLength = Blockly.utils.commonWordPrefix(strings, shortest);
//  var suffixLength = Blockly.utils.commonWordSuffix(strings, shortest);
//  if (!prefixLength && !suffixLength) {
//    return;
//  }
//  if (shortest <= prefixLength + suffixLength) {
//    // One or more strings will entirely vanish if we proceed.  Abort.
//    return;
//  }
//  if (prefixLength) {
//    this.prefixField = strings[0].substring(0, prefixLength - 1);
//  }
//  if (suffixLength) {
//    this.suffixField = strings[0].substr(1 - suffixLength);
//  }
//
//  this.menuGenerator_ = Blockly.FieldDropdown.applyTrim_(options, prefixLength,
//      suffixLength);
//};

///**
// * Use the calculated prefix and suffix lengths to trim all of the options in
// * the given array.
// * @param {!Array.<!Array>} options Array of option tuples:
// *     (human-readable text or image, language-neutral name).
// * @param {number} prefixLength The length of the common prefix.
// * @param {number} suffixLength The length of the common suffix
// * @return {!Array.<!Array>} A new array with all of the option text trimmed.
// */
//Blockly.FieldDropdown.applyTrim_ = function(options, prefixLength, suffixLength) {
//  var newOptions = [];
//  // Remove the prefix and suffix from the options.
//  for (var i = 0; i < options.length; i++) {
//    var text = options[i][0];
//    var value = options[i][1];
//    text = text.substring(prefixLength, text.length - suffixLength);
//    newOptions[i] = [text, value];
//  }
//  return newOptions;
//};

///**
// * @return {boolean} True if the option list is generated by a function.
// *     Otherwise false.
// */
//ezP.FieldDropdown.prototype.isOptionListDynamic = function() {
//  return goog.isFunction(this.menuGenerator_);
//};

///**
// * Return a list of the options for this dropdown.
// * @return {!Array.<!Array>} Array of option tuples:
// *     (human-readable text or image, language-neutral name).
// */
//ezP.FieldDropdown.prototype.getOptions = function() {
//  if (goog.isFunction(this.menuGenerator_)) {
//    return this.menuGenerator_.call(this);
//  }
//  return /** @type {!Array.<!Array.<string>>} */ (this.menuGenerator_);
//};

///**
// * Get the language-neutral value from this dropdown menu.
// * @return {string} Current text.
// */
//ezP.FieldDropdown.prototype.getValue = function() {
//  return this.value_;
//};

///**
// * Set the language-neutral value for this dropdown menu.
// * @param {string} newValue New value to set.
// */
//ezP.FieldDropdown.prototype.setValue = function(newValue) {
//  if (newValue === null || newValue === this.value_) {
//    return;  // No change if null.
//  }
//  if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
//    Blockly.Events.fire(new Blockly.Events.BlockChange(
//        this.sourceBlock_, 'field', this.name, this.value_, newValue));
//  }
//  this.value_ = newValue;
//  // Look up and display the human-readable text.
//  var options = this.getOptions();
//  for (var i = 0; i < options.length; i++) {
//    // Options are tuples of human-readable text and language-neutral values.
//    if (options[i][1] == newValue) {
//      var content = options[i][0];
//      if (typeof content == 'object') {
//        this.imageJson_ = content;
//        this.text_ = content.alt;
//      } else {
//        this.imageJson_ = null;
//        this.text_ = content;
//      }
//      // Always rerender if either the value or the text has changed.
//      this.forceRerender();
//      return;
//    }
//  }
//  // Value not found.  Add it, maybe it will become valid once set
//  // (like variable names).
//  this.text_ = newValue;
//  this.forceRerender();
//};

/**
 * Draws the border with the correct width.
 * JL: arrow colour
 * @private
 */
ezP.FieldDropdown.prototype.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0;
    return;
  }
  if (this.sourceBlock_ && this.arrow_) {
    // Update arrow's colour.
    this.arrow_.style.fill = ezP.Style.Arrow.colour;
  }
  goog.dom.removeChildren(/** @type {!Element} */ (this.textElement_));
  goog.dom.removeNode(this.imageElement_);
  this.imageElement_ = null;

  if (this.imageJson_) {
    this.renderSelectedImage_();
  } else {
    this.renderSelectedText_();
  }
};

///**
// * Renders the selected option, which must be an image.
// * @private
// */
//ezP.FieldDropdown.prototype.renderSelectedImage_ = function() {
//  // Image option is selected.
//  this.imageElement_ = Blockly.utils.createSvgElement('image',
//      {'y': 5,
//       'height': this.imageJson_.height + 'px',
//       'width': this.imageJson_.width + 'px'}, this.fieldGroup_);
//  this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
//                                    'xlink:href', this.imageJson_.src);
//  // Insert dropdown arrow.
//  this.textElement_.appendChild(this.arrow_);
//  var arrowWidth = Blockly.Field.getCachedWidth(this.arrow_);
//  this.size_.height = Number(this.imageJson_.height) + 19;
//  this.size_.width = Number(this.imageJson_.width) + arrowWidth;
//  if (this.sourceBlock_.RTL) {
//    this.imageElement_.setAttribute('x', arrowWidth);
//    this.textElement_.setAttribute('x', -1);
//  } else {
//    this.textElement_.setAttribute('text-anchor', 'end');
//    this.textElement_.setAttribute('x', this.size_.width + 1);
//  }
//};

///**
// * Renders the selected option, which must be text.
// * @private
// */
//ezP.FieldDropdown.prototype.renderSelectedText_ = function() {
//  // Text option is selected.
//  // Replace the text.
//  var textNode = document.createTextNode(this.getDisplayText_());
//  this.textElement_.appendChild(textNode);
//  // Insert dropdown arrow.
//  if (this.sourceBlock_.RTL) {
//    this.textElement_.insertBefore(this.arrow_, this.textElement_.firstChild);
//  } else {
//    this.textElement_.appendChild(this.arrow_);
//  }
//  this.textElement_.setAttribute('text-anchor', 'start');
//  this.textElement_.setAttribute('x', 0);
//
//  this.size_.height = Blockly.BlockSvg.MIN_BLOCK_Y;
//  this.size_.width = Blockly.Field.getCachedWidth(this.textElement_);
//};

///**
// * Updates the width of the field. Overrides field.prototype.updateWidth to
// * deal with image selections on IE and Edge. If the selected item is not an
// * image, or if the browser is not IE / Edge, this simply calls the parent
// * implementation.
// */
//ezP.FieldDropdown.prototype.updateWidth = function() {
//  if (this.imageJson_ && (goog.userAgent.IE || goog.userAgent.EDGE)) {
//    // Recalculate the full width.
//    var arrowWidth = Blockly.Field.getCachedWidth(this.arrow_);
//    var width = Number(this.imageJson_.width) + arrowWidth + Blockly.BlockSvg.SEP_SPACE_X;
//    if (this.borderRect_) {
//      this.borderRect_.setAttribute('width', width);
//    }
//    this.size_.width = width;
//  } else {
//    Blockly.Field.prototype.updateWidth.call(this);
//  }
//};

///**
// * Close the dropdown menu if this input is being deleted.
// */
//ezP.FieldDropdown.prototype.dispose = function() {
//  Blockly.WidgetDiv.hideIfOwner(this);
//  ezP.FieldDropdown.superClass_.dispose.call(this);
//};
