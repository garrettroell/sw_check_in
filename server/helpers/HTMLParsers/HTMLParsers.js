// Helpers for flight HTML -> flight details (Time, Cities, etc.)

// Additional Functions that could be added:
// Scheduled Aircraft, Nonstop, Arrival time, Travel Time

const fs = require("fs");
const cheerio = require("cheerio");

// flight html -> flight number
// function flightNumber(flight) {
//   return flight
//     .split('class="flight-segments--flight-number">')[1]
//     .split("<")[0];
// }

// // flight html -> flight date  (mm/dd/yy)
// function flightDate(flight) {
//   return flight.split('"flight-detail--heading-date">')[1].split(" ")[0];
// }

// // flight html -> departure time (hh:mm AM/PM)
// function flightDepartureTime(flight) {
//   // remove all blank spaces and new lines
//   flight = flight.replace(/\s+/g, "").replace(/\n+/g, "");

//   let depatureString = flight.split("Departs</span>")[2].split("</span>")[0];
//   // is
//   return depatureString.split('<spanclass="time--period">').join(" ");
// }

// // flight html -> departure city
// function flightFromCity(flight) {
//   // make flight html all one line
//   flight = flight.replace(/\n+/g, "");

//   // isolate city and code string
//   let cityAndCode = flight
//     .split('class="flight-segments--station-name">')[1]
//     .split("<")[0];

//   // isolate city
//   return cityAndCode.split("-")[0].trim();
// }

// // flight html -> departure airport code
// function flightFromCode(flight) {
//   // make flight html all one line
//   flight = flight.replace(/\n+/g, "");

//   // isolate city and code string
//   let cityAndCode = flight
//     .split('class="flight-segments--station-name">')[1]
//     .split("<")[0];

//   // isolate city
//   return cityAndCode.split("-")[1].trim();
// }

// // flight html -> arrival city
// function flightToCity(flight) {
//   // make flight html all one line
//   flight = flight.replace(/\n+/g, "");

//   let numAirports = flight.split(
//     'class="flight-segments--station-name">'
//   ).length;

//   // isolate city and code string
//   let cityAndCode = flight
//     .split('class="flight-segments--station-name">')
//     [numAirports - 1].split("<")[0];

//   // isolate city
//   return cityAndCode.split("-")[0].trim();
// }

// // flight html -> Arrival airport code
// function flightToCode(flight) {
//   // make flight html all one line
//   flight = flight.replace(/\n+/g, "");

//   let numAirports = flight.split(
//     'class="flight-segments--station-name">'
//   ).length;

//   // isolate city and code string from the last airport in the section
//   // (To get final destination, not a layover stop)
//   let cityAndCode = flight
//     .split('class="flight-segments--station-name">')
//     [numAirports - 1].split("<")[0];

//   // isolate city
//   return cityAndCode.split("-")[1].trim();
// }

// successful check in page html -> boarding position
function checkInHTMLToBoardingPosition(checkInHTML) {
  let boardingPosition = checkInHTML
    .split('<span class="swa-g-screen-reader-only">Boarding position')[1]
    .split("</span>")[0];

  return boardingPosition.trim();
}

function parseFlight(flightHtml) {
  const $ = cheerio.load(flightHtml);

  function findText(selector, matchFn) {
    return $(selector)
      .filter((_, el) => matchFn($(el).text().trim()))
      .first();
  }

  const date = findText("div", (text) =>
    /^\w{3}, \w+ \d{1,2}, \d{4}$/.test(text)
  ).text();

  const number = findText("div", (text) => /^WN\d+/.test(text)).text();

  const depLabel = $("div")
    .filter((_, el) => $(el).text().trim() === "Departs")
    .first();
  const depSegment = depLabel.closest("div.segment__726LC");
  const fromCity = depSegment.find(".text__BKvsn").first().text().trim();
  const fromCodeRaw = depSegment.find(".cityAndStationCode__VHuyu").text();
  const fromCode = fromCodeRaw.split("-")[1]?.trim() || "";

  const depTimeEl = depSegment.find(".segmentTime__nZavU").first();
  const departureTime = depTimeEl.length
    ? `${depTimeEl.children().eq(0).text().trim()} ${depTimeEl
        .children()
        .eq(1)
        .text()
        .trim()}`
    : "";

  const arrLabel = $("div")
    .filter((_, el) => $(el).text().trim() === "Arrives")
    .first();
  const arrSegment = arrLabel.closest("div.segment__726LC");
  const toCity = arrSegment.find(".text__BKvsn").first().text().trim();
  const toCodeRaw = arrSegment.find(".cityAndStationCode__VHuyu").text();
  const toCode = toCodeRaw.split("-")[1]?.trim() || "";

  return {
    date,
    number,
    departureTime,
    fromCity,
    fromCode,
    toCity,
    toCode,
  };
}

module.exports = {
  parseFlight: parseFlight,
  flightNumber: flightNumber,
  flightDate: flightDate,
  flightDepartureTime: flightDepartureTime,
  flightFromCity: flightFromCity,
  flightFromCode: flightFromCode,
  flightToCity: flightToCity,
  flightToCode: flightToCode,
  checkInHTMLToBoardingPosition: checkInHTMLToBoardingPosition,
};
