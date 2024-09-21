const fs = require("fs");
const { DateTime } = require("luxon");
const Cron = require("croner");
const { runCron } = require("./runCron");

// reschedule the cron jobs when the server restarts
function setUpCronJobs() {
  let numUpcomingFlights = 0;
  let confirmationNumbers = [];

  // get all flights in database
  const flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  flightData.forEach((flight) => {
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    const hoursUntilCheckIn = checkInTime
      .diff(currentTime, "hours")
      .toObject().hours;

    // set up cron job if the check in time is upcoming, and a cronjob has not been set up for that confirmation number
    if (
      hoursUntilCheckIn > 0 &&
      !confirmationNumbers.includes(flight.confirmationNumber)
    ) {
      numUpcomingFlights += 1;
      confirmationNumbers = [...confirmationNumbers, flight.confirmationNumber];

      console.log(
        "Setting up a check in for a flight with UTC time: ",
        flight.checkInUTCString
      );

      let job = Cron(
        flight.checkInUTCString,
        {
          timezone: "UTC",
        },
        () => {
          runCron();
        }
      );
    }
  });

  console.log(
    `Server restarted: Set up cron jobs for ${numUpcomingFlights} upcoming flight(s)`
  );
}

exports.setUpCronJobs = setUpCronJobs;
