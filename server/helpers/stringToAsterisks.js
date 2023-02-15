function stringToAsterisks(inputString) {
  let asterisks = "";
  for (let i = 0; i < inputString.length; i++) {
    asterisks += "*";
  }
  return asterisks;
}

exports.stringToAsterisks = stringToAsterisks;
