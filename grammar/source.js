const declarations = require("./parts/declarations");
const sql = require("./parts/sql");
const statements = require("./parts/statements");

module.exports = {
  name: "abap",

  word: $ => $.name,

  extras: $ => [/\s+/, $.eol_comment, $.bol_comment],

  conflicts: $ => [
    [$.select_statement, $.select_loop_statement],
    [$._data_object, $.host_variable],
    [$.loop_statement, $.loop_block_statement],
    [$.member_access_statement, $.member_access_incomplete],
    [$.try_block],
    [$.catch_statement],
    [$.catch_block],
  ],

  rules: {
    program: $ => repeat($._statement),
    ...declarations,
    ...sql,
    ...statements,
  },
};
