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

  console.log(
    "checkInTime:",
    `${time} on ${date}. (Time zone: ${departureTimezone})`
  );
  return `${_time} on ${_date}. (Time zone: ${departureTimezone})`;
}

function checkInCronString(flight) {
  const dateTimeString = `${flightDate(flight)} ${flightDepartureTime(flight)}`;

  // function to get a date object from date string
  let checkInDateTime = new Date(dateTimeString);

  // subtract one day from date object
  checkInDateTime.setHours(checkInDateTime.getHours() - 24);

  // get a luxon date time object
  let dt = DateTime.fromObject(
    {
      day: checkInDateTime.getDate(),
      hour: checkInDateTime.getHours(),
      minute: checkInDateTime.getMinutes(),
    },
    {
      zone: getTimezone(flightFromCode(flight)),
    }
  );

  // convert it to proper format and return it
  let dateString = dt.toString();

  console.log("Cron string:", dateString.split(".")[0]);

  return dateString.split(".")[0];
}

exports.getTimezone = getTimezone;
exports.getTimezoneOffset = getTimezoneOffset;
exports.checkInTime = checkInTime;
exports.checkInCronString = checkInCronString;
