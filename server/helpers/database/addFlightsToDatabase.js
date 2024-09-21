const fs = require("fs");
const { capitalizeEachWord } = require("./databaseHelpers");

function addFlightsToDatabase({
  firstName,
  lastName,
  confirmationNumber,
  flights,
  email,
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

  console.log("Flights successfully added to the database.");
}

exports.addFlightsToDatabase = addFlightsToDatabase;
