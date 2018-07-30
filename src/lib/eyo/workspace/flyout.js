/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview Flyout overriden.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict';

goog.provide('eYo.Flyout');
goog.provide('eYo.FlyoutDelegate');

goog.require('eYo.Flyout');
goog.require('eYo.FlyoutCategory');
goog.require('eYo.Style');
goog.require('eYo.Font');
goog.require('Blockly.VerticalFlyout');
goog.require('eYo.DelegateSvg');
goog.require('eYo.FlyoutToolbar');
goog.require('eYo.Tooltip');
goog.require('eYo.MenuRenderer');
goog.require('eYo.MenuButtonRenderer');

goog.require('goog.dom');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Select');


/**
 * Class for a flyout delegate.
 * As usual, we do not want to add keys to blockly objects.
 * @param {!Blockly.Flyout} flyout
 * @constructor
 */
eYo.FlyoutDelegate = function(flyout) {
  this.flyout_ = flyout
  this.closed = false
}

/**
 * Default CSS class of the flyout panel.
 * @type {string}
 */
eYo.FlyoutDelegate.CSS_CLASS = goog.getCssName('eyo-flyout');

/**
 * Returns the CSS class to be applied to the root element.
 * @return {string} Renderer-specific CSS class.
 * @override
 */
eYo.FlyoutDelegate.prototype.getCssClass = function() {
  return eYo.FlyoutDelegate.CSS_CLASS;
};

/**
 * Class for a flyout.
 * @param {!Object} workspaceOptions Dictionary of options for the workspace.
 * @extends {Blockly.Flyout}
 * @constructor
 */
eYo.Flyout = function(workspace) {
  eYo.Flyout.superClass_.constructor.call(this, {parentWorkspace: workspace})
  this.toolboxPosition_ = Blockly.TOOLBOX_AT_LEFT
  workspace.flyout_ = this
  this.eyo = new eYo.FlyoutDelegate(this)
  this.workspace_.eyo.options = workspace.eyo.options
}
goog.inherits(eYo.Flyout, Blockly.VerticalFlyout)

var one_rem = parseInt(getComputedStyle(document.documentElement).fontSize)

eYo.Flyout.prototype.CORNER_RADIUS = 0

eYo.FlyoutDelegate.prototype.TOP_MARGIN = 4 * eYo.FlyoutToolbar.prototype.BUTTON_RADIUS+ 2 * eYo.FlyoutToolbar.prototype.BUTTON_MARGIN
eYo.FlyoutDelegate.prototype.BOTTOM_MARGIN = 16 // scroll bar width

eYo.FlyoutDelegate.prototype.TOP_MARGIN = 4.5 * one_rem

eYo.FlyoutDelegate.prototype.MARGIN = one_rem / 4

/**
 * Creates the flyout's DOM.  Only needs to be called once.  The flyout can
 * either exist as its own svg element or be a g element nested inside a
 * separate svg element.
 * @param {string} tagName The type of tag to put the flyout in. This
 *     should be <svg> or <g>.
 * @return {!Element} The flyout's SVG group.
 */
eYo.Flyout.prototype.createDom = function(tagName) {
  /*
  <svg class="eyo-flyout">
    <g class="eyo-flyout-background">
      <path class="blocklyFlyoutBackground"/>
    </g>
    <g class="eyo-workspace">...</g>
  </svg>
  */
  this.svgGroup_ = Blockly.utils.createSvgElement(tagName,
      {'class': 'eyo-flyout', 'style': 'display: none'}, null);
  this.svgBackground_ = Blockly.utils.createSvgElement('path',
      {'class': 'eyo-flyout-background'}, this.svgGroup_);
  // Bad design: code reuse: options
  var self = this
  eYo.Tooltip.add(this.svgBackground_, eYo.Tooltip.getTitle('flyout'), {
    position: 'right',
    theme: 'light bordered',
    flipDuration: 0,
    inertia: true,
    arrow: true,
    animation: 'perspective',
    duration: [600, 300],
    delay: [750, 0],
    popperOptions: {
      modifiers: {
        preventOverflow: {
          enabled: true
        }
      }
    },
    onShow (instance) {
      eYo.Tooltip.hideAll(self.svgBackground_)
    }
  })
  var g = this.workspace_.createDom()
  goog.dom.classlist.remove(g, 'blocklyWorkspace')
  goog.dom.classlist.add(g, 'eyo-workspace')
  this.svgGroup_.appendChild(g);
  return this.svgGroup_;
};

