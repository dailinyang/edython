/**
 * edython
 *
 * Copyright 2018 Jérôme LAURENS.
 *
 * License EUPL-1.2
 */
/**
 * @fileoverview BlockSvg delegates for edython, primary blocks.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

goog.provide('eYo.DelegateSvg.Primary')

goog.require('eYo.Signature')
goog.require('eYo.Model.stdtypes')
goog.require('eYo.Model.functions')

goog.require('eYo.Msg')
goog.require('eYo.DelegateSvg.Primary')
goog.require('eYo.DelegateSvg.Stmt')
goog.require('eYo.Protocol.Register')
goog.require('goog.dom');

/**
 * Class for a DelegateSvg, primary.
 * The primary block is a foundamental piece of code.
 * It aims to answer the mutation problem on primary
 * and similar python types.
 * The question is to avoid big modifications concerning
 * the implementation when small modifications of the interface
 * are expected. This block implementation covers all the following types:
 *
 * identifier ::=
 * attributeref ::= primary "." identifier
 * dotted_name ::= identifier ("." identifier)*
 * parent_module ::= '.'+ [module]
 * identifier_annotated ::= identifier ":" expression
 * key_datum ::= expression ":" expression
 * identifier_defined ::= parameter "=" expression
 * identifier_anotated_defined ::= parameter "=" expression
 * keyword_item ::= identifier "=" expression
 * identifier_as ::= identifier "as" identifier
 * dotted_name_as ::= module "as" identifier
 * expression_as ::= expression "as" identifier
 * call_expr ::= primary "(" argument_list_comprehensive ")"
 * subscription ::= primary "[" expression_list "]"
 * slicing ::= primary "[" slice_list "]"
 * 
 * We can notice that some 
 * The block inner content is divided into different parts
 * 1) the module or parent, as holder
 * For `foo.bar` construct
 * 2) the name
 * Either a field or an expression.
 * If this is an expression, there must be some other non void part,
 * otherwise we would have an expression block which only purpose is
 * just to contain an expression block, no more no less. This would
 * not be efficient.
 * 3) the annotation
 * This is used for parameter annotation, appears in both
 * identifier_annotated ::= identifier ":" expression
 * key_datum ::= expression ":" expression
 * This may be used in annotated assignments.
 * 4) the definition
 * identifier_defined ::= parameter "=" expression
 * (with parameter ::= identifier | identifier_annotated)
 * keyword_item ::= identifier "=" expression
 * 5) the map
 * One of 3 variants:
 * a) alias
 * dotted_name_as ::= module "as" identifier
 * identifier_as ::= identifier "as" identifier
 * b) call
 * call_expr ::= primary "(" argument_list_comprehensive ")"
 * c) subscript
 * subscription ::= primary "[" expression_list "]"
 * slicing ::= primary "[" slice_list "]"
 * 
 * The python type of the block is not uniquely defined.
 * For example, `foo as bar` may be both a `dotted_name_as` and
 * a `identifier_as`. On the opposit, once we know that there is an alias,
 * the type is one of these, no more. For these,
 * the persistent storage may not store information.
 * All the possibilities in next table
 * identifier ::= identifier
 * attributeref ::= primary "." identifier
 * dotted_name ::= identifier ("." identifier)*
 * parent_module ::= '.'+ [module]
 * identifier_annotated ::= identifier ":" expression
 * key_datum ::= expression ":" expression
 * identifier_defined ::= parameter "=" expression
 * identifier_anotated_defined ::= parameter "=" expression
 * keyword_item ::= identifier "=" expression
 * identifier_as ::= identifier "as" identifier
 * dotted_name_as ::= module "as" identifier
 * expression_as ::= expression "as" identifier
 * call_expr ::= primary "(" argument_list_comprehensive ")"
 * subscription ::= primary "[" expression_list "]"
 * slicing ::= primary "[" slice_list "]"
 |  |id|  |  |  | identifier ::=
 |p.|id|  |  |  | attributeref ::= primary "." identifier
 |d.|dd|  |  |  | dotted_name ::= identifier ("." identifier)*
 |  |pm|  |  |  | parent_module ::= '.'+ [module]
 |  |id|:x|  |  | identifier_annotated ::= identifier ":" expression
 |  | x|:x|  |  | key_datum ::= expression ":" expression
 |  |id|  |=x|  | identifier_defined ::= identifier "=" expression
 |  |id|:x|=x|  | identifier_annotated_defined ::= ...
 |  |id|  |=x|  | keyword_item ::= identifier "=" expression
 |  |id|  |  |as| identifier_as ::= identifier "as" identifier
 |d.|dd|  |  |as| dotted_name_as ::= module "as" identifier
 |  | x|  |  |as| expression_as ::= expression "as" identifier
 |  | p|  |  |()| call_expr
 |p.|id|  |  |()| call_expr
 |  |  |  |  |[]| subscription
 |  |  |  |  |[]| slicing
 *
 * A note on the mutability of the primary block, at least when
 * the identifier is concerned.
 * During the editing process, an identifier may not be set.
 * Some identifiers do need to be set to a non void string whereas
 * others do not. For example, `foo.bar`, `.bar` and `.` are
 * valid constructs but `foo.` is not. Both are obtained with a
 * `identifier.identifier` block construct.
 * The question is to recognize whether each identifier is void or not.
 * Let `unset` denote an unset identifier.
 * `unset.unset` is of type parent_module, attributeref and dotted_name.
 * 
 * A note on type management.
 * The primary block is one of the most complex blocks in edython.
 * This design was chosen in order to ease block edition.
 * This was kind of necessary because data and methods were merged in the delegate.
 * If there were a data delegate and a method delegate,
 * we would be able to keep the data in place and just change the methods.
 * Drawing the blocks would be deferred to another delegate.
 * This is a design that must be chosen in some future development.
 * For the moment, to make the difference between the different flavours
 * primary blocks, we have the variant and the subtype.
 * Variants allow to chose between call, slicing, alias, other.
 * Call and slicing expressions are straightforward.
 * Alias expressions are used in 4 different contexts
 *  1) import foo.bar as blah
 *  2) from foo import bar as blah
 *  3) with blah blah blah as bar
 *  4) except blah blah blah as bar
 * That makes 3 kinds of alias expressions
 *  1) identifier as identifier, aka identifier_as
 *  2) identifier.identifier.identifier... as identifier, aka dotted_name_as
 *  3) blah blah blah as identifier, aka expression_as
 * That makes 3 different block types,
 * each being a particular case of the next one, if any.
 * In case 3), when blah blah blah is an identifier block,
 * the type should be identifier_as, not just expression_as.
 * foo.bar

 * For edython.
 */
