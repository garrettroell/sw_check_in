// Functions for handling the time/timezones

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

// flight html -> check in Time (epoch time in ms)
// TODO: need to timezone of departure airpoint vs users timezone to update display
// (Have not completely thought this one out yet)
function checkInEpoch(flight) {
  const dateTimeString = `${flightDate(flight)} ${flightDepartureTime(flight)}`;

  // function to get a date object from date string
  let checkInDateTime = new Date(dateTimeString);

  return 696969696969;
}

// flight html -> check in string to print on front end (ex: "4:20 PM on March 4th (Timezone: America/Chicago)")
function checkInTime(flight) {
  const dateTimeString = `${flightDate(flight)} ${flightDepartureTime(flight)}`;

  // function to get a date object from date string
  let checkInDateTime = new Date(dateTimeString);

  // subtract one day from date object
  checkInDateTime.setHours(checkInDateTime.getHours() - 24);

  // format date time
  let timeAndDate = getTimeAndDate(checkInDateTime);
  let departureTimezone = getTimezone(flightFromCode(flight));

  return `${timeAndDate}. (${departureTimezone})`;
}

// formats date to:
function getTimeAndDate(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Check whether AM or PM
  var AmPm = hours >= 12 ? "PM" : "AM";

  // Find current hour in AM-PM Format
  hours = hours % 12;

  // To display "0" as "12"
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // get month, day, and year
  const month = months[date.getMonth()];
  const _date = date.getDate() + 1;
  const suffix = ordinal_suffix(_date);
  const year = date.getFullYear();

  return `${hours}:${minutes} ${AmPm} on ${month} ${_date}${suffix}, ${year}`;
}

// number -> suffix ('st' or 'nd')
function ordinal_suffix($num) {
  $num = $num % 100; // protect against large numbers
  if ($num < 11 || $num > 13) {
    switch ($num % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
    }
  }
  return "th";
}

exports.getTimezone = getTimezone;
exports.getTimezoneOffset = getTimezoneOffset;
exports.checkInTime = checkInTime;
exports.checkInEpoch = checkInEpoch;
// exports.getTimeAndDate = getTimeAndDate;
