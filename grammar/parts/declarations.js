const { kw } = require("../helpers");

module.exports = {
  _typing: $ => choice($.generic_typing, $.complete_typing),

  generic_typing: $ =>
    choice(seq(kw("type"), $.generic_type), seq(kw("like"), $.name)),

  complete_typing: $ =>
    choice(
      seq(kw("type"), alias($.name, $.type)),
      seq(kw("type"), kw("ref"), kw("to"), alias($.name, $.type)),
    ),

  generic_type: $ => choice(kw("any"), seq(kw("any"), kw("table"))),

  _data_object_typing: $ =>
    choice(
      $._data_object_typing_normal,
      $._data_object_typing_reference,
      $._data_object_typing_itabs,
    ),

  _data_object_typing_normal: $ =>
    seq(
      choice(
        seq(
          kw("type"),
          optional(seq(kw("line"), kw("of"))),
          alias($.name, $.type),
        ),
        seq(kw("like"), optional(seq(kw("line"), kw("of"))), $._data_object),
      ),
      optional(
        seq(
          kw("value"),
          choice(
            $.name,
            $.numeric_literal,
            $.character_literal,
            seq(kw("is"), kw("initial")),
          ),
        ),
      ),
      optional(kw("read-only")),
    ),

  _data_object_typing_reference: $ =>
    seq(
      choice(
        seq(kw("type"), kw("ref"), kw("to"), alias($.name, $.type)),
        seq(kw("like"), kw("ref"), kw("to"), $.name),
      ),
      optional(seq(kw("value"), kw("is"), kw("initial"))),
      optional(kw("read-only")),
    ),

  _data_object_typing_itabs: $ =>
    seq(
      choice(
        seq(
          kw("type"),
          choice(optional(kw("standard")), kw("sorted"), kw("hashed")),
          kw("table"),
          kw("of"),
          optional(seq(kw("ref"), kw("to"))),
          alias($.name, $.type),
        ),
        seq(
          kw("like"),
          choice(optional(kw("standard")), kw("sorted"), kw("hashed")),
          kw("table"),
          kw("of"),
          $.name,
        ),
      ),
    ),

  variable_declaration: $ =>
    seq(
      kw("data"),
      field("name", $.name),
      field("typing", alias($._data_object_typing, $.typing)),
      ".",
    ),

  chained_variable_declaration: $ =>
    seq(
      kw("data"),
      ":",
      repeat1(choice($.variable, seq(",", $.variable))),
      ".",
    ),

  variable: $ => seq($.name, alias($._data_object_typing, $.typing)),

  class_data_declaration: $ =>
    seq(
      kw("class-data"),
      field("name", $.name),
      field("typing", alias($._data_object_typing, $.typing)),
      ".",
    ),

  chained_class_data_declaration: $ =>
    seq(
      kw("class-data"),
      ":",
      repeat1(choice($.class_data_entry, seq(",", $.class_data_entry))),
      ".",
    ),

  class_data_entry: $ => seq($.name, alias($._data_object_typing, $.typing)),

  statics_declaration: $ =>
    seq(
      kw("statics"),
      field("name", $.name),
      field("typing", alias($._data_object_typing, $.typing)),
      ".",
    ),

  chained_statics_declaration: $ =>
    seq(
      kw("statics"),
      ":",
      repeat1(choice($.static_entry, seq(",", $.static_entry))),
      ".",
    ),

  static_entry: $ => seq($.name, alias($._data_object_typing, $.typing)),

  chained_structure_declaration: $ =>
    seq(
      kw("data"),
      ":",
      kw("begin"),
      kw("of"),
      alias($.name, $.strucure_name),
      optional(kw("read-only")),
      ",",
      alias(repeat1($.structure_component), $.structure_components),
      kw("end"),
      kw("of"),
      alias($.name, $.strucure_name),
      ".",
    ),

  structure_component: $ => seq($.name, $._typing, ","),

  constants_declaration: $ =>
    seq(
      kw("constants"),
      field("name", $.name),
      field("typing", alias($._data_object_typing, $.typing)),
      ".",
    ),

  chained_constants_declaration: $ =>
    seq(
      kw("constants"),
      ":",
      repeat1(choice($.constant, seq(",", $.constant))),
      ".",
    ),

  constant: $ => seq($.name, alias($._data_object_typing, $.typing)),

  types_declaration: $ =>
    seq(
      kw("types"),
      field("name", $.name),
      field("typing", alias($._data_object_typing, $.typing)),
      ".",
    ),

  chained_types_declaration: $ =>
    seq(
      kw("types"),
      ":",
      repeat1(choice($.type_entry, seq(",", $.type_entry))),
      ".",
    ),

  type_entry: $ => seq($.name, alias($._data_object_typing, $.typing)),

  types_structure_declaration: $ =>
    seq(
      kw("types"),
      ":",
      repeat1(
        choice($.types_structure_entry, seq(",", $.types_structure_entry)),
      ),
      ".",
    ),

  types_structure_entry: $ =>
    seq(
      kw("begin"),
      kw("of"),
      alias($.name, $.strucure_name),
      ",",
      alias(repeat1($.structure_component), $.structure_components),
      kw("end"),
      kw("of"),
      alias($.name, $.strucure_name),
    ),

  field_symbol_declaration: $ =>
    seq(
      kw("field-symbols"),
      alias($.field_symbol_name, $.name),
      $._typing,
      ".",
    ),

  chained_field_symbol_declaration: $ =>
    seq(
      kw("field-symbols"),
      ":",
      repeat1(choice($.field_symbol, seq(",", $.field_symbol))),
      ".",
    ),

  field_symbol: $ => seq(alias($.field_symbol_name, $.name), $._typing),

  parameters_declaration: $ =>
    seq(
      kw("parameters"),
      field("name", $.name),
      field("typing", alias($._data_object_typing, $.typing)),
      ".",
    ),

  chained_parameters_declaration: $ =>
    seq(
      kw("parameters"),
      ":",
      repeat1(choice($.parameter_entry, seq(",", $.parameter_entry))),
      ".",
    ),

  parameter_entry: $ => seq($.name, alias($._data_object_typing, $.typing)),

  events_declaration: $ => seq(kw("events"), field("name", $.name), "."),

  chained_events_declaration: $ =>
    seq(
      kw("events"),
      ":",
      repeat1(choice($.event_entry, seq(",", $.event_entry))),
      ".",
    ),

  event_entry: $ => $.name,

  aliases_declaration: $ =>
    seq(
      kw("aliases"),
      field("name", $.name),
      kw("for"),
      field("target", $._data_object),
      ".",
    ),

  chained_aliases_declaration: $ =>
    seq(
      kw("aliases"),
      ":",
      repeat1(choice($.alias_entry, seq(",", $.alias_entry))),
      ".",
    ),

  alias_entry: $ => seq($.name, kw("for"), $._data_object),

  select_options_declaration: $ =>
    seq(
      kw("select-options"),
      field("name", $.name),
      kw("for"),
      field("target", $._data_object),
      ".",
    ),

  chained_select_options_declaration: $ =>
    seq(
      kw("select-options"),
      ":",
      repeat1(choice($.select_option_entry, seq(",", $.select_option_entry))),
      ".",
    ),

  select_option_entry: $ => seq($.name, kw("for"), $._data_object),
};