eYo.DelegateSvg.Expr.makeSubclass('primary', {
  xml: {
    types: [
      eYo.T3.Expr.identifier,
      eYo.T3.Expr.identifier_annotated,
      eYo.T3.Expr.key_datum,
      eYo.T3.Expr.identifier_defined,
      eYo.T3.Expr.keyword_item,
      eYo.T3.Expr.identifier_annotated_defined,
      eYo.T3.Expr.attributeref,
      eYo.T3.Expr.named_attributeref,
      eYo.T3.Expr.dotted_name,
      eYo.T3.Expr.parent_module,
      eYo.T3.Expr.identifier_as,
      eYo.T3.Expr.dotted_name_as,
      eYo.T3.Expr.expression_as,
      eYo.T3.Expr.subscription,
      eYo.T3.Expr.named_subscription,
      eYo.T3.Expr.slicing,
      eYo.T3.Expr.named_slicing,
      eYo.T3.Expr.call_expr,
      eYo.T3.Expr.named_call_expr
    ]
  },
  data: {
    dotted: {
      order: 200,
      init: 0,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var validated
        if (goog.isString(newValue)) {
          if (newValue.length) {
            validated = Math.max(0, Math.floor(Number(newValue)))
          } else {
            validated = Infinity
          }
        } else if (goog.isNumber(newValue)) {
          validated = Math.max(0, Math.floor(newValue))
        }
        return goog.isDef(validated)
        ? {
          validated: validated
        }
        : {}
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        this.required = newValue > 0
        this.setIncog()
        var holder_d = this.data.holder
        holder_d.required = newValue === 1
        holder_d.setIncog()
        if (newValue !== 0) {
          // this is a dotted expression
          this.data.annotation.change(eYo.Key.NONE)
          this.data.definition.change(eYo.Key.NONE)
        }
        this.owner.updateProfile()
      },
      fromType: /** @suppress {globalThis} */ function (type) {
        var p = this.owner.profile_p
        var item = p.p5e && p.p5e.item
        if (item) {
          if (item.type === 'method') {
            this.change(1)
            return
          }
        }
        if (type === eYo.T3.Expr.attributeref || type === eYo.T3.Expr.dotted_name) {
          this.change(1)
        }
      },
      fromField: /** @suppress {globalThis} */ function (value) {
        this.fromField(value.length)
      },
      toField: /** @suppress {globalThis} */ function (value) {
        var txt = ''
        for (var i = 0; (i < this.get()); i++) {
          txt += '.'
        }
        return txt
      },
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          if (this.get() || goog.isDef(this.model.placeholder)) {
            this.save(element)
          }
        }
      },
      synchronize: true
    },
    holder: {
      order: 201,
      init: '', // will be saved only when not built in
      placeholder: eYo.Msg.Placeholder.UNSET,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var p5e = eYo.T3.Profile.get(newValue, null)
        return !newValue
        || p5e.expr === eYo.T3.Expr.unset
        || p5e.expr === eYo.T3.Expr.identifier
        || p5e.expr === eYo.T3.Expr.builtin__name
        || p5e.expr === eYo.T3.Expr.dotted_name
        || p5e.expr === eYo.T3.Expr.attributeref
        || p5e.expr === eYo.T3.Expr.parent_module
        ? {validated: newValue} : null
        // return this.getAll().indexOf(newValue) < 0? null : {validated: newValue} // what about the future ?
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        this.owner.updateProfile()
      },
      synchronize: true,
      xml: {
        force: /** @suppress {globalThis} */ function () {
          return this.owner.variant_p === eYo.Key.CALL_EXPR
        },
        save: /** @suppress {globalThis} */ function (element) {
          var target = this.owner.holder_s.input.connection.targetBlock()
          if (!target) {
            if (this.get()) {
              this.save(element)
            }
            var v = eYo.Do.valueOf(this.model.placeholder)
            v = v && v.toString().trim()
            if (v.length>0) {
              this.save(element)
            }
          }
        }
      }
    },
    alias: {
      order: 400,
      init: '',
      placeholder: eYo.Msg.Placeholder.ALIAS,
      synchronize: true,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.T3.Profile.get(newValue).expr
        return type === eYo.T3.Expr.unset
        || type === eYo.T3.Expr.identifier
        || type === eYo.T3.Expr.builtin__name
        ? {validated: newValue}
        : null
      },
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          this.required = this.owner.variant_p === eYo.Key.ALIASED
          this.save(element)
        }
      },
      didLoad: /** @suppress {globalThis} */ function () {
        if (this.get().length || this.isRequiredFromModel()) {
          this.owner.variant_p = eYo.Key.ALIASED
        }
      }
    }, // new
    annotation: {
      NONE: eYo.Key.NONE,
      ANNOTATED: eYo.Key.ANNOTATED,
      order: 1000,
      all: [
        eYo.Key.NONE,
        eYo.Key.ANNOTATED
      ],
      default: eYo.Key.NONE,
      fromType: /** @suppress {globalThis} */ function (type) {
        if (type === eYo.T3.Expr.identifier_annotated
        || type === eYo.T3.Expr.identifier_annotated_defined) {
          this.set(eYo.Key.ANNOTATED)
        }
      },
      validate: true,
      didChange: function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        // override previous data if necessary
        if (newValue !== eYo.Key.NONE) {
          // no holder nor dotted nor variant
          this.owner.dotted_p = 0
          this.owner.variant_p = eYo.Key.NONE
        }
        this.required = newValue !== eYo.Key.NONE
        this.setIncog()
      },
      xml: {
        save: function (element) {
          if (this.get() !== eYo.Key.NONE) {
            this.save(element)
          }
        }
      }
    },
    definition: {
      order: 1001,
      NONE: eYo.Key.NONE,
      DEFINED: eYo.Key.DEFINED,
      all: [
        eYo.Key.NONE,
        eYo.Key.DEFINED
      ],
      default: eYo.Key.NONE,
      fromType: /** @suppress {globalThis} */ function (type) {
        if (type === eYo.T3.Expr.keyword_item
          || type === eYo.T3.Expr.identifier_defined
          || type === eYo.T3.Expr.identifier_annotated_defined) {
          this.set(eYo.Key.DEFINED)
        }
      },
      validate: true,
      didChange: function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        // override previous data if necessary
        if (newValue !== eYo.Key.NONE) {
          // no holder nor dotted nor variant
          this.owner.dotted_p = 0
          this.owner.variant_p = eYo.Key.NONE
        }
        this.required = newValue !== eYo.Key.NONE
        this.setIncog()
      },
      xml: {
        save: function (element) {
          if (this.get() !== eYo.Key.NONE) {
            this.save(element)
          }
        }
      }
    },
    variant: {
      order: 2000,
      NONE: eYo.Key.NONE,
      CALL_EXPR: eYo.Key.CALL_EXPR,
      SLICING: eYo.Key.SLICING,
      ALIASED: eYo.Key.ALIASED,
      all: [
        eYo.Key.NONE,
        eYo.Key.CALL_EXPR,
        eYo.Key.SLICING,
        eYo.Key.ALIASED
      ],
      init: eYo.Key.NONE,
      isChanging: /** @suppress {globalThis} */ function (oldValue, newValue) {
        if (newValue !== eYo.Key.NONE) {
          this.owner.annotation_p = eYo.Key.NONE
          this.owner.definition_p = eYo.Key.NONE
        }
        this.owner.consolidateType()
        this.owner.consolidateConnections()
        this.isChanging(oldValue, newValue)
      },
      fromType: /** @suppress {globalThis} */ function (type) {
        if (type === eYo.T3.Expr.call_expr) {
          this.set(eYo.Key.CALL_EXPR)
        } else if (type === eYo.T3.Stmt.call_stmt) {
          this.set(eYo.Key.CALL_EXPR)
        } else if (type === eYo.T3.Expr.slicing) {
          this.set(eYo.Key.SLICING)
        } else if (type === eYo.T3.Expr.dotted_name_as || type === eYo.T3.Expr.identifier_as || type === eYo.T3.Expr.expression_as) {
          this.set(eYo.Key.ALIASED)
        } else {
          this.set(eYo.Key.NONE)
        }
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        var O = this.owner
        O.updateProfile()
        O.n_ary_s.setIncog(newValue !== eYo.Key.CALL_EXPR)
        O.slicing_s.setIncog(newValue !== eYo.Key.SLICING)
        O.alias_d.setIncog(newValue !== eYo.Key.ALIASED)
        if (newValue !== eYo.Key.NONE) {
          O.definition_d.setIncog(true)
          O.annotation_d.setIncog(true)
        }
      },
      xml: false
    },
    name: {
      order: 10000, // the name must be quite last
      main: true,
      init: '',
      placeholder: eYo.Msg.Placeholder.TERM,
      validate: /** @suppress {globalThis} */ function (newValue) {
        var type = eYo.T3.Profile.get(newValue)
        return type.raw === eYo.T3.Expr.builtin__name
        || type.expr === eYo.T3.Expr.identifier
        || type.expr === eYo.T3.Expr.parent_module
        || type.expr === eYo.T3.Expr.dotted_name
        ? {validated: newValue} : null
        // return this.getAll().indexOf(newValue) < 0? null : {validated: newValue} // what about the future ?
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        this.owner.updateProfile()
        var p = this.owner.profile_p
        if (p.p5e && p.p5e.item) {
          // console.log('p.p5e.item', p.p5e.item.type, p.p5e.item)
          if (p.p5e.item.type === 'method' && this.owner.dotted_p === 0) {
            this.owner.dotted_p = 1
          }
          this.owner.ary_p = -1 // will be validated below
          this.owner.mandatory_p = -1 // will be validated below
        }
      },
      synchronize: true,
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          var target = this.owner.name_s.input.connection.targetBlock()
          if (!target) {
            this.save(element)
          }
        }
      }
    },
    subtype: {
      order: 10001,
      all: [
        eYo.T3.Expr.unset,
        eYo.T3.Expr.custom_identifier,
        eYo.T3.Expr.custom_dotted_name,
        eYo.T3.Expr.custom_parent_module
      ],
      noUndo: true,
      xml: false
    },
    ary: {
      order: 20001,
      init: Infinity,
      validate: /** @suppress {globalThis} */ function (newValue) {
        // returns a `Number` or `Infinity`
        var validated
        this.owner.updateProfile()
        var p = this.owner.profile_p
        var item = p.p5e && p.p5e.item
        if (item) {
          var ary = item.ary
          validated = goog.isDef(ary) ? ary : Infinity
        } else if (goog.isString(newValue)) {
          if (newValue.length) {
            validated = Math.max(0, Math.floor(Number(newValue)))
          } else {
            validated = Infinity
          }
        } else if (goog.isNumber(newValue)) {
          validated = Math.max(0, Math.floor(newValue))
        }
        return {validated: validated}
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        // First change the ary of the arguments list, then change the ary of the delegate.
        // That way undo events are recorded in the correct order.
        this.didChange(oldValue, newValue)
        var input = this.owner.n_ary_s.input
        if (input && input.connection) {
          var target = input.connection.targetBlock()
          if (target) {
            target.eyo.ary_p = newValue
          }
        }
        (newValue < this.owner.mandatory_p) && (this.owner.mandatory_p = newValue)
      },
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          if (this.owner.variant_p === eYo.Key.CALL_EXPR && this.get() !== Infinity) {
            if (this.owner.profile_p.p5e.raw === eYo.T3.Expr.known_identifier) {
              return
            }
            this.save(element)
          }
        }
      }
    },
    mandatory: {
      order: 20002,
      init: 0,
      validate: /** @suppress {globalThis} */ function (newValue) {
        // returns a `Number` or `Infinity`
        var validated
        var p = this.owner.profile_p
        var item = p.p5e && p.p5e.item
        if (item) {
          if (goog.isDef(item.mandatory)) {
            validated = item.mandatory
          } else if (goog.isDef(item.ary)) {
            // when `item.mandatory` is not defined, `mandatory` is `ary`
            validated = item.ary
          } else {
            validated = 0
          }
        } else if (goog.isString(newValue)) {
          if (newValue.length) {
            validated = Math.max(0, Math.floor(Number(newValue)))
          } else {
            validated = 0
          }
        } else if (goog.isNumber(newValue)) {
          validated = Math.max(0, Math.floor(newValue))
        }
        return {validated: validated}
      },
      didChange: /** @suppress {globalThis} */ function (oldValue, newValue) {
        this.didChange(oldValue, newValue)
        var input = this.owner.n_ary_s.input
        if (input && input.connection) {
          var target = input.connection.targetBlock()
          if (target) {
            target.eyo.mandatory_p = newValue
          }
        }
        (newValue > this.owner.ary_p) && (this.owner.ary_p = newValue)
      },
      xml: {
        save: /** @suppress {globalThis} */ function (element) {
          if (this.owner.profile_p && this.owner.variant_p === eYo.Key.CALL_EXPR && this.get()) {
            if (this.owner.profile_p && this.owner.profile_p.p5e.raw === eYo.T3.Expr.known_identifier) {
              return
            }
            this.save(element)
          }
        }
      }
    }
  },
  slots: {
    holder: {
      order: 50,
      fields: {
        bind: {
          validate: true,
          endEditing: true
        }
      },
      check: eYo.T3.Expr.Check.primary,
      didDisconnect: /** @suppress {globalThis} */ function (oldTargetC8n) {
        this.connection.sourceBlock_.eyo.updateProfile()
      },
      didConnect: /** @suppress {globalThis} */ function (oldTargetC8n, targetOldC8n) {
        this.connection.sourceBlock_.eyo.updateProfile()
      },
      hole_value: eYo.Msg.Placeholder.PRIMARY,
      xml: true
    },
    dotted: {
      order: 75,
      fields: {
        bind: {
          value: '.',
          css_class: 'eyo-code-reserved',
          separator: true
        }
      }
    },
    name: {
      order: 100,
      check: /** @suppress {globalThis} */ function () {
        // a general expression or a more specific block
        var b_eyo = this.connection.eyo.b_eyo
        var variant_p = b_eyo.variant_p
        if (variant_p === eYo.Key.ALIASED) {
          return eYo.T3.Expr.Check.expression
        }
        if (variant_p === eYo.Key.CALL_EXPR
          || variant_p === eYo.Key.SLICING) {
          return eYo.T3.Expr.Check.primary
        }
        var profile = b_eyo.profile_p
        return profile.annotated
        ? eYo.T3.Expr.Check.expression
        : [
          eYo.T3.Expr.unset,
          eYo.T3.Expr.identifier,
          eYo.T3.Expr.dotted_name,
          eYo.T3.Expr.dotted_name,
          eYo.T3.Expr.named_attributeref,
          eYo.T3.Expr.attributeref,
          eYo.T3.Expr.named_call_expr,
          eYo.T3.Expr.call_expr,
          eYo.T3.Expr.named_slicing,
          eYo.T3.Expr.slicing
        ]
      },
      didDisconnect: /** @suppress {globalThis} */ function (oldTargetC8n) {
        this.connection.sourceBlock_.eyo.updateProfile()
      },
      didConnect: /** @suppress {globalThis} */ function (oldTargetC8n, targetOldC8n) {
        this.connection.sourceBlock_.eyo.updateProfile()
      },
      plugged: eYo.T3.Expr.primary,
      hole_value: 'expression',
      fields: {
        bind: {
          validate: true,
          endEditing: true,
          variable: true
        }
      }
    },
    annotation: {
      order: 102,
      fields: {
        label: {
          value: ':',
          css: 'reserved'
        }
      },
      check: eYo.T3.Expr.Check.expression,
      hole_value: 'expression',
      didLoad: /** @suppress {globalThis} */ function () {
        if (this.isRequiredFromModel()) {
          this.owner.variant_p = eYo.Key.NONE
          this.owner.annotation_p = eYo.Key.ANNOTATED         
        } else {
          this.owner.annotation_p = eYo.Key.NONE
        }
      },
      validateIncog: /** @suppress {globalThis} */ function (newValue) {
        return this.owner.annotation_p !== eYo.Key.ANNOTATED
      }
    },
    definition: {
      order: 103,
      fields: {
        label: {
          value: '=',
          css: 'reserved'
        }
      },
      check: eYo.T3.Expr.Check.expression,
      hole_value: 'expression',
      xml: {
        didLoad: /** @suppress {globalThis} */ function () {
          if (this.isRequiredFromModel()) {
            var d = this.owner.data.variant
            d.set(eYo.Key.NONE)
            d = this.owner.data.definition
            d.set(eYo.Key.DEFINED)            
          } else {
            d = this.owner.data.definition
            d.set(eYo.Key.NONE)
          }
        }
      }
    },
    n_ary: {
      order: 1000,
      fields: {
        start: '(',
        end: ')'
      },
      wrap: eYo.T3.Expr.argument_list_comprehensive,
      validateIncog: /** @suppress {globalThis} */ function (newValue) {
        return this.owner.variant_p !== eYo.Key.CALL_EXPR
      }
    },
    slicing: {
      order: 2000,
      fields: {
        start: '[',
        end: ']'
      },
      wrap: eYo.T3.Expr.slice_list,
      validateIncog: /** @suppress {globalThis} */ function (newValue) {
        return this.owner.variant_p !== eYo.Key.SLICING
      }
    },
    alias: {
      order: 3000,
      fields: {
        label: 'as',
        bind: {
          validate: true,
          endEditing: true,
          variable: true
        }
      },
      validateIncog: /** @suppress {globalThis} */ function (newValue) {
        return this.owner.variant_p !== eYo.Key.ALIASED
      },
      check: [eYo.T3.Expr.identifier, eYo.T3.Expr.unset]
    }
  },
  output: {
    check: /** @suppress {globalThis} */ function (type, subtype) {
      // there is no validation here
      // simple cases first, variant based
      var eyo = this.connection.sourceBlock_.eyo
      var profile = eyo.profile_p
      if (!profile) {
        console.warn('NO PROFILE, is it normal?')
        eyo.incrementChangeCount()
        profile = eyo.profile_p
        if (!profile) {
          console.error('NO PROFILE')
        }
      }
      return eyo.getOutCheck(profile)
    }
  },
  init: /** @suppress {globalThis} */ function () {
    eYo.DelegateSvg.Expr.registerPrimary(this)
  },
  deinit: /** @suppress {globalThis} */ function () {
    eYo.DelegateSvg.Expr.unregisterPrimary(this)
  }
}, true)

