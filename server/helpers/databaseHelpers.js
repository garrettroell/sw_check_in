const fs = require("fs");

async function writeFlightsToDatabase({
  firstName,
  lastName,
  confirmationNumber,
  flights,
}) {
  // read flight data file
  let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  // add each flight to the javascript object
  flights.forEach((flight) => {
    flightData = [
      ...flightData,
      {
        firstName: firstName,
        lastName: lastName,
        confirmationNumber: confirmationNumber,
        date: flight.date,
        departureTime: flight.departureTime,
        departureTimezone: flight.departureTimezone,
        departureDateTime: flight.departureDateTime,
        checkInTime: flight.checkInTime,
        checkInCronString: flight.checkInCronString,
        number: flight.number,
        fromCity: flight.fromCity,
        fromCode: flight.fromCode,
        toCity: flight.toCity,
        toCode: flight.toCode,
      },
    ];
  });

  console.log(flightData);

  // save updated flight data object
  fs.writeFileSync("data/flights.json", JSON.stringify(flightData));
}

function getFlightDetails() {
  console.log("getting details");

  // read flight data file
  let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  return flightData;
}

exports.writeFlightsToDatabase = writeFlightsToDatabase;
exports.getFlightDetails = getFlightDetails;

// test code area
// console.log(getFlightDetails());

// writeFlightsToDatabase({
//   firstName: "Ryan",
//   lastName: "Maddox",
//   confirmationNumber: "32QQC7",
//   flights: [{ flight1: "This is a test" }, { flight2: "This is another test" }],
// });
