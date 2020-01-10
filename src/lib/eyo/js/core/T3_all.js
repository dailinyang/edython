// This file was generated by "python types.py" on 2019-05-12 06:47:04.167507

/**
 * edython
 *
 * Copyright 2019 Jérôme LAURENS.
 *
 * @license EUPL-1.2
 */
/**
 * @fileoverview Type constants for edython, used as bricks prototypes.
 * @author jerome.laurens@u-bourgogne.fr (Jérôme LAURENS)
 */
'use strict'

/**
 * @name eYo.t3.all
 * @namespace
 **/

eYo.require('t3')

eYo.provide('t3.all')


eYo.t3.all = {}
eYo.t3.all.Core_expressions = [ // count 79
    eYo.t3.expr.a_expr,
    eYo.t3.expr.and_expr,
    eYo.t3.expr.and_test,
    eYo.t3.expr.any,
    eYo.t3.expr.argument_list,
    eYo.t3.expr.assignment_chain,
    eYo.t3.expr.attributeref,
    eYo.t3.expr.augop,
    eYo.t3.expr.augtarget_annotated,
    eYo.t3.expr.bracket_target_list,
    eYo.t3.expr.builtin__object,
    eYo.t3.expr.call_expr,
    eYo.t3.expr.comp_for,
    eYo.t3.expr.comp_if,
    eYo.t3.expr.comprehension,
    eYo.t3.expr.conditional_expression,
    eYo.t3.expr.dict_comprehension,
    eYo.t3.expr.dict_display,
    eYo.t3.expr.dotted_name_as,
    eYo.t3.expr.expression_as,
    eYo.t3.expr.expression_star,
    eYo.t3.expr.expression_star_star,
    eYo.t3.expr.floatnumber,
    eYo.t3.expr.identifier,
    eYo.t3.expr.identifier_annotated,
    eYo.t3.expr.identifier_annotated_valued,
    eYo.t3.expr.identifier_as,
    eYo.t3.expr.identifier_valued,
    eYo.t3.expr.imagnumber,
    eYo.t3.expr.inheritance,
    eYo.t3.expr.integer,
    eYo.t3.expr.key_datum,
    eYo.t3.expr.lambda,
    eYo.t3.expr.lambda_expr,
    eYo.t3.expr.lambda_expr_nocond,
    eYo.t3.expr.list_display,
    eYo.t3.expr.longbytesliteral,
    eYo.t3.expr.longformattedliteral,
    eYo.t3.expr.longstringliteral,
    eYo.t3.expr.m_expr,
    eYo.t3.expr.name,
    eYo.t3.expr.named_attributeref,
    eYo.t3.expr.named_call_expr,
    eYo.t3.expr.named_expr,
    eYo.t3.expr.named_slicing,
    eYo.t3.expr.named_subscription,
    eYo.t3.expr.non_void_expression_list,
    eYo.t3.expr.not_test,
    eYo.t3.expr.number_comparison,
    eYo.t3.expr.object_comparison,
    eYo.t3.expr.one_dict_display,
    eYo.t3.expr.one_set_display,
    eYo.t3.expr.optional_expression_list,
    eYo.t3.expr.or_expr,
    eYo.t3.expr.or_expr_star_star,
    eYo.t3.expr.or_test,
    eYo.t3.expr.parameter_list,
    eYo.t3.expr.parameter_list_starargs,
    eYo.t3.expr.parameter_star,
    eYo.t3.expr.parameter_star_star,
    eYo.t3.expr.parent_module,
    eYo.t3.expr.parenth_form,
    eYo.t3.expr.parenth_target_list,
    eYo.t3.expr.power,
    eYo.t3.expr.proper_slice,
    eYo.t3.expr.set_display,
    eYo.t3.expr.shift_expr,
    eYo.t3.expr.shortbytesliteral,
    eYo.t3.expr.shortformattedliteral,
    eYo.t3.expr.shortstringliteral,
    eYo.t3.expr.slicing,
    eYo.t3.expr.star,
    eYo.t3.expr.star_expr,
    eYo.t3.expr.subscription,
    eYo.t3.expr.target_star,
    eYo.t3.expr.u_expr,
    eYo.t3.expr.void_dict_display,
    eYo.t3.expr.xor_expr,
    eYo.t3.expr.yield_expr,
]
eYo.t3.all.lists = [ // count 10
    eYo.t3.expr.comp_iter_list,
    eYo.t3.expr.dotted_name,
    eYo.t3.expr.key_datum_list,
    eYo.t3.expr.non_void_identifier_list,
    eYo.t3.expr.non_void_import_identifier_as_list,
    eYo.t3.expr.non_void_module_as_list,
    eYo.t3.expr.slice_list,
    eYo.t3.expr.starred_list,
    eYo.t3.expr.target_list,
    eYo.t3.expr.with_item_list,
]
eYo.t3.all.wrappers = [ // count 51
    eYo.t3.expr.a_expr_all,
    eYo.t3.expr.and_expr_all,
    eYo.t3.expr.and_test_all,
    eYo.t3.expr.argument_any,
    eYo.t3.expr.argument_list_comprehensive,
    eYo.t3.expr.atom,
    eYo.t3.expr.augassigned_list,
    eYo.t3.expr.augtarget,
    eYo.t3.expr.binary,
    eYo.t3.expr.bytesliteral,
    eYo.t3.expr.comp_iter,
    eYo.t3.expr.comparison,
    eYo.t3.expr.defparameter,
    eYo.t3.expr.enclosure,
    eYo.t3.expr.enclosure_list_unique,
    eYo.t3.expr.expression,
    eYo.t3.expr.expression_key_datum,
    eYo.t3.expr.expression_nocond,
    eYo.t3.expr.import_identifier_as,
    eYo.t3.expr.key_datum_all,
    eYo.t3.expr.literal,
    eYo.t3.expr.longliteral,
    eYo.t3.expr.m_expr_all,
    eYo.t3.expr.module,
    eYo.t3.expr.module_as,
    eYo.t3.expr.named_augtarget,
    eYo.t3.expr.named_primary,
    eYo.t3.expr.namedexpr_test,
    eYo.t3.expr.not_test_all,
    eYo.t3.expr.numberliteral,
    eYo.t3.expr.or_expr_all,
    eYo.t3.expr.or_test_all,
    eYo.t3.expr.parameter,
    eYo.t3.expr.parameter_any,
    eYo.t3.expr.power_all,
    eYo.t3.expr.primary,
    eYo.t3.expr.relative_module,
    eYo.t3.expr.shift_expr_all,
    eYo.t3.expr.shortliteral,
    eYo.t3.expr.slice_item,
    eYo.t3.expr.starred_item,
    eYo.t3.expr.starred_item_38,
    eYo.t3.expr.starred_item_all,
    eYo.t3.expr.stringliteral,
    eYo.t3.expr.target,
    eYo.t3.expr.target_annotated,
    eYo.t3.expr.target_unstar,
    eYo.t3.expr.u_expr_all,
    eYo.t3.expr.value_list,
    eYo.t3.expr.with_item,
    eYo.t3.expr.xor_expr_all,
]
eYo.t3.all.part_statements = [ // count 14
    eYo.t3.stmt.classdef_part,
    eYo.t3.stmt.elif_part,
    eYo.t3.stmt.else_part,
    eYo.t3.stmt.except_part,
    eYo.t3.stmt.finally_part,
    eYo.t3.stmt.for_part,
    eYo.t3.stmt.funcdef_part,
    eYo.t3.stmt.if_part,
    eYo.t3.stmt.last_else_part,
    eYo.t3.stmt.try_else_part,
    eYo.t3.stmt.try_part,
    eYo.t3.stmt.void_except_part,
    eYo.t3.stmt.while_part,
    eYo.t3.stmt.with_part,
]
eYo.t3.all.Simple_statements = [ // count 14
    eYo.t3.stmt.classdef_part,
    eYo.t3.stmt.elif_part,
    eYo.t3.stmt.else_part,
    eYo.t3.stmt.except_part,
    eYo.t3.stmt.finally_part,
    eYo.t3.stmt.for_part,
    eYo.t3.stmt.funcdef_part,
    eYo.t3.stmt.if_part,
    eYo.t3.stmt.last_else_part,
    eYo.t3.stmt.try_else_part,
    eYo.t3.stmt.try_part,
    eYo.t3.stmt.void_except_part,
    eYo.t3.stmt.while_part,
    eYo.t3.stmt.with_part,
]
eYo.t3.all.Compound_statements = [ // count 0
]

eYo.t3.all.ContainsStatement = function(type) {
  return eYo.t3.all.part_statements.indexOf(type)>=0
  || eYo.t3.all.Simple_statements.indexOf(type)>=0
  || eYo.t3.all.Compound_statements.indexOf(type)>=0
}

eYo.t3.all.ContainsExpression = function(type) {
  return eYo.t3.all.Core_expressions.indexOf(type)>=0
  || eYo.t3.all.lists.indexOf(type)>=0
  || eYo.t3.all.wrappers.indexOf(type)>=0
}

eYo.t3.all.Contains = function(type) {
  return eYo.t3.all.ContainsStatement(type)
  || eYo.t3.all.ContainsExpression(type)
}