eYo.Do.addProtocol(eYo.DelegateSvg.Expr, 'Register', 'primary', function (delegate) {
  return !delegate.block_.isInFlyout
})

for (var _ = 0, k; (k = [
  'call_expr',
  'subscription',
  'slicing',
  'identifier',
  'attributeref',
  'dotted_name',
  'parent_module',
  'identifier_defined',
  'key_datum',
  'identifier_annotated',
  'keyword_item',
  'identifier_annotated_defined',
  'identifier_as',
  'dotted_name_as',
  'expression_as'
][_++]);) {
  eYo.DelegateSvg.Expr[k] = eYo.DelegateSvg.Expr.primary
  eYo.DelegateSvg.Manager.register(k)
}

/**
 * Initialize a block.
 * Called from block's init method.
 * This should be called only once.
 * The underlying model is not expected to change while running.
 * @param {!Blockly.Block} block to be initialized.
 * For subclassers eventually
 */
eYo.DelegateSvg.Expr.primary.prototype.init = function () {
  eYo.DelegateSvg.Expr.primary.superClass_.init.call(this)
  this.profile_ = undefined
}

Object.defineProperty(
  eYo.DelegateSvg.Expr.primary.prototype,
  'profile_p',
  {
    get () {
      return this.profile_ === this.getProfile()
        ? this.profile_
        : (this.profile_ = this.getProfile()) // this should never happen
    },
    set (newValue) {
      this.profile_ = newValue
    }
  }
)

