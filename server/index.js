require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
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
            // "2022-06-27T02:30:00", // test code
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

  // filter to isolate flights within 24 hours of their check in time
  const upcomingFlights = flightData.filter((flight) => {
    // get difference in hours between current time and check in time
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    const diffInHours = checkInTime.diff(currentTime, "hours").toObject().hours;

    if (diffInHours < 0.5 && diffInHours > -0.5) {
      console.log(
        `Checking into a flight since the check in time is in ${diffInHours} hours`
      );
    } else {
      console.log(
        `Not checking into a flight since the check in time is in ${diffInHours}`
      );
    }

    // only check into flights that are between 23.5 and 24.5 hours away
    return diffInHours < 0.5 && diffInHours > -0.5;
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

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});
