const fs = require("fs");

let data;
try {
  data = fs.readFileSync(
    "/Users/garrettroell/node_projects/sw_check_in/server/roundTrip.txt",
    "utf8"
  );
  // console.log(data);
} catch (err) {
  console.error(err);
}

// convert
function HTMLtoFlightList(html) {
  // remove the text after the flight details
  let trimmedText = html.split(
    '<section class="section icon-legend reservation--icon-legend"'
  )[0];

  // split into individual flights
  let flightList = trimmedText.split("checkout-flight-detail");

  // remove the text before the flight details
  flightList.shift();

  return flightList;
}

function flightNumber(flight) {
  return flight
    .split('class="flight-segments--flight-number">')[1]
    .split("<")[0];
}

function flightDate(flight) {
  return flight.split('"flight-detail--heading-date">')[1].split(" ")[0];
}

function flightDepartureTime(flight) {
  // remove all blank spaces and new lines
  flight = flight.replace(/\s+/g, "").replace(/\n+/g, "");

  let depatureString = flight.split("Departs</span>")[2].split("</span>")[0];
  // is
  return depatureString.split('<spanclass="time--period">').join(" ");
}

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

// Additional Functions that could be added:
// Scheduled Aircraft, Nonstop, Arrival time, Travel Time

// code to include in index.js
// const flights = HTMLtoFlightList(data);

// flights.forEach((flight) => {
//   console.log("number:", flightNumber(flight));
//   console.log("date", flightDate(flight));
//   console.log("time", flightDepartureTime(flight));
//   console.log("from city:", flightFromCity(flight));
//   console.log("from code:", flightFromCode(flight));
//   console.log("to city:", flightToCity(flight));
//   console.log("to code:", flightToCode(flight));
//   console.log();
// });

module.exports = {
  flightNumber: flightNumber,
  flightDate: flightDate,
  flightDepartureTime: flightDepartureTime,
  flightFromCity: flightFromCity,
  flightFromCode: flightFromCode,
  flightToCity: flightToCity,
  flightToCode: flightToCode,
};
