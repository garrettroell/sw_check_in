const fs = require("fs");

function isNewReservation(confirmationNumber) {
  // Read flight data file
  let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  // Check if the confirmation number already exists
  const confirmationNumbers = flightData.map(
    (flight) => flight.confirmationNumber
  );

  return !confirmationNumbers.includes(confirmationNumber.toUpperCase());
}

module.exports = isNewReservation;
