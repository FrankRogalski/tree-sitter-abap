function kw(word) {
  return alias(new RegExp(word, "i"), word);
}

module.exports = { kw };