eYo.setup.register(function () {
  eYo.Style.insertCssRuleAt(
    '.eyo-flyout { position: absolute; z-index: 20; }')
  eYo.Style.insertCssRuleAt(
    '.eyo-flyout-background { fill: #ddd; fill-opacity: .8; }')
  eYo.Style.insertCssRuleAt(
    '.eyo-flyout-scrollbar { z-index: 30; }')
})

/**
 * Dispose of this flyout.
 * Unlink from all DOM elements to prevent memory leaks.
 */
eYo.FlyoutDelegate.prototype.dispose = function() {
  if (this.toolbarDiv_) {
    goog.dom.removeNode(this.toolbarDiv_)
    this.toolbarDiv_ = undefined
  }
};

/**
 * Show and populate the flyout.
 * More tagnames accepted.
 * @param {!Array|string} model List of blocks to show.
 *     Variables and procedures have a custom set of blocks.
 */
eYo.Flyout.prototype.show = function(model) {
  this.workspace_.setResizesEnabled(false);
  eYo.Tooltip.hideAll(this.svgGroup_)
  this.hide();
  this.clearOldBlocks_();

  // Handle dynamic categories, represented by a name instead of a list of XML.
  // Look up the correct category generation function and call that to get a
  // valid XML list.
  if (typeof model == 'string') {
    var fnToApply = this.workspace_.targetWorkspace.getToolboxCategoryCallback(
        model);
    goog.asserts.assert(goog.isFunction(fnToApply),
        'Couldn\'t find a callback function when opening a toolbox category.');
    model = fnToApply(this.workspace_.targetWorkspace);
    goog.asserts.assert(goog.isArray(model),
        'The result of a toolbox category callback must be an array.');
  }

  this.setVisible(true);
  // Create the blocks to be shown in this flyout.
  var contents = [];
  var gaps = [];
  var default_gap = eYo.Font.lineHeight()/4;
 
  this.permanentlyDisabled_.length = 0;
  for (var i = 0, xml; xml = model[i]; i++) {
    if (xml.tagName) {
      var tagName = xml.tagName.toUpperCase();
      if (tagName == 'BLOCK') {
        var curBlock = Blockly.Xml.domToBlock(xml, this.workspace_);
        if (curBlock.disabled) {
          // Record blocks that were initially disabled.
          // Do not enable these blocks as a result of capacity filtering.
          this.permanentlyDisabled_.push(curBlock);
        }
        contents.push({type: 'block', block: curBlock});
        var gap = parseInt(xml.getAttribute('gap'), 10);
        gaps.push(isNaN(gap) ? default_gap : gap);
      } else if (tagName == 'SEP') {
        // Change the gap between two blocks.
        // <sep gap="36"></sep>
        // The default gap is 24, can be set larger or smaller.
        // This overwrites the gap attribute on the previous block.
        // Note that a deprecated method is to add a gap to a block.
        // <block type="math_arithmetic" gap="8"></block>
        var newGap = parseInt(xml.getAttribute('gap'), 10);
        // Ignore gaps before the first block.
        if (!isNaN(newGap) && gaps.length > 0) {
          gaps[gaps.length - 1] = newGap;
        } else {
          gaps.push(default_gap);
        }
      } else if (tagName == 'BUTTON' || tagName == 'LABEL') {
        // Labels behave the same as buttons, but are styled differently.
        var isLabel = tagName == 'LABEL';
        var curButton = new Blockly.FlyoutButton(this.workspace_,
            this.targetWorkspace_, xml, isLabel);
        contents.push({type: 'button', button: curButton});
        gaps.push(default_gap);
      } else if (tagName.startsWith('EYO:')) {
        var curBlock = Blockly.Xml.domToBlock(xml, this.workspace_);
        if (curBlock.disabled) {
          // Record blocks that were initially disabled.
          // Do not enable these blocks as a result of capacity filtering.
          this.permanentlyDisabled_.push(curBlock);
        }
        contents.push({type: 'block', block: curBlock});
        var gap = parseInt(xml.getAttribute('gap'), 10);
        gaps.push(isNaN(gap) ? default_gap : gap);
      }
    } else {
      // this is the part specific to edython
      try {
        var block = eYo.DelegateSvg.newBlockReady(this.workspace_, xml)
        contents.push({type: 'block', block: block})
        block.render()
        block.eyo.addTooltip(block, xml.title || (xml.data && xml.data.main) || xml.data)
        gaps.push(default_gap)
      } catch (err) {
        console.error(xml, err)
        // throw err: catch the error here definitely
      } finally {
        // pass
      }
    }
  }

  this.layout_(contents, gaps);

  // IE 11 is an incompetent browser that fails to fire mouseout events.
  // When the mouse is over the background, deselect all blocks.
  var deselectAll = function() {
    var topBlocks = this.workspace_.getTopBlocks(false);
    for (var i = 0, block; block = topBlocks[i]; i++) {
      block.removeSelect();
    }
  };

  this.listeners_.push(Blockly.bindEventWithChecks_(this.svgBackground_,
      'mouseover', this, deselectAll));

  if (this.horizontalLayout_) {
    this.height_ = 0;
  } else {
    this.width_ = 0;
  }
  this.workspace_.setResizesEnabled(true);
  this.reflow();

  this.filterForCapacity_();

  // Correctly position the flyout's scrollbar when it opens.
  this.position();
  this.reflowWrapper_ = this.reflow.bind(this);
  this.workspace_.addChangeListener(this.reflowWrapper_);
}

