// Helpers for flight HTML -> flight details (Time, Cities, etc.)

// Additional Functions that could be added:
// Scheduled Aircraft, Nonstop, Arrival time, Travel Time

const fs = require("fs");

// flight html -> flight number
function flightNumber(flight) {
  return flight
    .split('class="flight-segments--flight-number">')[1]
    .split("<")[0];
}

// flight html -> flight date  (mm/dd/yy)
function flightDate(flight) {
  return flight.split('"flight-detail--heading-date">')[1].split(" ")[0];
}

// flight html -> departure time (hh:mm AM/PM)
function flightDepartureTime(flight) {
  // remove all blank spaces and new lines
  flight = flight.replace(/\s+/g, "").replace(/\n+/g, "");

  let depatureString = flight.split("Departs</span>")[2].split("</span>")[0];
  // is
  return depatureString.split('<spanclass="time--period">').join(" ");
}

// flight html -> departure city
function flightFromCity(flight) {
  // make flight html all one line
  flight = flight.replace(/\n+/g, "");

  // isolate city and code string
  let cityAndCode = flight
    .split('class="flight-segments--station-name">')[1]
    .split("<")[0];

  // isolate city
  return cityAndCode.split("-")[0].trim();
}

// flight html -> departure airport code
function flightFromCode(flight) {
  // make flight html all one line
  flight = flight.replace(/\n+/g, "");

  // isolate city and code string
  let cityAndCode = flight
    .split('class="flight-segments--station-name">')[1]
    .split("<")[0];

  // isolate city
  return cityAndCode.split("-")[1].trim();
}

// flight html -> arrival city
function flightToCity(flight) {
  // make flight html all one line
  flight = flight.replace(/\n+/g, "");

  // isolate city and code string
  let cityAndCode = flight
    .split('class="flight-segments--station-name">')[2]
    .split("<")[0];

  // isolate city
  return cityAndCode.split("-")[0].trim();
}

// flight html -> Arrival city
function flightToCode(flight) {
  // make flight html all one line
  flight = flight.replace(/\n+/g, "");

  // isolate city and code string
  let cityAndCode = flight
    .split('class="flight-segments--station-name">')[2]
    .split("<")[0];

  // isolate city
  return cityAndCode.split("-")[1].trim();
}

module.exports = {
  flightNumber: flightNumber,
  flightDate: flightDate,
  flightDepartureTime: flightDepartureTime,
  flightFromCity: flightFromCity,
  flightFromCode: flightFromCode,
  flightToCity: flightToCity,
  flightToCode: flightToCode,
};
