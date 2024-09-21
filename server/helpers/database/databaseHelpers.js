const fs = require("fs");

function getCheckInDelay(checkInTime, possibleFlight) {
  // slightly modify possible flight string so that javascript Date object understands it
  const possibleFlightTime = possibleFlight.checkInUTCString + ".000+00:00";

  // get the time in milliseconds of the check in time and the possible flight check in time
  const checkInMS = Date.parse(checkInTime);
  const possibleFlightMS = Date.parse(possibleFlightTime);

  const delayInSeconds = (checkInMS - possibleFlightMS) / 1000 - 60;

  return delayInSeconds;
}

// convert the position name to a number
function positionNameToNumber(positionName) {
  let positionNumber = parseInt(positionName.substring(1));

  const positionLetter = positionName[0];
  if (positionLetter === "B") {
    positionNumber += 60;
  }
  if (positionLetter === "C") {
    positionNumber += 120;
  }

  return positionNumber;
}

function capitalizeEachWord(string) {
  return string
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function stringToAsterisks(inputString) {
  let asterisks = "";
  for (let i = 0; i < inputString.length; i++) {
    asterisks += "*";
  }
  return asterisks;
}

exports.getCheckInDelay = getCheckInDelay;
exports.positionNameToNumber = positionNameToNumber;
exports.capitalizeEachWord = capitalizeEachWord;
exports.stringToAsterisks = stringToAsterisks;
