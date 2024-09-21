// Functions for handling the time/timezones

const { DateTime } = require("luxon");
const airportTimezones = require("../../airportTimezones/airportTimezones.json");
const {
  flightDate,
  flightDepartureTime,
  flightFromCode,
} = require("../HTMLParsers/HTMLParsers");

// nicely print current time
function getCurrentTimeString() {
  const dt = DateTime.now();
  let dateString = dt.toISO();
  dateString = dateString.replace("T", " ");
  return dateString;
}

// airport code -> time zone (TZ Database Name)
function getTimezone(airportCode) {
  return airportTimezones.filter(function (airport) {
    return airportCode === airport.code;
  })[0].timezone;
}

// airport code -> time zone offset object (ex: {gmt: xx, dst: yy })
function getTimezoneOffset(airportCode) {
  return airportTimezones.filter(function (airport) {
    return airportCode === airport.code;
  })[0].offset;
}

// flight html -> check in string to print on front end (ex: "4:20 PM on March 4th (Timezone: America/Chicago)")
function checkInTime(flight) {
  const date = flightDate(flight);
  const time = flightDepartureTime(flight);
  const departureTimezone = getTimezone(flightFromCode(flight));

  // get datetime object from string and timezone
  const dateTimeString = `${date} ${time} ${departureTimezone}`;
  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "M/d/yy t z"
  ).setZone(departureTimezone);

  let checkInDateTime = flightDateTime.minus({ days: 1 });

  let _time = checkInDateTime.toLocaleString(DateTime.TIME_SIMPLE);
  let _date = checkInDateTime.toLocaleString(DateTime.DATE_FULL);

  return `${_time} on ${_date}. (Time zone: ${departureTimezone})`;
}

function flightToDateTime(flight) {
  const date = flightDate(flight);
  const time = flightDepartureTime(flight);
  const departureTimezone = getTimezone(flightFromCode(flight));

  // get datetime object from string and timezone
  const dateTimeString = `${date} ${time} ${departureTimezone}`;
  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "M/d/yy t z"
  ).setZone(departureTimezone);

  return flightDateTime;
}

// This function does NOT use flight HTML as input.
// It uses a flight object as input
function daysUntilFlight(flight) {
  const dateTimeString = `${flight.date} ${flight.departureTime} ${flight.departureTimezone}`;
  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "M/d/yy t z"
  ).setZone(flight.departureTimezone);

  return flightDateTime.diffNow("days").days;
}

function checkInUTCString(flight) {
  // get flight data
  const flightDateTime = flightToDateTime(flight);

  // subtract a day and set to utc time
  const checkInDateTime = flightDateTime.plus({ days: -1, minutes: -1 });
  const cronDateTime = checkInDateTime.setZone("UTC");
  let cronString = cronDateTime.toString();
  return cronString.split(".")[0];

  // test code to run two minutes after adding data to database
  // const tempDateTime = DateTime.now().setZone("UTC").plus({ minutes: 2 });
  // console.log(tempDateTime.toString().split(".")[0]);
  // return tempDateTime.toString().split(".")[0];
}

exports.getCurrentTimeString = getCurrentTimeString;
exports.getTimezone = getTimezone;
exports.getTimezoneOffset = getTimezoneOffset;
exports.checkInTime = checkInTime;
exports.checkInUTCString = checkInUTCString;
exports.flightToDateTime = flightToDateTime;
exports.daysUntilFlight = daysUntilFlight;
