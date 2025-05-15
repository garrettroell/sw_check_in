// Functions for handling the time/timezones

const { DateTime } = require("luxon");

// nicely print current time
function getCurrentTimeString() {
  const dt = DateTime.now();
  let dateString = dt.toISO();
  dateString = dateString.replace("T", " ");
  return dateString;
}

// flight html -> check in string to print on front end (ex: "4:20 PM on March 4th (Timezone: America/Chicago)")

function checkInTime(flight) {
  const dateTimeString = `${flight.date} ${flight.departureTime} ${flight.departureTimezone}`;

  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "ccc, LLL dd, yyyy h:mm a z"
  );

  if (!flightDateTime.isValid) {
    console.error("Invalid DateTime:", flightDateTime.invalidExplanation);
    return "Invalid DateTime";
  }

  const checkInDateTime = flightDateTime.minus({ days: 1 });

  const _time = checkInDateTime.toLocaleString(DateTime.TIME_SIMPLE);
  const _date = checkInDateTime.toLocaleString(DateTime.DATE_FULL);

  return `${_time} on ${_date}. (Time zone: ${flight.departureTimezone})`;
}

function flightToDateTime(flight) {
  const dateTimeString = `${flight.date} ${flight.departureTime} ${flight.departureTimezone}`;

  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "ccc, LLL dd, yyyy h:mm a z"
  );

  if (!flightDateTime.isValid) {
    console.error("Invalid DateTime:", flightDateTime.invalidExplanation);
    return null;
  }

  return flightDateTime;
}

function checkInUTCString(flight) {
  // get flight data
  const flightDateTime = flightToDateTime(flight);

  // subtract a day and set to utc time
  const checkInDateTime = flightDateTime.plus({ days: -1, minutes: -1 });
  const cronDateTime = checkInDateTime.setZone("UTC");
  let cronString = cronDateTime.toString();
  return cronString.split(".")[0];
}

// This function does NOT use flight HTML as input.
// It uses a flight object as input
function daysUntilFlight(flight) {
  const dateTimeString = `${flight.date} ${flight.departureTime} ${flight.departureTimezone}`;
  const flightDateTime = DateTime.fromFormat(
    dateTimeString,
    "ccc, LLL dd, yyyy h:mm a z"
  );

  if (!flightDateTime.isValid) {
    console.error("Invalid DateTime:", flightDateTime.invalidExplanation);
    return NaN;
  }

  return flightDateTime.diffNow("days").days;
}

module.exports = {
  getCurrentTimeString,
  checkInTime,
  checkInUTCString,
  flightToDateTime,
  daysUntilFlight,
};