/**
 * Add listeners to a block that has been added to the flyout.
 * Listeners work only when the flyout authorizes it.
 * The 'rect' listeners have been removed.
 * @param {!Element} root The root node of the SVG group the block is in.
 * @param {!Blockly.Block} block The block to add listeners for.
 * @param {!Element} rect The invisible rectangle under the block that acts as
 *     a mat for that block.
 * @private
 */
eYo.Flyout.prototype.addBlockListeners_ = function(root, block, rect) {
  this.listeners_.push(Blockly.bindEventWithChecks_(root, 'mousedown', null,
  this.blockMouseDown_(block)
  ));
  var catched = this
  this.listeners_.push(Blockly.bindEvent_(root, 'mouseover', block,
  function(e) {
    if (!catched.isDown) {
      this.addSelect(e)
    }
  }));
  this.listeners_.push(Blockly.bindEvent_(root, 'mouseleave', block,
  block.removeSelect
  ));
};

/**
 * Does the job of sliding the flyout in or out.
 * @param {?Boolean} close  close corresponds to the final state.
 * When not given, toggle the closed state.
 */
eYo.FlyoutDelegate.prototype.doSlide = function(close) {
  if (!goog.isDef(close)) {
    close = !this.closed
  }
  if (!close === !this.closed || this.slide_locked) {
    return
  }
  this.slide_locked = true
  var flyout = this.flyout_
  flyout.setVisible(true);
  var targetWorkspaceMetrics = flyout.targetWorkspace_.getMetrics();
  if (!targetWorkspaceMetrics) {
    // Hidden components will return null.
    return;
  }
  eYo.Tooltip.hideAll(flyout.svgGroup_)
  var id = setInterval(frame, 20);
  var x = targetWorkspaceMetrics.absoluteLeft;
  var n_steps = 50
  var n = 0
  var steps = []
  var positions = []
  var x_min = close? x: x - flyout.width_
  var x_max = close? x - flyout.width_: x
  steps[0] = close? 0: 1
  positions[0] = x_min
  for (n = 1; n < n_steps; n++) {
    var step = Math.sin(n*Math.PI/n_steps/2)**2
    steps[n] = close? step: 1-step
    positions[n] = x_min + step * (x_max - x_min)
  }
  steps[n] = close? 1: 0
  positions[n] = x_max
  var y = targetWorkspaceMetrics.absoluteTop;
  var self = this
  n = 0
  function frame() {
    if (n >= n_steps) {
      clearInterval(id);
      if ((self.closed = close)) {
        flyout.setVisible(false)
      }
      flyout.setBackgroundPath_(flyout.width_, flyout.height_)
      delete self.slide_locked
      flyout.targetWorkspace_.recordDeleteAreas()
      self.oneStep(steps[n_steps])
      self.didSlide(close)
    } else {
      flyout.positionAt_(flyout.width_, flyout.height_, positions[n], y)
      self.oneStep(steps[n])
      // the scrollbar won't resize because the metrics of the workspace did not change
      var hostMetrics = flyout.workspace_.getMetrics()
      if (hostMetrics) {
        flyout.scrollbar_.resizeVertical_(hostMetrics)
      }
      ++n
    }
  }
};