/**
 * updateProfile.
 */
eYo.DelegateSvg.Expr.primary.prototype.updateProfile = function () {
  ++this.change.count
  this.profile_p = this.getProfile()
  this.data.subtype.set(this.profile_p.p5e && this.profile_p.p5e.raw)
}

/**
 * getProfile.
 * What are the types of holder and name?
 * Problem : this is not recursive!
 * @return {!Object}.
 */
eYo.DelegateSvg.Expr.primary.prototype.getProfile = eYo.Decorate.onChangeCount(
  'getProfile',
  function () {
      // this may be called very very early when
      // neither `data` nor `slots` may exist yet
    if (this.data && this.slots) {
      var ans = {
        dotted: this.dotted_p,
        variant: this.variant_p,
        defined: !this.data.definition.isNone(),
        annotated: !this.data.annotation.isNone()
      }
      var target, t_eyo, p5e
      var type
      if ((target = this.name_s.targetBlock())) {
        t_eyo = target.eyo
        if (t_eyo.checkOutputType(eYo.T3.Expr.identifier)) {
          type = eYo.T3.Expr.identifier
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.dotted_name)) {
          type = eYo.T3.Expr.dotted_name
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.parent_module)) {
          type = eYo.T3.Expr.parent_module
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.Check.named_attributeref)) {
          type = eYo.T3.Expr.named_attributeref
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.Check.named_primary)) {
          type = eYo.T3.Expr.named_primary
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.Check.primary)) {
          type = eYo.T3.Expr.primary
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.Check.expression)) {
          type = eYo.T3.Expr.expression
        } else {
          type = eYo.T3.Expr.error // this block should not be connected
        }
        ans.name = {
          type: type,
          slot: type,
          target: target
        }
        var p = t_eyo.profile_p
        if (p) {
          ans.identifier = p.identifier
          ans.module = p.module
        }
        // a target block with no profile... bad luck
      } else {
        p5e = eYo.T3.Profile.get(this.name_p, null)
        type = p5e.expr
        ans.name = {
          type: type,
          field: type
        }
        ans.identifier = p5e.name
        ans.module = p5e.holder
      }
      target = this.holder_s.targetBlock()
      if (ans.dotted < 2 && target) {
        t_eyo = target.eyo
        if (t_eyo.checkOutputType(eYo.T3.Expr.identifier)) {
          type = eYo.T3.Expr.identifier
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.dotted_name)) {
          type = eYo.T3.Expr.dotted_name
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.parent_module)) {
          type = eYo.T3.Expr.parent_module
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.Check.named_primary)) {
          type = eYo.T3.Expr.named_primary
        } else if (t_eyo.checkOutputType(eYo.T3.Expr.Check.primary)) {
          type = eYo.T3.Expr.primary
        } else {
          type = eYo.T3.Expr.error // this block should not be connected
        }
        ans.holder = {
          type: type,
          slot: type,
          target: target
        }
        p = t_eyo.profile_p
        if (p) {
          var base = p.module
            ? p.module + '.' + p.identifier
            : p.identifier
          base && (
            ans.module = ans.module
              ? base + '.' + ans.module
              : base
          )
          ans.holder.profile = p
        }
      } else {
        base = this.holder_p
        p5e = eYo.T3.Profile.get(base)
        type = p5e.expr
        ans.holder = {
          type: type,
          field: type
        }
        base && (
          ans.module = ans.module
            ? base + '.' + ans.module
            : base
        )
      }
      ans.identifier && (ans.p5e = eYo.T3.Profile.get(ans.identifier, ans.module))
      return {
        ans: ans
      }
    }
    return {
      ans: {
        name: {},
        holder: {}
      }
    }
  }
)

