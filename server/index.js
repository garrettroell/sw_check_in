require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Cron = require("croner");

const { writeFlightsToDatabase } = require("./helpers/databaseHelpers");
const { getFlights, checkIn } = require("./helpers/puppeteerHelpers");
const { DateTime } = require("luxon");
const {
  sendMonitoringEmail,
  sendUserEmail,
} = require("./helpers/emailHelpers");
const createNewSubmissionEmail = require("./helpers/createNewSubmissionEmail");

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

// an end point so that the front end can
app.get("/check-in-results", async (req, res) => {
  const checkInResults = fs.readFileSync(
    "./data/check_in_results.json",
    "utf-8"
  );

  res.send(JSON.parse(checkInResults));
});

app.post("/feedback", async (req, res) => {
  let { feedback, firstName, lastName } = req.body;
  sendMonitoringEmail({
    subject: `Southwest Feedback from ${firstName} ${lastName}`,
    text: `Feedback:\n${feedback}`,
  });
  res.sendStatus(200);
});

app.post("/set-up", async (req, res) => {
  try {
    // get user's first name, last name, confirmation number, and email from req body
    let { firstName, lastName, confirmationNumber, email } = req.body;

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
        email,
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

      // send email to me for tracking
      sendMonitoringEmail({
        subject: `New Southwest set up: ${firstName} ${lastName}`,
        text: `Email: ${
          email ? email : ""
        }\nConfirmation number: ${confirmationNumber}.\n
         ${JSON.stringify(flights, null, 2)}`,
      });

      // send email to the user if email address was provided
      if (email) {
        const newSubmissionEmail = createNewSubmissionEmail({
          firstName,
          lastName,
          confirmationNumber,
          flights,
        });

        sendUserEmail({
          userEmail: email,
          subject: `Southwest automatic check in is set up (${confirmationNumber})`,
          html: newSubmissionEmail,
          attachments: [],
        });

        // send user email for quality control
        sendUserEmail({
          userEmail: process.env.GARRETTS_EMAIL,
          subject: `Southwest automatic check in is set up (${confirmationNumber})`,
          html: newSubmissionEmail,
          attachments: [],
        });
      }

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
  const flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  let confirmationNumbers = [];

  // this logic is a little too complex for a filter function
  let upcomingFlights = [];

  // filter to isolate flights within 24 hours of their check in time
  flightData.forEach((flight) => {
    // get difference in hours between current time and check in time
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    const diffInHours = checkInTime.diff(currentTime, "hours").toObject().hours;

    if (
      diffInHours < 1 &&
      diffInHours > -1 &&
      !confirmationNumbers.includes(flight.confirmationNumber)
    ) {
      console.log(
        `In runCron: Checking in ${flight.firstName} ${flight.lastName} ${flight.confirmationNumber}`
      );
      upcomingFlights = [...upcomingFlights, flight];
      confirmationNumbers = [...confirmationNumbers, flight.confirmationNumber];
    }
  });

  // check into each applicable flight one at a time to not overwhelm server resources
  for (const flight of upcomingFlights) {
    await checkIn({
      confirmationNumber: flight.confirmationNumber,
      firstName: flight.firstName,
      lastName: flight.lastName,
      email: flight.email ? flight.email : "",
    });
  }
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