/**
 * Slide the flyout in or out.
 * This 2 levels design allows overwriting.
 * Actually, the ui button calls the slide method.
 * @param {?Boolean} close  close corresponds to the final state.
 * When not given, toggle the closed state.
 */
eYo.FlyoutDelegate.prototype.slide = function(close) {
  this.doSlide(close)
};

/**
 * Subclassers will add there stuff here.
 * @param {number} step betwwen 0 and 1.
 */
eYo.FlyoutDelegate.prototype.oneStep = function(step) {
};

/**
 * Subclassers will add there stuff here.
 * @param {Boolean} closed
 */
eYo.FlyoutDelegate.prototype.didSlide = function(closed) {
};

/**
 * Update the view based on coordinates calculated in position().
 * @param {number} width The computed width of the flyout's SVG group
 * @param {number} height The computed height of the flyout's SVG group.
 * @param {number} x The computed x origin of the flyout's SVG group.
 * @param {number} y The computed y origin of the flyout's SVG group.
 * @private
 */
eYo.Flyout.prototype.positionAt_ = function(width, height, x, y) {
  eYo.Flyout.superClass_.positionAt_.call(this, width, height, x, y)
  this.eyo.toolbar_.div_.style.left = x + 'px'
  this.eyo.toolbar_.div_.style.top = y + 'px'
};

/**
 * Return an object with all the metrics required to size scrollbars for the
 * flyout.  The following properties are computed:
 * .viewHeight: Height of the visible rectangle,
 * .viewWidth: Width of the visible rectangle,
 * .contentHeight: Height of the contents,
 * .contentWidth: Width of the contents,
 * .viewTop: Offset of top edge of visible rectangle from parent,
 * .contentTop: Offset of the top-most content from the y=0 coordinate,
 * .absoluteTop: Top-edge of view.
 * .viewLeft: Offset of the left edge of visible rectangle from parent,
 * .contentLeft: Offset of the left-most content from the x=0 coordinate,
 * .absoluteLeft: Left-edge of view.
 * @return {Object} Contains size and position metrics of the flyout.
 * @private
 */
