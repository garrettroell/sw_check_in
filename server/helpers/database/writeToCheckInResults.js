const fs = require("fs");
const { getCheckInDelay, positionNameToNumber } = require("./databaseHelpers");

function writeToCheckInResults({
  confirmationNumber,
  boardingPosition,
  checkInClickTime,
  flights,
}) {
  let closestFlight = flights[0];
  let shortestDelay = getCheckInDelay(checkInClickTime, closestFlight);

  flights.forEach((flight) => {
    const delayInSeconds = getCheckInDelay(checkInClickTime, flight);

    if (delayInSeconds > 0 && delayInSeconds < shortestDelay) {
      closestFlight = flight;
      shortestDelay = delayInSeconds;
    }
  });

  // read flight data file
  let checkInResults = JSON.parse(
    fs.readFileSync("data/check_in_results.json")
  );

  checkInResults = [
    ...checkInResults,
    {
      delayInSeconds: shortestDelay,
      checkInUTCString: closestFlight.checkInUTCString,
      localTime: closestFlight.departureTime,
      departureTimezone: closestFlight.departureTimezone,
      confirmationNumber: confirmationNumber,
      positionName: boardingPosition,
      checkInTime: checkInClickTime,
      positionNumber: positionNameToNumber(boardingPosition),
    },
  ];

  fs.writeFileSync(
    "data/check_in_results.json",
    JSON.stringify(checkInResults)
  );

  console.log("Added result to check_in_results.json file");
}

exports.writeToCheckInResults = writeToCheckInResults;