/**
 * getBaseType.
 * The type depends on the variant and the modifiers.
 * As side effect, the subtype is set.
 */
eYo.DelegateSvg.Expr.primary.prototype.getBaseType = function () {
  var check = this.getOutCheck(this.profile_p)
  return check[0]
}

/**
 * getOutCheck.
 * The check_ array of the output connection.
 * @param {!Object} profile
 */
eYo.DelegateSvg.Expr.primary.prototype.getOutCheck = function (profile) {
  // there is no validation here
  // simple cases first, variant based
  var named = function () {
    if (eYo.T3.Expr.Check.named_primary.indexOf(profile.name.type)) {
      if (!profile.holder.type
      || eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type)) {
        return true
      }
    }
  }
  if (profile.variant === eYo.Key.CALL_EXPR) {
    return named()
      ? [
        eYo.T3.Expr.named_call_expr,
        eYo.T3.Expr.call_expr
      ] 
      : [
        eYo.T3.Expr.call_expr
      ]
  } else if (profile.variant === eYo.Key.SLICING) {
    return named()
      ? [
        eYo.T3.Expr.named_slicing,
        eYo.T3.Expr.slicing
      ] 
      : [
        eYo.T3.Expr.slicing
      ]
  } else if (profile.variant === eYo.Key.ALIASED) {
    if (profile.name.type === eYo.T3.Expr.identifier
    || profile.name.type === eYo.T3.Expr.unset) {
      if (profile.holder && (profile.holder.type === eYo.T3.Expr.unset
        || profile.holder.type === eYo.T3.Expr.identifier
        || profile.holder.type === eYo.T3.Expr.dotted_name)) {
        return [
          eYo.T3.Expr.dotted_name_as,
          eYo.T3.Expr.expression_as
        ]
      }
      return profile.holder && profile.holder.type
        ? [
          eYo.T3.Expr.expression_as
        ]
        : [
          eYo.T3.Expr.identifier_as,
          eYo.T3.Expr.dotted_name_as,
          eYo.T3.Expr.expression_as
        ]
    }
    if (profile.name.type === eYo.T3.Expr.dotted_name) {
      if (!profile.holder.type
        || profile.holder.type === eYo.T3.Expr.unset
        || profile.holder.type === eYo.T3.Expr.identifier
        || profile.holder.type === eYo.T3.Expr.dotted_name) {
        return [
          eYo.T3.Expr.dotted_name_as,
          eYo.T3.Expr.expression_as
        ]
      }
    }
    return [
      eYo.T3.Expr.expression_as
    ]
  }
  if (profile.annotated) {
    if(profile.defined) {
      return [
        eYo.T3.Expr.identifier_annotated_defined
      ]
    }
    return profile.name.type === eYo.T3.Expr.identifier
      ? [
        eYo.T3.Expr.identifier_annotated,
        eYo.T3.Expr.key_datum
      ]
      : [
        eYo.T3.Expr.key_datum
      ]
  } else if(profile.defined) {
    return [
      eYo.T3.Expr.identifier_defined,
      eYo.T3.Expr.keyword_item
    ]
  }
  // if this is just a wrapper, forwards the check array
  if (!profile.dotted) {
    return profile.name.target
      ? profile.name.target.outputConnection.check_
      : profile.name.type === eYo.T3.Expr.unset
        ? [
          eYo.T3.Expr.identifier
        ]
        : [
          profile.name.type
        ]
  }
  // parent_module first
  if (profile.name.type === eYo.T3.Expr.parent_module) {
    return [
      eYo.T3.Expr.parent_module
    ]
  }
  if (profile.holder.type === eYo.T3.Expr.parent_module) {
    return [
      eYo.T3.Expr.parent_module
    ]
  }
  if (profile.dotted > 0 && (!profile.holder.type
    || profile.holder.type === eYo.T3.Expr.unset)) {
    return [
      eYo.T3.Expr.parent_module
    ]
  }
  // [named_]attributeref
  if (profile.name.type === eYo.T3.Expr.unset
  || profile.name.type === eYo.T3.Expr.identifier) {
    if (profile.holder.type === eYo.T3.Expr.unset
    || profile.holder.type === eYo.T3.Expr.identifier
    || profile.holder.type === eYo.T3.Expr.dotted_name) {
      return [
        eYo.T3.Expr.dotted_name,
        eYo.T3.Expr.named_attributeref,
        eYo.T3.Expr.attributeref
      ]
    }
    if (profile.holder.type) {
      if (eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type) >= 0) {
        return [
          eYo.T3.Expr.named_attributeref,
          eYo.T3.Expr.attributeref
        ]
      }
      return [
        eYo.T3.Expr.attributeref
      ]  
    }
    return [
      eYo.T3.Expr.identifier,
      eYo.T3.Expr.dotted_name
    ]  
  }
  if (profile.name.type === eYo.T3.Expr.dotted_name) {
    if (profile.holder.type === eYo.T3.Expr.unset
    || profile.holder.type === eYo.T3.Expr.identifier
    || profile.holder.type === eYo.T3.Expr.dotted_name) {
      return [
        eYo.T3.Expr.dotted_name,
        eYo.T3.Expr.named_attributeref,
        eYo.T3.Expr.attributeref
      ]
    }
    if (profile.holder.type) {
      if (eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type) >= 0) {
        return [
          eYo.T3.Expr.named_attributeref,
          eYo.T3.Expr.attributeref
        ]
      }
      return [
        eYo.T3.Expr.attributeref
      ]  
    }
    return [
      eYo.T3.Expr.dotted_name
    ]  
  }
  if (profile.name.type === eYo.T3.Expr.named_attributeRef) {
    if (!profile.dotted
      || eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type)) {
      return [
        eYo.T3.Expr.named_attributeref,
        eYo.T3.Expr.attributeref
      ]
    }
  }
  if (profile.name.type === eYo.T3.Expr.attributeRef) {
    return !profile.dotted || eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type)
      ? [
        eYo.T3.Expr.named_attributeref,
        eYo.T3.Expr.attributeref
      ]
      : [
        eYo.T3.Expr.attributeref
      ]
  }
  if (profile.name.type === eYo.T3.Expr.call_expr) {
    return !profile.dotted || eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type)
      ? [
        eYo.T3.Expr.named_call_expr,
        eYo.T3.Expr.call_expr
      ]
      : [
        eYo.T3.Expr.call_expr
      ]
  }
  if (profile.name.type === eYo.T3.Expr.slicing) {
    return !profile.dotted || eYo.T3.Expr.Check.named_primary.indexOf(profile.holder.type)
      ? [
        eYo.T3.Expr.named_slicing,
        eYo.T3.Expr.slicing
      ]
      : [
        eYo.T3.Expr.slicing
      ]
  }
  return [
    eYo.T3.Expr.attributeref
  ]
}

