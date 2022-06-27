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

    console.log("flights that are about to get set up");
    console.log(flights);

    // handle the case where the flight information is found
    if (flights.length > 0) {
      // write the user info to the database
      await writeFlightsToDatabase({
        flights,
        firstName,
        lastName,
        confirmationNumber,
      });

      // schedule check in to occur at specified time (will need to do this for each flight)
      console.log("5. scheduling cron jobs");
      flights.forEach((flight) => {
        let job = Cron(
          "2022-06-27T02:30:00", // test code
          // flight.checkInUTCString,
          {
            timezone: "UTC",
          },
          () => {
            runCron();
          }
        );
      });

      // send flight details to the front end
      console.log("6. Sent data to user");

      // send email for tracking
      sendEmail({
        subject: `New Southwest set up: ${firstName} ${lastName}`,
        text: `Confirmation number: ${confirmationNumber}`,
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
async function runCron() {
  console.log("Cron function running");

  // get all flights in database
  let flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  // filter to isolate flights within 24 hours of their check in time
  const upcomingFlights = flightData.filter((flight) => {
    // get difference in hours between current time and check in time
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    var diffInHours = checkInTime.diff(currentTime, "hours").toObject().hours;

    console.log("diff in hours", diffInHours);

    // cut out flights with checkout times not close to current time
    // return diffInHours > 0 && diffInHours < 0.2;
    return diffInHours < 0;
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

// runCron();

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});
