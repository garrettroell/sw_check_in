const fs = require("fs");

async function writeFlightsToDatabase({
  firstName,
  lastName,
  confirmationNumber,
  flights,
}) {
  // read flight data file
  let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

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
      },
    ];
  });

  console.log(`The database has ${flightData.length} flights`);

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

  console.log(`The database has ${uniqueFlights.length} flights`);

  // save updated flight data object
  fs.writeFileSync("data/flights.json", JSON.stringify(uniqueFlights));
}

function capitalizeEachWord(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}

//
// function getFlightDetails() {
//   console.log("getting details");

//   // read flight data file
//   let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

//   return flightData;
// }

exports.writeFlightsToDatabase = writeFlightsToDatabase;
// exports.getFlightDetails = getFlightDetails;

// test code area
// console.log(getFlightDetails());

// writeFlightsToDatabase({
//   firstName: "Ryan",
//   lastName: "Maddox",
//   confirmationNumber: "32QQC7",
//   flights: [{ flight1: "This is a test" }, { flight2: "This is another test" }],
// });
