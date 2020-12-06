const lineByLine = require('n-readlines');

const getHash = function() {
  const liner = new lineByLine('hashed.txt');
  const lines = [];
  let counter = 0
  while (line = liner.next()) {
      lines.push(line.toString())
      counter++
  }
  return {lines, counter}
}

module.exports = { getHash }