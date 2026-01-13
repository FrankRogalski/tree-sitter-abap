const { kw } = require("../helpers");

module.exports = {
  select_statement: $ => seq($.select_statement_body, "."),

  select_loop_statement: $ =>
    seq(
      $.select_statement_body,
      ".",
      repeat($._implementation_statement),
      kw("endselect"),
      ".",
    ),

  select_statement_body: $ => seq(kw("select"), repeat1($.select_clause)),

  select_clause: $ =>
    choice(
      $.select_single_clause,
      $.select_distinct_clause,
      $.select_for_update_clause,
      $.sql_field_list,
      $.sql_from,
      $.sql_for_all_entries,
      $.sql_where,
      $.sql_group_by,
      $.sql_having,
      $.sql_order_by,
      $.sql_into,
      $.sql_up_to,
      $.sql_offset,
      $.sql_client,
      $.sql_bypassing_buffer,
      $.sql_package_size,
    ),

  select_single_clause: $ => kw("single"),

  select_distinct_clause: $ => kw("distinct"),

  select_for_update_clause: $ => seq(kw("for"), kw("update")),

  sql_field_list: $ =>
    choice("*", seq($.sql_field, repeat(seq(",", $.sql_field)))),

  sql_field: $ => seq($.sql_field_expr, optional(seq(kw("as"), $.name))),

  sql_field_expr: $ =>
    choice(
      $.sql_path,
      $.sql_aggregation,
      $.table_expression,
      $.numeric_literal,
      $.character_literal,
    ),

  sql_path: $ => seq($.name, repeat(seq("~", $.name))),

  sql_aggregation: $ =>
    seq(
      choice(kw("count"), kw("sum"), kw("avg"), kw("min"), kw("max")),
      "(",
      choice("*", $.sql_field_expr),
      ")",
    ),

  sql_from: $ => seq(kw("from"), $.sql_from_source, repeat($.sql_join)),

  sql_from_source: $ => seq($.sql_path, optional(seq(kw("as"), $.name))),

  sql_join: $ =>
    seq(
      optional(
        choice(kw("inner"), kw("left"), kw("right"), kw("full"), kw("cross")),
      ),
      kw("join"),
      $.sql_from_source,
      optional(seq(kw("on"), $._sql_condition)),
    ),

  sql_for_all_entries: $ =>
    seq(kw("for"), kw("all"), kw("entries"), kw("in"), $.name),

  sql_where: $ => seq(kw("where"), $._sql_condition),

  sql_group_by: $ => seq(kw("group"), kw("by"), $.sql_group_by_list),

  sql_group_by_list: $ =>
    seq($.sql_field_expr, repeat(seq(",", $.sql_field_expr))),

  sql_having: $ => seq(kw("having"), $._sql_condition),

  sql_order_by: $ => seq(kw("order"), kw("by"), $.sql_order_by_list),

  sql_order_by_list: $ =>
    seq($.sql_order_by_item, repeat(seq(",", $.sql_order_by_item))),

  sql_order_by_item: $ =>
    seq($.sql_field_expr, optional(choice(kw("asc"), kw("desc")))),

  sql_into: $ =>
    choice($.sql_into_list, $.sql_into_structure, $.sql_into_table),

  sql_into_list: $ =>
    seq(kw("into"), "(", $.sql_target, repeat(seq(",", $.sql_target)), ")"),

  sql_into_structure: $ =>
    seq(
      kw("into"),
      optional(seq(kw("corresponding"), kw("fields"), kw("of"))),
      $.sql_target,
    ),

  sql_into_table: $ =>
    seq(
      choice(kw("into"), kw("appending")),
      optional(seq(kw("corresponding"), kw("fields"), kw("of"))),
      kw("table"),
      $.sql_target,
    ),

  sql_target: $ => seq(optional("@"), $._data_object),

  sql_up_to: $ =>
    seq(kw("up"), kw("to"), $._general_expression_position, kw("rows")),

  sql_offset: $ => seq(kw("offset"), $._general_expression_position),

  sql_client: $ => seq(kw("client"), kw("specified")),

  sql_bypassing_buffer: $ => seq(kw("bypassing"), kw("buffer")),

  sql_package_size: $ =>
    seq(kw("package"), kw("size"), $._general_expression_position),

  _sql_condition: $ => $._logical_expression,
};