eYo.Flyout.prototype.getMetrics_ = function() {
  if (!this.isVisible()) {
    // Flyout is hidden.
    return null;
  }

  try {
    var optionBox = this.workspace_.getCanvas().getBBox();
  } catch (e) {
    // Firefox has trouble with hidden elements (Bug 528969).
    var optionBox = {height: 0, y: 0, width: 0, x: 0};
  }

  // Padding for the end of the scrollbar.
  var absoluteTop = this.SCROLLBAR_PADDING + this.eyo.TOP_MARGIN;
  var absoluteLeft = 0;

  var viewHeight = this.height_ - 2 * this.SCROLLBAR_PADDING - this.eyo.TOP_MARGIN - this.eyo.BOTTOM_MARGIN;
  if (viewHeight < 0) {
    viewHeight = 0
  }
  var viewWidth = this.width_;
  if (!this.RTL) {
    viewWidth -= this.SCROLLBAR_PADDING;
  }

  var metrics = {
    viewHeight: viewHeight,
    viewWidth: viewWidth,
    contentHeight: optionBox.height * this.workspace_.scale + 2 * this.MARGIN,
    contentWidth: optionBox.width * this.workspace_.scale + 2 * this.MARGIN,
    viewTop: -this.workspace_.scrollY + optionBox.y + this.eyo.TOP_MARGIN,
    viewLeft: -this.workspace_.scrollX,
    contentTop: optionBox.y + this.eyo.TOP_MARGIN,
    contentLeft: optionBox.x,
    absoluteTop: absoluteTop,
    absoluteLeft: absoluteLeft
  };
  return metrics;
};

/**
 * Create and set the path for the visible boundaries of the flyout.
 * @param {number} width The width of the flyout, not including the
 *     rounded corners.
 * @param {number} height The height of the flyout, not including
 *     rounded corners.
 * @private
 */
eYo.Flyout.prototype.setBackgroundPath_ = function(width, height) {

  var top_margin = this.eyo.TOP_MARGIN
  
  var atRight = this.toolboxPosition_ == Blockly.TOOLBOX_AT_RIGHT;
  var totalWidth = width + this.CORNER_RADIUS;

  // Decide whether to start on the left or right.
  var path = ['M ' + (atRight ? totalWidth : 0) + ',' + top_margin + ''];
  // Top.
  path.push('h', atRight ? -width : width);
  // Rounded corner.
  path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0,
      atRight ? 0 : 1,
      atRight ? -this.CORNER_RADIUS : this.CORNER_RADIUS,
      this.CORNER_RADIUS);
  // Side closest to workspace.
  path.push('v', Math.max(0, height - top_margin));
  // Rounded corner.
  path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0,
      atRight ? 0 : 1,
      atRight ? this.CORNER_RADIUS : -this.CORNER_RADIUS,
      this.CORNER_RADIUS);
  // Bottom.
  path.push('h', atRight ? width : -width);
  path.push('z');
  this.svgBackground_.setAttribute('d', path.join(' '));

  if (!this.eyo.toolbar_) {
    this.eyo.toolbar_ = new eYo.FlyoutToolbar(this)
    var div = this.eyo.toolbar_.createDom()
    goog.dom.insertSiblingAfter(div, this.svgGroup_)
    this.eyo.toolbar_.doSelectGeneral(null)
  }
  this.eyo.toolbar_.resize(width, height)
};

/**
 * Copy a block from the flyout to the workspace and position it correctly.
 * Edython adds a full rendering process.
 * No rendering is made while blocks are dragging.
 * @param {!Blockly.Block} oldBlock The flyout block to copy.
 * @return {!Blockly.Block} The new block in the main workspace.
 * @private
 */
eYo.Flyout.prototype.placeNewBlock_ = function(oldBlock) {
  var block = eYo.Flyout.superClass_.placeNewBlock_.call(this, oldBlock)
  block.setConnectionsHidden(false)
  return block;
};

/**
 * List of node models by category.
 * @param {!String} category The name of the category to retrieve.
 */
eYo.FlyoutDelegate.prototype.getList = function (category) {
  return eYo.FlyoutCategory[category] || []
}
