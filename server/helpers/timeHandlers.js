// Functions for handling the time/timezones

const { DateTime } = require("luxon");
var airportTimezone = require("./airportTimezones.json");

const {
  flightDate,
  flightDepartureTime,
  flightFromCode,
} = require("./HTMLparsers");

// airport code -> time zone (TZ Database Name)
function getTimezone(airportCode) {
  return airportTimezone.filter(function (airport) {
    return airportCode === airport.code;
  })[0].timezone;
}

// airport code -> time zone offset object (ex: {gmt: xx, dst: yy })
function getTimezoneOffset(airportCode) {
  return airportTimezone.filter(function (airport) {
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

function checkInCronString(flight) {
  // get flight data
  const date = flightDate(flight);
  const time = flightDepartureTime(flight);
  const departureTimezone = getTimezone(flightFromCode(flight));

  // get datetime object from string and timezone
  const dateTimeString = `${date} ${time} ${departureTimezone}`;
  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "M/d/yy t z"
  ).setZone(departureTimezone);

  const checkInDateTime = flightDateTime.plus({ days: -1 });

  const cronDateTime = checkInDateTime.setZone("UTC");

  let cronString = cronDateTime.toString();

  // return cronString.split(".")[0];

  const tempDateTime = DateTime.now().setZone("UTC").plus({ minutes: 2 });

  console.log(tempDateTime.toString().split(".")[0]);

  return tempDateTime.toString().split(".")[0];
}

exports.getTimezone = getTimezone;
exports.getTimezoneOffset = getTimezoneOffset;
exports.checkInTime = checkInTime;
exports.checkInCronString = checkInCronString;
