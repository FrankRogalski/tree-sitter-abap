const globals = {
  require: "readonly",
  module: "readonly",
  __dirname: "readonly",
  grammar: "readonly",
  seq: "readonly",
  choice: "readonly",
  repeat: "readonly",
  repeat1: "readonly",
  optional: "readonly",
  field: "readonly",
  alias: "readonly",
  token: "readonly",
  prec: "readonly",
};

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^\\$|^_", varsIgnorePattern: "^\\$|^_" },
      ],
      "no-unused-expressions": "error",
    },
  },
];