/**
 * The subtype depends on the variant and the modifiers.
 * Set by getType as side effect.
 */
eYo.DelegateSvg.Expr.primary.prototype.getSubtype = function () {
  this.getType()
  return this.subtype_p
}

/**
 * Fetches the named input object, getInput.
 * This is not a very strong design but it should work, I guess.
 * @param {!Block} block
 * @param {String} name The name of the input.
 * @param {?Boolean} dontCreate Whether the receiver should create inputs on the fly.
 * @return {Blockly.Input} The input object, or null if input does not exist or undefined for the default block implementation.
 */
eYo.DelegateSvg.Expr.primary.prototype.getInput = function (name) {
  var input = eYo.DelegateSvg.Expr.primary.superClass_.getInput.call(this, name)
  if (!input) {
    // we suppose that ary is set
    var f = function (slot) {
      if (!slot.isIncog()) {
        var input = slot.input
        if (input && input.connection) {
          var target = input.connection.targetBlock()
          if (target && (input = target.getInput(name))) {
            return true
          }
        }
      }
    }
    f(this.n_ary_s) || f(this.slicing_s)
  }
  return input
}

/**
 * Class for a DelegateSvg, base call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.makeSubclass('pre_call_stmt', {
  link: eYo.T3.Expr.primary
}, eYo.DelegateSvg.Stmt)

/**
 * Class for a DelegateSvg, base call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.pre_call_stmt.makeSubclass('call_stmt', {
  data: {
    variant: {
      init: eYo.Key.CALL_EXPR,
      validate: function (newValue) {
        return {validated: eYo.Key.CALL_EXPR}
      }
    }
  }
}, eYo.DelegateSvg.Stmt, true)

/**
 * Class for a DelegateSvg, call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.makeSubclass('base_call_stmt', {
  link: eYo.T3.Expr.primary
}, eYo.DelegateSvg.Stmt, true)

eYo.DelegateSvg.Stmt.base_call_stmt.prototype.updateProfile = eYo.DelegateSvg.Expr.primary.prototype.updateProfile

eYo.DelegateSvg.Stmt.base_call_stmt.prototype.getProfile = eYo.DelegateSvg.Expr.primary.prototype.getProfile


/**
 * Initialize a block.
 * Called from block's init method.
 * This should be called only once.
 * The underlying model is not expected to change while running.
 * @param {!Blockly.Block} block to be initialized.
 * For subclassers eventually
 */
eYo.DelegateSvg.Stmt.base_call_stmt.prototype.init = function () {
  eYo.DelegateSvg.Stmt.base_call_stmt.superClass_.init.call(this)
  this.profile_p = undefined
}

Object.defineProperty(
  eYo.DelegateSvg.Stmt.base_call_stmt.prototype,
  'profile_p',
  {
    get () {
      return this.profile_ === this.getProfile()
        ? this.profile_
        : (this.profile_ = this.getProfile()) // this should never happen
    },
    set (newValue) {
      this.profile_ = newValue
    }
  }
)

/**
 * Class for a DelegateSvg, call statement block.
 * Not normally called directly, eYo.DelegateSvg.create(...) is preferred.
 * For edython.
 */
eYo.DelegateSvg.Stmt.base_call_stmt.makeSubclass('call_stmt', {
}, true)

eYo.DelegateSvg.Expr.primary.T3s = [
  eYo.T3.Expr.primary,
  eYo.T3.Expr.identifier,
  eYo.T3.Expr.attributeref,
  eYo.T3.Expr.slicing,
  eYo.T3.Expr.subscription,
  eYo.T3.Expr.call_expr,
  eYo.T3.Stmt.call_stmt
]
