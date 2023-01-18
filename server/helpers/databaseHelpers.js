const fs = require("fs");

function writeFlightsToDatabase({
  firstName,
  lastName,
  confirmationNumber,
  flights,
  email,
}) {
  // read flight data file
  let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  let confirmationNumbers = flightData.map(
    (flight) => flight.confirmationNumber
  );

  // add each new flight to the javascript array. Capitalization is important to prevent duplicate information.
  flights.forEach((flight) => {
    flightData = [
      ...flightData,
      {
        firstName: capitalizeEachWord(firstName),
        lastName: capitalizeEachWord(lastName),
        confirmationNumber: confirmationNumber.toUpperCase(),
        date: flight.date,
        departureTime: flight.departureTime,
        departureTimezone: flight.departureTimezone,
        departureDateTime: flight.departureDateTime,
        checkInTime: flight.checkInTime,
        checkInUTCString: flight.checkInUTCString,
        number: flight.number,
        fromCity: flight.fromCity,
        fromCode: flight.fromCode,
        toCity: flight.toCity,
        toCode: flight.toCode,
        email: email ? email : "",
      },
    ];
  });

  // remove duplicate flights from database
  const uniqueFlights = flightData.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      flightData.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });

  // save updated flight data object
  fs.writeFileSync("data/flights.json", JSON.stringify(uniqueFlights));

  // if no duplicates were removed then this reservation is new
  // const isNewReservation = uniqueFlights.length === flightData.length;
  const isNewReservation = !confirmationNumbers.includes(confirmationNumber);

  return isNewReservation;
}

function capitalizeEachWord(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}

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

exports.writeFlightsToDatabase = writeFlightsToDatabase;
exports.writeToCheckInResults = writeToCheckInResults;

// writeToCheckInResults();

// writeFlightsToDatabase({
//   firstName: "Ryan",
//   lastName: "Maddox",
//   confirmationNumber: "32QQC7",
//   flights: [{ flight1: "This is a test" }, { flight2: "This is another test" }],
// });
