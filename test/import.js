var fs = require('fs')
var vm = require('vm')

// all paths here are relative to the project root
// at least where npm is run from the project root

var import_file = (path) => {
  try {
    var code = fs.readFileSync(path)
    vm.runInThisContext(code)  
  } catch(err) {
    console.error('FAILURE', path)
    throw err
  }
}

import_file("src/lib/xregexp-all/xregexp-all.js")
import_file("src/lib/closure-library/closure/goog/base.js")

global.window = {}
global.document = process

// DO NOT EDIT NEXT LINE
// DYNAMIC DEPS START
import_file("src/lib/closure-library/closure/goog/promise/thenable.js")
import_file("src/lib/closure-library/closure/goog/a11y/aria/attributes.js")
import_file("src/lib/closure-library/closure/goog/a11y/aria/roles.js")
import_file("src/lib/closure-library/closure/goog/async/freelist.js")
import_file("src/lib/closure-library/closure/goog/color/names.js")
import_file("src/lib/closure-library/closure/goog/date/datelike.js")
import_file("src/lib/closure-library/closure/goog/debug/error.js")
import_file("src/lib/closure-library/closure/goog/debug/logrecord.js")
import_file("src/lib/closure-library/closure/goog/debug/errorcontext.js")
import_file("src/lib/closure-library/closure/goog/disposable/idisposable.js")
import_file("src/lib/closure-library/closure/goog/dom/htmlelement.js")
import_file("src/lib/closure-library/closure/goog/dom/inputtype.js")
import_file("src/lib/closure-library/closure/goog/dom/nodetype.js")
import_file("src/lib/closure-library/closure/goog/dom/animationframe/polyfill.js")
import_file("src/lib/closure-library/closure/goog/events/eventid.js")
import_file("src/lib/closure-library/closure/goog/fs/url.js")
import_file("src/lib/closure-library/closure/goog/functions/functions.js")
import_file("src/lib/closure-library/closure/goog/fx/transition.js")
import_file("src/lib/closure-library/closure/goog/i18n/datetimepatterns.js")
import_file("src/lib/closure-library/closure/goog/i18n/datetimesymbols.js")
import_file("src/lib/closure-library/closure/goog/i18n/bidi.js")
import_file("src/lib/closure-library/closure/goog/math/affinetransform.js")
import_file("src/lib/closure-library/closure/goog/math/irect.js")
import_file("src/lib/closure-library/closure/goog/math/size.js")
import_file("src/lib/closure-library/closure/goog/object/object.js")
import_file("src/lib/closure-library/closure/goog/positioning/abstractposition.js")
import_file("src/lib/closure-library/closure/goog/promise/resolver.js")
import_file("src/lib/closure-library/closure/goog/reflect/reflect.js")
import_file("src/lib/closure-library/closure/goog/string/string.js")
import_file("src/lib/closure-library/closure/goog/string/stringbuffer.js")
import_file("src/lib/closure-library/closure/goog/string/typedstring.js")
import_file("src/lib/closure-library/closure/goog/ui/buttonside.js")
import_file("src/lib/closure-library/closure/goog/ui/controlcontent.js")
import_file("src/lib/closure-library/closure/goog/ui/datepickerrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/cssnames.js")
import_file("src/lib/closure-library/closure/goog/ui/idgenerator.js")
import_file("src/lib/closure-library/closure/goog/disposable/disposable.js")
import_file("src/lib/closure-library/closure/goog/a11y/aria/datatables.js")
import_file("src/lib/closure-library/closure/goog/asserts/asserts.js")
import_file("src/lib/closure-library/closure/goog/dom/tagname.js")
import_file("src/lib/closure-library/closure/goog/dom/animationframe/animationframe.js")
import_file("src/lib/closure-library/closure/goog/dom/tags.js")
import_file("src/lib/closure-library/closure/goog/events/listenable.js")
import_file("src/lib/closure-library/closure/goog/labs/useragent/util.js")
import_file("src/lib/closure-library/closure/goog/array/array.js")
import_file("src/lib/closure-library/closure/goog/async/workqueue.js")
import_file("src/lib/closure-library/closure/goog/date/date.js")
import_file("src/lib/closure-library/closure/goog/debug/entrypointregistry.js")
import_file("src/lib/closure-library/closure/goog/debug/logbuffer.js")
import_file("src/lib/closure-library/closure/goog/dom/asserts.js")
import_file("src/lib/closure-library/closure/goog/events/event.js")
import_file("src/lib/closure-library/closure/goog/events/listener.js")
import_file("src/lib/closure-library/closure/goog/labs/useragent/platform.js")
import_file("src/lib/closure-library/closure/goog/string/const.js")
import_file("src/lib/closure-library/closure/goog/dom/classlist.js")
import_file("src/lib/closure-library/closure/goog/events/listenermap.js")
import_file("src/lib/closure-library/closure/goog/html/safescript.js")
import_file("src/lib/closure-library/closure/goog/html/trustedresourceurl.js")
import_file("src/lib/closure-library/closure/goog/i18n/timezone.js")
import_file("src/lib/closure-library/closure/goog/labs/useragent/browser.js")
import_file("src/lib/closure-library/closure/goog/labs/useragent/engine.js")
import_file("src/lib/closure-library/closure/goog/math/math.js")
import_file("src/lib/closure-library/closure/goog/structs/structs.js")
import_file("src/lib/closure-library/closure/goog/async/nexttick.js")
import_file("src/lib/closure-library/closure/goog/color/color.js")
import_file("src/lib/closure-library/closure/goog/html/safeurl.js")
import_file("src/lib/closure-library/closure/goog/i18n/datetimeformat.js")
import_file("src/lib/closure-library/closure/goog/iter/iter.js")
import_file("src/lib/closure-library/closure/goog/math/coordinate.js")
import_file("src/lib/closure-library/closure/goog/structs/trie.js")
import_file("src/lib/closure-library/closure/goog/ui/registry.js")
import_file("src/lib/closure-library/closure/goog/useragent/useragent.js")
import_file("src/lib/closure-library/closure/goog/async/run.js")
import_file("src/lib/closure-library/closure/goog/date/daterange.js")
import_file("src/lib/closure-library/closure/goog/debug/debug.js")
import_file("src/lib/closure-library/closure/goog/dom/browserfeature.js")
import_file("src/lib/closure-library/closure/goog/dom/vendor.js")
import_file("src/lib/closure-library/closure/goog/events/browserfeature.js")
import_file("src/lib/closure-library/closure/goog/events/keycodes.js")
import_file("src/lib/closure-library/closure/goog/html/safestyle.js")
import_file("src/lib/closure-library/closure/goog/math/box.js")
import_file("src/lib/closure-library/closure/goog/structs/map.js")
import_file("src/lib/closure-library/closure/goog/useragent/platform.js")
import_file("src/lib/closure-library/closure/goog/useragent/product.js")
import_file("src/lib/closure-library/closure/goog/promise/promise.js")
import_file("src/lib/closure-library/closure/goog/debug/logger.js")
import_file("src/lib/closure-library/closure/goog/events/eventtype.js")
import_file("src/lib/closure-library/closure/goog/html/safestylesheet.js")
import_file("src/lib/closure-library/closure/goog/math/rect.js")
import_file("src/lib/closure-library/closure/goog/ui/tree/typeahead.js")
import_file("src/lib/closure-library/closure/goog/useragent/product_isversion.js")
import_file("src/lib/closure-library/closure/goog/events/browserevent.js")
import_file("src/lib/closure-library/closure/goog/html/safehtml.js")
import_file("src/lib/closure-library/closure/goog/log/log.js")
import_file("src/lib/closure-library/closure/goog/dom/safe.js")
import_file("src/lib/closure-library/closure/goog/events/events.js")
import_file("src/lib/closure-library/closure/goog/html/uncheckedconversions.js")
import_file("src/lib/closure-library/closure/goog/dom/dom.js")
import_file("src/lib/closure-library/closure/goog/events/eventhandler.js")
import_file("src/lib/closure-library/closure/goog/events/eventtarget.js")
import_file("src/lib/closure-library/closure/goog/timer/timer.js")
import_file("src/lib/closure-library/closure/goog/a11y/aria/aria.js")
import_file("src/lib/closure-library/closure/goog/cssom/cssom.js")
import_file("src/lib/closure-library/closure/goog/dom/tagiterator.js")
import_file("src/lib/closure-library/closure/goog/dom/iframe.js")
import_file("src/lib/closure-library/closure/goog/events/focushandler.js")
import_file("src/lib/closure-library/closure/goog/events/keyhandler.js")
import_file("src/lib/closure-library/closure/goog/style/style.js")
import_file("src/lib/closure-library/closure/goog/ui/defaultdatepickerrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/selectionmodel.js")
import_file("src/lib/closure-library/closure/goog/dom/nodeiterator.js")
import_file("src/lib/closure-library/closure/goog/style/bidi.js")
import_file("src/lib/closure-library/closure/goog/ui/component.js")
import_file("src/lib/closure-library/closure/goog/ui/containerrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/modalariavisibilityhelper.js")
import_file("src/lib/closure-library/closure/goog/ui/popupbase.js")
import_file("src/lib/closure-library/closure/goog/fx/dragger.js")
import_file("src/lib/closure-library/closure/goog/positioning/positioning.js")
import_file("src/lib/closure-library/closure/goog/ui/controlrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/datepicker.js")
import_file("src/lib/closure-library/closure/goog/ui/modalpopup.js")
import_file("src/lib/closure-library/closure/goog/ui/tree/basenode.js")
import_file("src/lib/closure-library/closure/goog/positioning/anchoredposition.js")
import_file("src/lib/closure-library/closure/goog/positioning/clientposition.js")
import_file("src/lib/closure-library/closure/goog/ui/buttonrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/control.js")
import_file("src/lib/closure-library/closure/goog/ui/dialog.js")
import_file("src/lib/closure-library/closure/goog/ui/menuheaderrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/menuitemrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/menuseparatorrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/paletterenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/tree/treenode.js")
import_file("src/lib/closure-library/closure/goog/positioning/anchoredviewportposition.js")
import_file("src/lib/closure-library/closure/goog/positioning/viewportclientposition.js")
import_file("src/lib/closure-library/closure/goog/ui/container.js")
import_file("src/lib/closure-library/closure/goog/ui/custombuttonrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/menuheader.js")
import_file("src/lib/closure-library/closure/goog/ui/menuitem.js")
import_file("src/lib/closure-library/closure/goog/ui/nativebuttonrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/palette.js")
import_file("src/lib/closure-library/closure/goog/ui/separator.js")
import_file("src/lib/closure-library/closure/goog/ui/tree/treecontrol.js")
import_file("src/lib/closure-library/closure/goog/positioning/menuanchoredposition.js")
import_file("src/lib/closure-library/closure/goog/ui/button.js")
import_file("src/lib/closure-library/closure/goog/ui/colorpalette.js")
import_file("src/lib/closure-library/closure/goog/ui/menurenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/menuseparator.js")
import_file("src/lib/closure-library/closure/goog/ui/colorpicker.js")
import_file("src/lib/closure-library/closure/goog/ui/menu.js")
import_file("src/lib/closure-library/closure/goog/ui/menubuttonrenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/popupmenu.js")
import_file("src/lib/closure-library/closure/goog/ui/submenurenderer.js")
import_file("src/lib/closure-library/closure/goog/ui/menubutton.js")
import_file("src/lib/closure-library/closure/goog/ui/submenu.js")
import_file("src/lib/closure-library/closure/goog/ui/select.js")
import_file("src/lib/blockly/core/blocks.js")
import_file("src/lib/blockly/core/css.js")
import_file("src/lib/blockly/core/msg.js")
import_file("src/lib/blockly/core/names.js")
import_file("src/lib/blockly/core/options.js")
import_file("src/lib/blockly/core/constants.js")
import_file("src/lib/blockly/core/ui_menu_utils.js")
import_file("src/lib/blockly/core/bubble_dragger.js")
import_file("src/lib/blockly/core/events.js")
import_file("src/lib/blockly/core/workspace_audio.js")
import_file("src/lib/blockly/core/workspace_dragger.js")
import_file("src/lib/blockly/core/events_abstract.js")
import_file("src/lib/blockly/core/flyout_dragger.js")
import_file("src/lib/blockly/core/block_events.js")
import_file("src/lib/blockly/core/ui_events.js")
import_file("src/lib/blockly/core/variable_events.js")
import_file("src/lib/blockly/core/variable_map.js")
import_file("src/lib/blockly/core/variable_model.js")
import_file("src/lib/blockly/core/touch.js")
import_file("src/lib/blockly/core/workspace.js")
import_file("src/lib/blockly/core/bubble.js")
import_file("src/lib/blockly/core/connection.js")
import_file("src/lib/blockly/core/flyout_button.js")
import_file("src/lib/blockly/core/icon.js")
import_file("src/lib/blockly/core/scrollbar.js")
import_file("src/lib/blockly/core/tooltip.js")
import_file("src/lib/blockly/core/variables.js")
import_file("src/lib/blockly/core/xml.js")
import_file("src/lib/blockly/core/zoom_controls.js")
import_file("src/lib/blockly/core/utils.js")
import_file("src/lib/blockly/core/block_drag_surface.js")
import_file("src/lib/blockly/core/comment.js")
import_file("src/lib/blockly/core/connection_db.js")
import_file("src/lib/blockly/core/grid.js")
import_file("src/lib/blockly/core/rendered_connection.js")
import_file("src/lib/blockly/core/trashcan.js")
import_file("src/lib/blockly/core/variables_dynamic.js")
import_file("src/lib/blockly/core/warning.js")
import_file("src/lib/blockly/core/widgetdiv.js")
import_file("src/lib/blockly/core/workspace_drag_surface_svg.js")
import_file("src/lib/blockly/core/dragged_connection_manager.js")
import_file("src/lib/blockly/core/block_dragger.js")
import_file("src/lib/blockly/core/gesture.js")
import_file("src/lib/blockly/core/field.js")
import_file("src/lib/blockly/core/touch_gesture.js")
import_file("src/lib/blockly/core/field_checkbox.js")
import_file("src/lib/blockly/core/field_image.js")
import_file("src/lib/blockly/core/field_label.js")
import_file("src/lib/blockly/core/field_textinput.js")
import_file("src/lib/blockly/core/procedures.js")
import_file("src/lib/blockly/core/workspace_svg.js")
import_file("src/lib/blockly/core/contextmenu.js")
import_file("src/lib/blockly/core/field_angle.js")
import_file("src/lib/blockly/core/field_colour.js")
import_file("src/lib/blockly/core/field_dropdown.js")
import_file("src/lib/blockly/core/field_number.js")
import_file("src/lib/blockly/core/input.js")
import_file("src/lib/blockly/core/mutator.js")
import_file("src/lib/blockly/core/inject.js")
import_file("src/lib/blockly/core/extensions.js")
import_file("src/lib/blockly/core/field_variable.js")
import_file("src/lib/blockly/core/block.js")
import_file("src/lib/blockly/core/block_svg.js")
import_file("src/lib/blockly/core/flyout_base.js")
import_file("src/lib/blockly/core/generator.js")
import_file("src/lib/blockly/core/block_render_svg.js")
import_file("src/lib/blockly/core/flyout_horizontal.js")
import_file("src/lib/blockly/core/flyout_vertical.js")
import_file("src/lib/blockly/core/toolbox.js")
import_file("src/lib/eyo/js/core/eyo.js")
import_file("src/lib/eyo/js/parser/bitset.js")
import_file("src/lib/eyo/js/core/decorate.js")
import_file("src/lib/eyo/js/core/do.js")
import_file("src/lib/eyo/Include/errcode.js")
import_file("src/lib/eyo/js/core/ui.js")
import_file("src/lib/eyo/msg/js/base.js")
import_file("src/lib/eyo/js/application/options.js")
import_file("src/lib/eyo/js/core/protocol.js")
import_file("src/lib/eyo/js/other/scaler.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/span.js")
import_file("src/lib/eyo/js/core/T3.js")
import_file("src/lib/eyo/js/parser/token.js")
import_file("src/lib/eyo/js/core/font.js")
import_file("src/lib/eyo/js/core/c9r.js")
import_file("src/lib/eyo/js/core/const.js")
import_file("src/lib/eyo/js/ui/css.js")
import_file("src/lib/eyo/js/core/geometry.js")
import_file("src/lib/eyo/js/parser/node.js")
import_file("src/lib/eyo/js/core/change_count.js")
import_file("src/lib/eyo/js/core/register.js")
import_file("src/lib/eyo/js/application/desk/workspace/flyout/section.js")
import_file("src/lib/eyo/js/core/T3_all.js")
import_file("src/lib/eyo/js/application/application.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/board.js")
import_file("src/lib/eyo/js/application/abstract/owned.js")
import_file("src/lib/eyo/js/core/change.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick_util/consolidator.js")
import_file("src/lib/eyo/js/core/xre.js")
import_file("src/lib/eyo/js/other/db.js")
import_file("src/lib/eyo/js/application/desk/desk.js")
import_file("src/lib/eyo/js/ui/dnd.js")
import_file("src/lib/eyo/js/parser/grammar.js")
import_file("src/lib/eyo/js/application/driver/driver.js")
import_file("src/lib/eyo/js/core/events.js")
import_file("src/lib/eyo/js/module/module.js")
import_file("src/lib/eyo/js/ui/motion.js")
import_file("src/lib/eyo/js/application/abstract/pane.js")
import_file("src/lib/eyo/js/parser/tokenizer.js")
import_file("src/lib/eyo/js/application/desk/workspace/scrollbar/scrollbar.js")
import_file("src/lib/eyo/js/application/desk/workspace/scroller/scroller.js")
import_file("src/lib/eyo/js/application/desk/workspace/flyout/search.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/shape.js")
import_file("src/lib/eyo/js/application/abstract/workspace_control.js")
import_file("src/lib/eyo/js/application/backer.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick_util/brick_dragger.js")
import_file("src/lib/eyo/js/application/desk/workspace/flyout/draft.js")
import_file("src/lib/eyo/js/application/driver/fcls/fcls.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/field/field.js")
import_file("src/lib/eyo/js/application/desk/workspace/flyout/flyout.js")
import_file("src/lib/eyo/Python/graminit.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/magnet/magnet.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/metrics/metrics.js")
import_file("src/lib/eyo/js/module/module_decimal.js")
import_file("src/lib/eyo/js/module/module_functions.js")
import_file("src/lib/eyo/js/module/module_math.js")
import_file("src/lib/eyo/js/module/module_random.js")
import_file("src/lib/eyo/js/module/module_stdtypes.js")
import_file("src/lib/eyo/js/module/module_turtle.js")
import_file("src/lib/eyo/js/parser/parser.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/slot/slot.js")
import_file("src/lib/eyo/js/module/profile.js")
import_file("src/lib/eyo/js/application/desk/workspace/trashcan/trashcan.js")
import_file("src/lib/eyo/js/application/desk/workspace/workspace.js")
import_file("src/lib/eyo/js/application/desk/workspace/zoomer/zoomer.js")
import_file("src/lib/eyo/js/application/driver/dom/dom.js")
import_file("src/lib/eyo/js/ui/audio.js")
import_file("src/lib/eyo/js/application/driver/dom/dom_brick.js")
import_file("src/lib/eyo/js/application/driver/dom/dom_desk.js")
import_file("src/lib/eyo/js/application/driver/dom/dom_search.js")
import_file("src/lib/eyo/js/application/driver/svg/svg.js")
import_file("src/lib/eyo/js/application/driver/svg/svg_brick.js")
import_file("src/lib/eyo/js/application/driver/svg/svg_field.js")
import_file("src/lib/eyo/js/application/driver/svg/svg_slot.js")
import_file("src/lib/eyo/js/core/data.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick_util/brick_events.js")
import_file("src/lib/eyo/js/ui/brick_ui.js")
import_file("src/lib/eyo/js/application/desk/focus.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick_util/python_exporter.js")
import_file("src/lib/eyo/js/brick_py/stmt.js")
import_file("src/lib/eyo/js/other/tooltip.js")
import_file("src/lib/eyo/js/brick_py/expr.js")
import_file("src/lib/eyo/js/application/desk/workspace/flyout/library.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick_util/navigate.js")
import_file("src/lib/eyo/js/brick_py/group.js")
import_file("src/lib/eyo/js/brick_py/operator.js")
import_file("src/lib/eyo/js/brick_py/range.js")
import_file("src/lib/eyo/js/brick_py/starred.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_string.js")
import_file("src/lib/eyo/js/brick_py/try.js")
import_file("src/lib/eyo/js/brick_py/list.js")
import_file("src/lib/eyo/js/brick_py/literal.js")
import_file("src/lib/eyo/closure-library/menuitemrenderer.js")
import_file("src/lib/eyo/js/brick_py/control.js")
import_file("src/lib/eyo/js/brick_py/argument.js")
import_file("src/lib/eyo/js/brick_py/assignment.js")
import_file("src/lib/eyo/js/brick_py/comp.js")
import_file("src/lib/eyo/js/brick_py/import.js")
import_file("src/lib/eyo/js/brick_py/yield.js")
import_file("src/lib/eyo/js/brick_py/primary.js")
import_file("src/lib/eyo/closure-library/menuitem.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_cmath.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_decimal.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_fractions.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_functions.js")
import_file("src/lib/eyo/js/brick_py/lambda.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_math.js")
import_file("src/lib/eyo/js/brick_py/proc.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_random.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_statistics.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_stdtypes.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/model/brick_turtle.js")
import_file("src/lib/eyo/closure-library/menurenderer.js")
import_file("src/lib/eyo/js/application/desk/workspace/board/brick/brick_util/xml.js")
import_file("src/lib/eyo/closure-library/menubuttonrenderer.js")
import_file("src/lib/eyo/closure-library/popupmenu.js")
import_file("src/lib/eyo/closure-library/submenurenderer.js")
import_file("src/lib/eyo/js/application/desk/workspace/flyout/flyout-toolbar.js")
// DYNAMIC DEPS END
