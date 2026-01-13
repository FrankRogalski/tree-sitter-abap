const { kw } = require("../helpers");

module.exports = {
  _statement: $ =>
    choice(
      $.class_declaration,
      $.class_implementation,
      $.class_publication,
      $.class_local_friend_publication,
      $.interface_declaration,
      $.function_implementation,
      $._implementation_statement,
    ),

  _implementation_statement: $ =>
    choice(
      $.variable_declaration,
      $.chained_variable_declaration,
      $.chained_structure_declaration,
      $.class_data_declaration,
      $.chained_class_data_declaration,
      $.statics_declaration,
      $.chained_statics_declaration,
      $.constants_declaration,
      $.chained_constants_declaration,
      $.types_declaration,
      $.chained_types_declaration,
      $.types_structure_declaration,
      $.parameters_declaration,
      $.chained_parameters_declaration,
      $.select_options_declaration,
      $.chained_select_options_declaration,
      $.events_declaration,
      $.chained_events_declaration,
      $.aliases_declaration,
      $.chained_aliases_declaration,
      $.loop_statement,
      $.loop_block_statement,
      $.field_symbol_declaration,
      $.chained_field_symbol_declaration,
      $.exit_statement,
      $.continue_statement,
      $.perform_statement,
      $.report_statement,
      $.program_statement,
      $.if_statement,
      $.case_statement,
      $.do_statement,
      $.while_statement,
      $.at_statement,
      $.on_change_statement,
      $.module_statement,
      $.chain_statement,
      $.return_statement,
      $.check_statement,
      $.method_declaration_class,
      $.class_method_declaration_class,
      $.assignment,
      $.member_access_statement,
      $.member_access_incomplete,
      $.select_statement,
      $.select_loop_statement,
      $.insert_statement,
      $.update_statement,
      $.delete_statement,
      $.modify_statement,
      $.read_table_statement,
      $.open_dataset_statement,
      $.read_dataset_statement,
      $.transfer_statement,
      $.shift_statement,
      $.replace_statement,
      $.find_statement,
      $.concatenate_statement,
      $.collect_statement,
      $.commit_statement,
      $.move_corresponding_statement,
      $.translate_statement,
      $.call_transaction_statement,
      $.submit_statement,
      $.search_statement,
      $.create_data_statement,
      $.set_parameter_statement,
      $.get_parameter_statement,
      $.split_statement,
      $.sort_statement,
      $.open_cursor_statement,
      $.try_catch_statement,
      $.write_statement,
      $.chained_write_statement,
      $.call_method,
      $.call_method_static,
      $.call_method_instance,
      $.call_function,
      $.raise_exception_statement,
      $.clear_statement,
      $.append_statement,
      $.create_object_statement,
      $.include_statement,
      $.macro_include,
      $.raise_statement,
      $.form_statement,
      $.catch_system_exceptions_statement,
    ),

  class_declaration: $ =>
    seq(
      kw("class"),
      field("name", $.name),
      kw("definition"),
      optional(kw("public")),
      optional(seq(kw("inheriting"), kw("from"), field("superclass", $.name))),
      optional(kw("abstract")),
      optional(kw("final")),
      optional($._create_addition),
      optional(seq(kw("shared"), kw("memory"), kw("enabled"))),
      optional(
        seq(
          optional(kw("global")),
          kw("friends"),
          field("friends", repeat1($.name)),
        ),
      ),
      ".",
      optional($.public_section),
      optional($.protected_section),
      optional($.private_section),
      kw("endclass"),
      ".",
    ),

  _create_addition: $ =>
    seq(kw("create"), choice(kw("public"), kw("protected"), kw("private"))),

  public_section: $ =>
    seq(kw("public"), kw("section"), ".", repeat($._class_components)),

  protected_section: $ =>
    seq(kw("protected"), kw("section"), ".", repeat($._class_components)),

  private_section: $ =>
    seq(kw("private"), kw("section"), ".", repeat($._class_components)),

  _class_components: $ =>
    choice(
      $.variable_declaration,
      $.class_data_declaration,
      $.statics_declaration,
      $.constants_declaration,
      $.types_declaration,
      $.parameters_declaration,
      $.select_options_declaration,
      $.events_declaration,
      $.aliases_declaration,
      alias($.method_declaration_class, $.method_declaration),
      $.constructor_declaration,
      $.method_redefinition,
      alias($.class_method_declaration_class, $.class_method_declaration),
      $.class_constructor_declaration,
    ),

  class_implementation: $ =>
    seq(
      kw("class"),
      field("name", $.name),
      kw("implementation"),
      ".",
      repeat($.method_implementation),
      kw("endclass"),
      ".",
    ),

  method_declaration_class: $ =>
    seq(
      kw("methods"),
      field("name", $.name),
      optional(choice(kw("abstract"), kw("final"))),
      field("importing_parameters", optional($._method_declaration_importing)),
      field("exporting_parameters", optional($._method_declaration_exporting)),
      field("changing_parameters", optional($._method_declaration_changing)),
      optional($.returning_parameter),
      field("raising", optional($._method_declaration_raising)),
      field("exceptions", optional($._method_declaration_exceptions)),
      ".",
    ),

  _method_declaration_importing: $ =>
    seq(kw("importing"), repeat1($.method_parameters)),

  _method_declaration_exporting: $ =>
    seq(kw("exporting"), repeat1($.method_parameters)),

  _method_declaration_changing: $ =>
    seq(kw("changing"), repeat1($.method_parameters)),

  _method_declaration_raising: $ =>
    seq(
      kw("raising"),
      repeat1(choice($.name, seq(kw("resumable"), "(", $.name, ")"))),
    ),

  _method_declaration_exceptions: $ => seq(kw("exceptions"), repeat1($.name)),

  method_parameters: $ =>
    seq(
      choice(
        seq(kw("value"), "(", $.name, ")"),
        seq(kw("reference"), "(", $.name, ")"),
        $._operand,
      ),
      $._typing,
      optional(choice(kw("optional"), seq(kw("default"), $.name))),
    ),

  returning_parameter: $ =>
    seq(kw("returning"), kw("value"), "(", $.name, ")", $.complete_typing),

  constructor_declaration: $ =>
    seq(
      kw("methods"),
      kw("constructor"),
      optional(kw("final")),
      field("importing_parameters", optional($._method_declaration_importing)),
      field("raising", optional($._method_declaration_raising)),
      field("exceptions", optional($._method_declaration_exceptions)),
      ".",
    ),

  class_constructor_declaration: $ =>
    seq(kw("class-methods"), kw("class_constructor"), "."),

  method_redefinition: $ =>
    seq(kw("methods"), $.name, optional(kw("final")), kw("redefinition"), "."),

  class_method_declaration_class: $ =>
    seq(
      kw("class-methods"),
      field("name", $.name),
      field("importing_parameters", optional($._method_declaration_importing)),
      field("exporting_parameters", optional($._method_declaration_exporting)),
      field("changing_parameters", optional($._method_declaration_changing)),
      optional($.returning_parameter),
      field("raising", optional($._method_declaration_raising)),
      field("exceptions", optional($._method_declaration_exceptions)),
      ".",
    ),

  class_method_declaration_interface: $ =>
    seq(
      kw("class-methods"),
      field("name", $.name),
      optional(seq(kw("default"), choice(kw("ignore"), kw("fail")))),
      field("importing_parameters", optional($._method_declaration_importing)),
      field("exporting_parameters", optional($._method_declaration_exporting)),
      field("changing_parameters", optional($._method_declaration_changing)),
      optional($.returning_parameter),
      field("raising", optional($._method_declaration_raising)),
      field("exceptions", optional($._method_declaration_exceptions)),
      ".",
    ),

  method_implementation: $ =>
    seq(
      kw("method"),
      field("name", $.name),
      ".",
      optional($.method_body),
      kw("endmethod"),
      ".",
    ),

  method_body: $ => repeat1($._implementation_statement),

  class_publication: $ =>
    seq(
      kw("class"),
      field("name", $.name),
      kw("definition"),
      kw("deferred"),
      optional(kw("public")),
      ".",
    ),

  class_local_friend_publication: $ =>
    seq(
      kw("class"),
      field("name", $.name),
      kw("definition"),
      kw("local"),
      kw("friends"),
      field("friends", repeat1($.name)),
      ".",
    ),

  interface_declaration: $ =>
    seq(
      kw("interface"),
      field("name", $.name),
      optional(kw("public")),
      ".",
      repeat($._interface_components),
      kw("endinterface"),
      ".",
    ),

  _interface_components: $ =>
    choice(
      $.variable_declaration,
      alias($.method_declaration_interface, $.method_declaration),
      alias($.class_method_declaration_interface, $.class_method_declaration),
    ),

  method_declaration_interface: $ =>
    seq(
      kw("methods"),
      field("name", $.name),
      optional(seq(kw("default"), choice(kw("ignore"), kw("fail")))),
      field("importing_parameters", optional($._method_declaration_importing)),
      field("exporting_parameters", optional($._method_declaration_exporting)),
      field("changing_parameters", optional($._method_declaration_changing)),
      optional($.returning_parameter),
      field("raising", optional($._method_declaration_raising)),
      field("exceptions", optional($._method_declaration_exceptions)),
      ".",
    ),

  loop_statement: $ =>
    seq(
      kw("loop"),
      kw("at"),
      field("target", choice($.name, kw("screen"))),
      repeat(choice($.loop_result, $.loop_clause)),
      ".",
    ),

  loop_block_statement: $ =>
    seq(
      kw("loop"),
      kw("at"),
      field("target", choice($.name, kw("screen"))),
      repeat(choice($.loop_result, $.loop_clause)),
      ".",
      // FIXME: not all statements are allowed in loop body
      repeat($._statement),
      kw("endloop"),
      ".",
    ),

  loop_result: $ =>
    seq(choice(kw("into"), kw("assigning")), field("result", $._data_object)),

  loop_clause: $ =>
    choice(
      $.loop_clause_from,
      $.loop_clause_to,
      $.loop_clause_step,
      $.loop_clause_where,
      $.loop_clause_using_key,
      $.loop_clause_group_by,
    ),

  loop_clause_from: $ => seq(kw("from"), $._general_expression_position),

  loop_clause_to: $ => seq(kw("to"), $._general_expression_position),

  loop_clause_step: $ => seq(kw("step"), $._general_expression_position),

  loop_clause_where: $ => seq(kw("where"), $._logical_expression),

  loop_clause_using_key: $ => seq(kw("using"), kw("key"), $.name),

  loop_clause_group_by: $ =>
    seq(
      kw("group"),
      kw("by"),
      $.loop_group_by_spec,
      optional(choice(kw("ascending"), kw("descending"))),
      optional(seq(kw("without"), kw("members"))),
    ),

  loop_group_by_spec: $ =>
    choice(
      $._general_expression_position,
      seq("(", repeat1($.loop_group_by_component), ")"),
    ),

  loop_group_by_component: $ =>
    seq($.name, "=", $._general_expression_position),

  at_statement: $ =>
    seq(
      kw("at"),
      choice(
        kw("first"),
        kw("last"),
        seq(kw("new"), $.name),
        seq(kw("end"), kw("of"), $.name),
      ),
      ".",
      repeat($._statement),
      kw("endat"),
      ".",
    ),

  on_change_statement: $ =>
    seq(
      kw("on"),
      kw("change"),
      kw("of"),
      repeat1($.name),
      ".",
      repeat($._statement),
      kw("endon"),
      ".",
    ),

  module_statement: $ =>
    seq(
      kw("module"),
      $.name,
      optional(choice(kw("input"), kw("output"))),
      ".",
      repeat($._statement),
      kw("endmodule"),
      ".",
    ),

  chain_statement: $ =>
    seq(
      kw("chain"),
      ".",
      repeat($.chain_field),
      optional($.chain_end_clause),
      repeat($._statement),
      kw("endchain"),
      ".",
    ),

  chain_field: $ =>
    choice(
      seq(kw("field"), $.name, optional(kw("module")), "."),
      seq(kw("field"), $.name, "."),
    ),

  chain_end_clause: $ => seq(kw("end"), kw("chain"), "."),

  exit_statement: $ => seq(kw("exit"), "."),

  continue_statement: $ => seq(kw("continue"), "."),

  perform_statement: $ => seq(kw("perform"), field("name", $.name), "."),

  return_statement: $ => seq(kw("return"), "."),

  member_access_statement: $ =>
    prec.right(
      seq(
        choice($.name, $.field_symbol_name),
        token.immediate(choice("->", "=>")),
        $.name,
        ".",
      ),
    ),

  member_access_incomplete: $ =>
    seq(
      choice($.name, $.field_symbol_name),
      token.immediate(choice("->", "=>")),
    ),

  report_statement: $ => seq(kw("report"), $.name, "."),

  program_statement: $ => seq(kw("program"), $.name, "."),

  if_statement: $ =>
    seq(
      kw("if"),
      $._logical_expression,
      ".",
      //FIXME: not all statements are allowed in statement_block
      repeat($._statement),
      repeat($.elseif_block),
      optional($.else_block),
      kw("endif"),
      ".",
    ),

  elseif_block: $ =>
    seq(kw("elseif"), $._logical_expression, ".", repeat($._statement)),

  else_block: $ => seq(kw("else"), ".", repeat($._statement)),

  case_statement: $ =>
    seq(
      kw("case"),
      optional(kw("type")),
      $._general_expression_position,
      ".",
      repeat1($.case_when),
      optional($.case_when_others),
      kw("endcase"),
      ".",
    ),

  case_when: $ =>
    seq(
      kw("when"),
      choice(
        $._general_expression_position,
        seq(kw("type"), $.name),
        seq(kw("type"), kw("of"), $.name),
      ),
      ".",
      repeat($._statement),
    ),

  case_when_others: $ =>
    seq(kw("when"), kw("others"), ".", repeat($._statement)),

  do_statement: $ =>
    seq(
      kw("do"),
      optional(seq($._general_expression_position, kw("times"))),
      ".",
      repeat($._statement),
      kw("enddo"),
      ".",
    ),

  while_statement: $ =>
    seq(
      kw("while"),
      $._logical_expression,
      ".",
      repeat($._statement),
      kw("endwhile"),
      ".",
    ),

  check_statement: $ => seq(kw("check"), $._logical_expression, "."),

  _logical_expression: $ =>
    choice(
      $.comparison_expression,
      prec.right(4, seq(kw("not"), $._logical_expression)),
      prec.left(1, seq($._logical_expression, kw("or"), $._logical_expression)),
      prec.left(
        2,
        seq($._logical_expression, kw("and"), $._logical_expression),
      ),
      prec.left(5, seq($._operand, kw("is"), kw("initial"))),
    ),

  comparison_expression: $ =>
    seq(
      $._general_expression_position,
      choice("=", kw("eq"), "<>", kw("ne")),
      $._general_expression_position,
    ),

  _general_expression_position: $ =>
    choice(
      $.numeric_literal,
      $.character_literal,
      $._data_object,
      $._calculation_expression,
    ),

  _calculation_expression: $ => choice($.arithmetic_expression),

  arithmetic_expression: $ =>
    choice(
      prec.left(
        1,
        seq(
          $._general_expression_position,
          "+",
          $._general_expression_position,
        ),
      ),
      prec.left(
        1,
        seq(
          $._general_expression_position,
          "-",
          $._general_expression_position,
        ),
      ),
      prec.left(
        2,
        seq(
          $._general_expression_position,
          "*",
          $._general_expression_position,
        ),
      ),
      prec.left(
        2,
        seq(
          $._general_expression_position,
          "/",
          $._general_expression_position,
        ),
      ),
      prec.left(
        2,
        seq(
          $._general_expression_position,
          "DIV",
          $._general_expression_position,
        ),
      ),
      prec.left(
        2,
        seq(
          $._general_expression_position,
          "MOD",
          $._general_expression_position,
        ),
      ),
      prec.left(
        3,
        seq(
          $._general_expression_position,
          "**",
          $._general_expression_position,
        ),
      ),
    ),

  _writeable_expression: $ =>
    choice(
      // inline declaration
      // constructor expression
      $.table_expression,
    ),

  table_expression: $ =>
    seq(
      field("itab", $.name),
      token.immediate("[ "),
      //"[",
      field(
        "line_spec",
        choice(
          $._general_expression_position,
          alias($._table_expression_free_key, $.free_key),
          //alias($._table_expression_table_key, $.table_key)
        ),
      ),
      //token.immediate(" ]")
      "]",
    ),

  _table_expression_free_key: $ => repeat1($.comp_spec),

  comp_spec: $ =>
    seq(
      field("component", $.name),
      "=",
      field("operand", $._general_expression_position),
    ),

  insert_statement: $ => seq(kw("insert"), repeat1($.insert_part), "."),

  insert_part: $ =>
    choice(
      $._general_expression_position,
      $.insert_into_clause,
      $.insert_into_table_clause,
      $.insert_values_clause,
      $.insert_from_clause,
      $.insert_table_clause,
      $.insert_accepting_clause,
      $.insert_assigning_clause,
      $.insert_reference_clause,
    ),

  insert_into_clause: $ => seq(kw("into"), $.name),

  insert_into_table_clause: $ =>
    seq(kw("into"), kw("table"), $._general_expression_position),

  insert_values_clause: $ => seq(kw("values"), $._general_expression_position),

  insert_from_clause: $ =>
    seq(kw("from"), optional(kw("table")), $._general_expression_position),

  insert_table_clause: $ => seq(kw("table"), $._general_expression_position),

  insert_accepting_clause: $ =>
    seq(kw("accepting"), kw("duplicate"), kw("keys")),

  insert_assigning_clause: $ => seq(kw("assigning"), $._data_object),

  insert_reference_clause: $ =>
    seq(kw("reference"), kw("into"), $._data_object),

  update_statement: $ => seq(kw("update"), repeat1($.update_part), "."),

  update_part: $ =>
    choice(
      $._general_expression_position,
      $.update_from_clause,
      $.update_set_clause,
      $.update_where_clause,
      $.update_indicators_clause,
      $.update_table_clause,
    ),

  update_from_clause: $ =>
    seq(kw("from"), optional(kw("table")), $._general_expression_position),

  update_set_clause: $ =>
    seq(
      kw("set"),
      $._logical_expression,
      repeat(seq(",", $._logical_expression)),
    ),

  update_where_clause: $ => seq(kw("where"), $._logical_expression),

  update_indicators_clause: $ =>
    seq(kw("indicators"), kw("set"), kw("structure"), $.name),

  update_table_clause: $ => seq(kw("table"), $._general_expression_position),

  delete_statement: $ => seq(kw("delete"), repeat1($.delete_part), "."),

  delete_part: $ =>
    choice(
      $._general_expression_position,
      $.delete_from_clause,
      $.delete_where_clause,
      $.delete_from_table_clause,
    ),

  delete_from_clause: $ => seq(kw("from"), $._general_expression_position),

  delete_from_table_clause: $ =>
    seq(kw("from"), kw("table"), $._general_expression_position),

  delete_where_clause: $ => seq(kw("where"), $._logical_expression),

  modify_statement: $ => seq(kw("modify"), repeat1($.modify_part), "."),

  modify_part: $ =>
    choice(
      $._general_expression_position,
      $.modify_from_clause,
      $.modify_table_clause,
    ),

  modify_from_clause: $ =>
    seq(kw("from"), optional(kw("table")), $._general_expression_position),

  modify_table_clause: $ => seq(kw("table"), $._general_expression_position),

  read_table_statement: $ =>
    seq(
      kw("read"),
      kw("table"),
      field("itab", $.name),
      repeat(
        choice(
          $.read_table_with_key,
          $.read_table_index,
          $.read_table_from,
          $.read_table_result,
          $.read_table_binary_search,
        ),
      ),
      ".",
    ),

  read_table_with_key: $ =>
    seq(
      kw("with"),
      kw("key"),
      repeat1(seq($.name, "=", $._general_expression_position)),
    ),

  read_table_index: $ => seq(kw("index"), $._general_expression_position),

  read_table_from: $ => seq(kw("from"), $._data_object),

  read_table_binary_search: $ => seq(kw("binary"), kw("search")),

  read_table_result: $ =>
    choice(
      seq(kw("into"), $._data_object),
      seq(kw("assigning"), $._data_object),
      seq(kw("transporting"), kw("no"), kw("fields")),
    ),

  open_dataset_statement: $ =>
    seq(
      kw("open"),
      kw("dataset"),
      repeat1(choice($._data_object, $.open_dataset_for_clause)),
      ".",
    ),

  open_dataset_for_clause: $ =>
    seq(
      kw("for"),
      optional(
        choice(kw("input"), kw("output"), kw("update"), kw("appending")),
      ),
    ),

  read_dataset_statement: $ =>
    seq(
      kw("read"),
      kw("dataset"),
      repeat1(
        choice(
          $._data_object,
          $.read_dataset_into_clause,
          $.read_dataset_length_clause,
        ),
      ),
      ".",
    ),

  read_dataset_into_clause: $ => seq(kw("into"), $._data_object),

  read_dataset_length_clause: $ =>
    seq(kw("maximum"), kw("length"), $._general_expression_position),

  transfer_statement: $ =>
    seq(
      kw("transfer"),
      repeat1(
        choice(
          $._general_expression_position,
          $.transfer_to_clause,
          $.transfer_length_clause,
        ),
      ),
      ".",
    ),

  transfer_to_clause: $ => seq(kw("to"), $._data_object),

  transfer_length_clause: $ =>
    seq(kw("length"), $._general_expression_position),

  shift_statement: $ =>
    seq(kw("shift"), repeat1(choice($._data_object, $.mode_clause)), "."),

  replace_statement: $ =>
    seq(
      kw("replace"),
      optional(seq(kw("all"), kw("occurrences"), kw("of"))),
      $._general_expression_position,
      kw("in"),
      $._data_object,
      repeat(choice($.mode_clause, $.case_clause)),
      ".",
    ),

  find_statement: $ =>
    seq(
      kw("find"),
      $._general_expression_position,
      optional($.find_in_clause),
      repeat(choice($.mode_clause, $.case_clause)),
      ".",
    ),

  find_in_clause: $ => seq(kw("in"), $._data_object),

  concatenate_statement: $ =>
    seq(
      kw("concatenate"),
      repeat1(
        choice(
          $._general_expression_position,
          $.concatenate_into_clause,
          $.concatenate_mode_clause,
        ),
      ),
      ".",
    ),

  concatenate_into_clause: $ => seq(kw("into"), $._data_object),

  concatenate_mode_clause: $ => $.mode_clause,

  collect_statement: $ =>
    seq(
      kw("collect"),
      repeat1(
        choice(
          $._general_expression_position,
          $.collect_into_clause,
          $.collect_assigning_clause,
        ),
      ),
      ".",
    ),

  collect_into_clause: $ => seq(kw("into"), $._data_object),

  collect_assigning_clause: $ => seq(kw("assigning"), $._data_object),

  commit_statement: $ =>
    seq(
      kw("commit"),
      optional(kw("work")),
      optional(seq(kw("and"), kw("wait"))),
      ".",
    ),

  move_corresponding_statement: $ =>
    seq(
      kw("move-corresponding"),
      repeat1(
        choice(
          $._data_object,
          $.move_corresponding_to_clause,
          $.move_corresponding_expand_clause,
          $.move_corresponding_keep_clause,
        ),
      ),
      ".",
    ),

  move_corresponding_to_clause: $ => seq(kw("to"), $._data_object),

  move_corresponding_expand_clause: $ =>
    seq(kw("expanding"), kw("nested"), kw("tables")),

  move_corresponding_keep_clause: $ =>
    seq(kw("keeping"), kw("target"), kw("lines")),

  translate_statement: $ =>
    seq(
      kw("translate"),
      repeat1(
        choice($._data_object, $.translate_to_clause, $.translate_using_clause),
      ),
      ".",
    ),

  translate_to_clause: $ =>
    seq(
      kw("to"),
      choice(seq(kw("upper"), kw("case")), seq(kw("lower"), kw("case"))),
    ),

  translate_using_clause: $ => seq(kw("using"), $._data_object),

  call_transaction_statement: $ =>
    seq(
      kw("call"),
      kw("transaction"),
      $.character_literal,
      repeat(
        choice(
          $.call_transaction_with_clause,
          $.call_transaction_without_clause,
        ),
      ),
      ".",
    ),

  call_transaction_with_clause: $ =>
    seq(kw("with"), optional(kw("authority-check"))),

  call_transaction_without_clause: $ =>
    seq(kw("without"), kw("authority-check")),

  submit_statement: $ =>
    seq(
      kw("submit"),
      $.name,
      repeat(
        choice($.submit_selection_set_clause, $.submit_selection_sets_clause),
      ),
      ".",
    ),

  submit_selection_set_clause: $ =>
    seq(kw("using"), kw("selection-set"), $._data_object),

  submit_selection_sets_clause: $ =>
    seq(
      kw("using"),
      kw("selection-sets"),
      kw("of"),
      kw("program"),
      $._data_object,
    ),

  search_statement: $ =>
    seq(
      kw("search"),
      $._data_object,
      repeat(choice($.search_for_clause, $.mode_clause)),
      ".",
    ),

  search_for_clause: $ => seq(kw("for"), $._general_expression_position),

  create_data_statement: $ =>
    seq(
      kw("create"),
      kw("data"),
      $.name,
      repeat(
        choice(
          $.create_data_type_handle_clause,
          $.create_data_type_clause,
          $.create_data_like_clause,
        ),
      ),
      ".",
    ),

  create_data_type_handle_clause: $ =>
    seq(kw("type"), kw("handle"), $._data_object),

  create_data_type_clause: $ => seq(kw("type"), $._data_object),

  create_data_like_clause: $ => seq(kw("like"), $._data_object),

  set_parameter_statement: $ =>
    seq(
      kw("set"),
      kw("parameter"),
      kw("id"),
      $.character_literal,
      repeat($.parameter_field_clause),
      ".",
    ),

  get_parameter_statement: $ =>
    seq(
      kw("get"),
      kw("parameter"),
      kw("id"),
      $.character_literal,
      repeat($.parameter_field_clause),
      ".",
    ),

  parameter_field_clause: $ => seq(kw("field"), $._data_object),

  mode_clause: $ =>
    seq(
      kw("in"),
      optional(choice(kw("byte"), kw("character"))),
      optional(kw("mode")),
    ),

  case_clause: $ =>
    choice(seq(kw("ignoring"), kw("case")), seq(kw("respecting"), kw("case"))),

  split_statement: $ =>
    seq(
      kw("split"),
      field("source", $._general_expression_position),
      repeat(choice($.split_at_clause, $.split_into_clause)),
      ".",
    ),

  split_at_clause: $ => seq(kw("at"), $._general_expression_position),

  split_into_clause: $ =>
    choice(
      seq(kw("into"), kw("table"), $._data_object),
      seq(kw("into"), repeat1($._data_object)),
    ),

  sort_statement: $ =>
    seq(kw("sort"), field("itab", $.name), repeat($.sort_clause), "."),

  sort_clause: $ =>
    choice(
      $.sort_by_clause,
      $.sort_order_clause,
      $.sort_as_text_clause,
      $.sort_stable_clause,
    ),

  sort_by_clause: $ => seq(kw("by"), repeat1($.name)),

  sort_order_clause: $ => choice(kw("ascending"), kw("descending")),

  sort_as_text_clause: $ => seq(kw("as"), kw("text")),

  sort_stable_clause: $ => kw("stable"),

  open_cursor_statement: $ =>
    seq(
      kw("open"),
      kw("cursor"),
      optional($.open_cursor_hold),
      field("cursor", $.name),
      optional($.open_cursor_for),
      optional($.open_cursor_hold),
      ".",
    ),

  open_cursor_hold: $ => seq(kw("with"), kw("hold")),

  open_cursor_for: $ => seq(kw("for"), $.select_statement_body),

  inline_declaration: $ =>
    choice($.inline_data, $.inline_final, $.inline_field_symbol),

  inline_data: $ => seq(kw("data"), "(", $.name, ")"),

  inline_final: $ => seq(kw("final"), "(", $.name, ")"),

  inline_field_symbol: $ =>
    seq(kw("field-symbol"), "(", $.field_symbol_name, ")"),

  _data_object: $ =>
    choice(
      $.name,
      $.host_variable,
      $.field_symbol_name,
      $.structured_data_object,
      $.attribute_access_static,
      $.inline_declaration,
    ),

  host_variable: $ => seq("@", $.name),

  structured_data_object: $ =>
    seq(
      alias(choice($.name, $.field_symbol_name), $.structure_name),
      repeat1(seq(token.immediate("-"), alias($.name, $.component_name))),
    ),

  attribute_access_static: $ =>
    seq(
      field("class", $.name),
      token.immediate("=>"),
      field("attribute", $.name),
    ),

  assignment: $ =>
    seq(
      choice($._data_object, $._writeable_expression),
      "=",
      $._general_expression_position,
      ".",
    ),

  try_catch_statement: $ =>
    seq(
      kw("try"),
      ".",
      optional($.try_block),
      repeat($.catch_statement),
      optional($.cleanup_block),
      kw("endtry"),
      ".",
    ),

  try_block: $ => repeat1($._statement),

  catch_statement: $ =>
    seq(
      kw("catch"),
      field("exception", repeat1($.name)),
      optional(seq(kw("into"), field("oref", $.name))),
      ".",
      optional($.catch_block),
    ),

  catch_block: $ => repeat1($._statement),

  cleanup_block: $ => seq(kw("cleanup"), ".", repeat($._statement)),

  catch_system_exceptions_statement: $ =>
    seq(
      kw("catch"),
      kw("system-exceptions"),
      repeat1($.system_exception_binding),
      ".",
      repeat($._statement),
      kw("endcatch"),
      ".",
    ),

  system_exception_binding: $ =>
    seq($.name, "=", $._general_expression_position),

  write_statement: $ =>
    seq(kw("write"), optional("/"), $._general_expression_position, "."),

  chained_write_statement: $ =>
    seq(
      kw("write"),
      ":",
      optional("/"),
      repeat1(
        choice(
          $._general_expression_position,
          seq(",", $._general_expression_position),
        ),
      ),
      ".",
    ),

  call_method: $ =>
    seq(
      field("name", $.name),
      token.immediate("("),
      field(
        "parameters",
        optional(
          choice(
            $._general_expression_position,
            $.parameter_list,
            $._explicit_parameter_list,
          ),
        ),
      ),
      ")",
      ".",
    ),

  parameter_list: $ => repeat1($.parameter_binding),

  _explicit_parameter_list: $ =>
    seq(
      repeat1(
        choice(
          seq(kw("exporting"), $.parameter_list),
          seq(kw("importing"), $.parameter_list),
          seq(kw("changing"), $.parameter_list),
          seq(kw("receiving"), $.parameter_binding),
        ),
      ),
    ),

  parameter_list_exporting: $ => repeat1($.parameter_binding),

  parameter_binding: $ =>
    seq(
      field("formal_parameter", $.name),
      "=",
      field("actual_parameter", $._general_expression_position),
    ),

  parameter_binding_exporting: $ =>
    seq(
      field("formal_parameter", $.name),
      "=",
      field("actual_parameter", $.name),
    ),

  call_method_static: $ =>
    seq(
      field("class_name", $.name),
      token.immediate("=>"),
      field("method_name", $.name),
      token.immediate("("),
      field(
        "parameters",
        optional(
          choice(
            $._general_expression_position,
            $.parameter_list,
            $._explicit_parameter_list,
          ),
        ),
      ),
      ")",
      ".",
    ),

  call_method_instance: $ =>
    seq(
      field("instance_name", $.name),
      token.immediate("->"),
      field("method_name", $.name),
      token.immediate("("),
      field(
        "parameters",
        optional(
          choice(
            $._general_expression_position,
            $.parameter_list,
            $._explicit_parameter_list,
          ),
        ),
      ),
      ")",
      ".",
    ),

  call_function: $ =>
    seq(
      kw("call"),
      kw("function"),
      field("name", $.character_literal),
      repeat(
        choice(
          $.function_parameter_clause,
          $.exception_list,
          $.parameter_table_clause,
          $.exception_table_clause,
        ),
      ),
      ".",
    ),

  parameter_table_clause: $ => seq(kw("parameter-table"), $._data_object),

  exception_table_clause: $ => seq(kw("exception-table"), $._data_object),

  function_parameter_clause: $ =>
    choice(
      seq(kw("exporting"), alias($.parameter_list_exporting, $.parameter_list)),
      seq(kw("importing"), $.parameter_list),
      seq(kw("changing"), $.parameter_list),
    ),

  exception_list: $ => seq(kw("exceptions"), repeat1($.return_code_binding)),

  return_code_binding: $ =>
    seq(
      field("exception", $.name),
      "=",
      field("return_code", $.numeric_literal),
    ),

  raise_exception_statement: $ =>
    seq(
      kw("raise"),
      kw("exception"),
      choice(
        seq(
          kw("type"),
          field("class", $.name),
          optional(field("parameters", seq(kw("exporting"), $.parameter_list))),
        ),
        field("oref", $.name),
      ),
      ".",
    ),

  clear_statement: $ =>
    seq(
      kw("clear"),
      repeat1(choice($._data_object, $.clear_with_clause, $.mode_clause)),
      ".",
    ),

  clear_with_clause: $ => seq(kw("with"), $._data_object),

  append_statement: $ =>
    seq(
      kw("append"),
      repeat1(
        choice(
          $._data_object,
          $.append_to_clause,
          $.append_assigning_clause,
          $.append_reference_clause,
        ),
      ),
      ".",
    ),

  append_to_clause: $ => seq(kw("to"), $._data_object),

  append_assigning_clause: $ => seq(kw("assigning"), $._data_object),

  append_reference_clause: $ =>
    seq(kw("reference"), kw("into"), $._data_object),

  create_object_statement: $ =>
    seq(
      kw("create"),
      kw("object"),
      $.name,
      repeat(
        choice(
          $.create_object_exporting_clause,
          $.create_object_parameter_table_clause,
          $.create_object_exception_table_clause,
          $.create_object_exceptions_clause,
        ),
      ),
      ".",
    ),

  create_object_exporting_clause: $ =>
    seq(kw("exporting"), field("parameters", $.parameter_list)),

  create_object_parameter_table_clause: $ =>
    seq(kw("parameter-table"), $._data_object),

  create_object_exception_table_clause: $ =>
    seq(kw("exception-table"), $._data_object),

  create_object_exceptions_clause: $ =>
    seq(
      kw("exceptions"),
      repeat1(seq($.name, "=", $._general_expression_position)),
    ),

  include_statement: $ =>
    seq(
      kw("include"),
      choice($.name, $.field_symbol_name),
      optional(seq(kw("if"), kw("found"))),
      ".",
    ),

  macro_include: $ =>
    seq(
      field("name", $.name),
      optional(
        alias(repeat1($._general_expression_position), $.parameter_list),
      ),
      ".",
    ),

  function_implementation: $ =>
    seq(
      kw("function"),
      field("name", $.name),
      ".",
      repeat($._implementation_statement),
      kw("endfunction"),
      ".",
    ),

  form_statement: $ =>
    seq(
      kw("form"),
      field("name", $.name),
      ".",
      repeat($._implementation_statement),
      kw("endform"),
      ".",
    ),

  raise_statement: $ => seq(kw("raise"), $.name, "."),

  _operand: $ => choice($._escaped_operand, $.name),

  _escaped_operand: $ => seq("!", $.name),

  numeric_literal: $ => /[0-9]+/,

  character_literal: $ => /'[^']+'/,

  eol_comment: $ => seq('"', /[^\n]*/),

  bol_comment: $ => seq("*", /[^\n]*/),

  name: $ => /[a-zA-Z_][a-zA-Z0-9_]{0,29}/i,

  field_symbol_name: $ => /<[a-zA-Z0-9_]{0,28}>/i,
};
