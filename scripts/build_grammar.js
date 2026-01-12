const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const target = path.join(root, "grammar.js");
const content = `const source = require("./grammar/source");\n\nmodule.exports = grammar(source);\n`;

fs.writeFileSync(target, content);
