require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Cron = require("croner");

const {
  writeFlightsToDatabase,
  getFlightDetails,
} = require("./helpers/databaseHelpers");
const { getFlights, checkIn } = require("./helpers/puppeteerHelpers");
const { DateTime } = require("luxon");
const { sendEmail } = require("./helpers/emailHelpers");

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sw.garrettroell.com"],
  })
);

app.get("/", (_req, res) => {
  res.send("Hello world from southwest check in backend");
});

// function to get upcoming flights
app.get("/upcoming-flights", (_req, res) => {
  console.log("sending upcoming flights");

  // get all flights in database
  const flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  const upcomingFlights = flightData.filter((flight) => {
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    const hoursUntilCheckIn = checkInTime
      .diff(currentTime, "hours")
      .toObject().hours;

    return hoursUntilCheckIn > 0;
  });

  res.send(upcomingFlights);
});

app.post("/set-up", async (req, res) => {
  try {
    // get user's first name, last name, confirmation number, and email from req body
    let { firstName, lastName, confirmationNumber } = req.body;

    // get list of flight objects using puppeteer
    const flights = await getFlights({
      firstName,
      lastName,
      confirmationNumber,
    });

    // handle the case where the flight information is found
    if (flights.length > 0) {
      // write the user info to the database, and get back a boolean that indicates if the reservation is new to database
      const isNewReservation = writeFlightsToDatabase({
        flights,
        firstName,
        lastName,
        confirmationNumber,
      });

      // only schedule a cron task for a new reservation.
      if (isNewReservation) {
        console.log("5. scheduling cron jobs");
        flights.forEach((flight) => {
          let job = Cron(
            // "2022-07-18T03:50:00", // test code
            flight.checkInUTCString,
            {
              timezone: "UTC",
            },
            () => {
              runCron();
            }
          );
        });
      } else {
        console.log("5. Cronjob is already scheduled.");
      }

      // send flight details to the front end
      console.log("6. Sent data to user");

      // send email for tracking
      sendEmail({
        subject: `New Southwest set up: ${firstName} ${lastName}`,
        text: `Confirmation number: ${confirmationNumber}. ${JSON.stringify(
          flights,
          null,
          2
        )}`,
      });

      res.json(flights);
    }
    // handle the case where the flight information is NOT found
    else {
      res.json({});
    }
  } catch (e) {
    console.log(e);
    // handle error case
    res.json({});
  }
});

// function to run on cron job
function runCron() {
  console.log("Cron function running");

  // get all flights in database
  const flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  let confirmationNumbers = [];

  // filter to isolate flights within 24 hours of their check in time
  const upcomingFlights = flightData.filter((flight) => {
    // get difference in hours between current time and check in time
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    const diffInHours = checkInTime.diff(currentTime, "hours").toObject().hours;

    if (
      diffInHours < 0.5 &&
      diffInHours > -0.5 &&
      !confirmationNumbers.includes(flight.confirmationNumber)
    ) {
      console.log(
        `Checking into a flight since the check in time is in ${diffInHours} hours`
      );
      confirmationNumbers = [...confirmationNumbers, flight.confirmationNumber];
    }

    // only check into flights that are between 23.5 and 24.5 hours away,
    // and that have a unique confirmation number
    return (
      diffInHours < 0.5 &&
      diffInHours > -0.5 &&
      !confirmationNumbers.includes(flight.confirmationNumber)
    );
  });

  // check into each applicable flight
  upcomingFlights.forEach((flight) => {
    checkIn({
      confirmationNumber: flight.confirmationNumber,
      firstName: flight.firstName,
      lastName: flight.lastName,
    });
  });
}

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

setUpCronJobs();

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});
