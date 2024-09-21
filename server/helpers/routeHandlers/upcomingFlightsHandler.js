const fs = require("fs");
const { DateTime } = require("luxon");
const { stringToAsterisks } = require("../database/databaseHelpers");

async function upcomingFlightsHandler() {
  // get all flights in database
  const flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  // only send the information needed for the front end
  const processedFlightData = flightData.map((flight) => {
    // hide sensitive info
    const hiddenFirstName = stringToAsterisks(flight.firstName);
    const hiddenLastName = stringToAsterisks(flight.lastName);
    const hiddenConfirmationNumber =
      flight.confirmationNumber[0] +
      stringToAsterisks(flight.confirmationNumber.slice(1, 5)) +
      flight.confirmationNumber[5];

    return {
      firstName: hiddenFirstName,
      lastName: hiddenLastName,
      confirmationNumber: hiddenConfirmationNumber,
      checkInUTCString: flight.checkInUTCString,
      departureTimezone: flight.departureTimezone,
      date: flight.date,
      departureTime: flight.departureTime,
    };
  });

  console.log("processedFlightData", processedFlightData);

  // only send flights that have check in times in the future
  let upcomingFlights = processedFlightData.filter((flight) => {
    const currentTime = DateTime.now(); // Get the current time in UTC
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    }); // Parse the check-in time from the ISO string

    // Check if the parsed check-in time is valid
    if (!checkInTime.isValid) {
      console.error(`Invalid checkInUTCString: ${flight.checkInUTCString}`);
      return false; // Skip the flight if the check-in time is invalid
    }

    // Calculate the difference in hours between the check-in time and current time
    const hoursUntilCheckIn = checkInTime.diff(currentTime, "hours").hours;

    console.log(
      `Checking in ${flight.firstName} ${flight.lastName} ${flight.confirmationNumber} in ${hoursUntilCheckIn} hours`
    );

    // Return true if the check-in time is in the future
    return hoursUntilCheckIn > 0;
  });

  console.log(upcomingFlights);

  // sort the flights so the soonest flight is listed first
  upcomingFlights.sort(function (a, b) {
    const dateA = new Date(a.checkInUTCString).getTime();
    const dateB = new Date(b.checkInUTCString).getTime();
    return dateA - dateB;
  });

  return upcomingFlights;
}

exports.upcomingFlightsHandler = upcomingFlightsHandler;
