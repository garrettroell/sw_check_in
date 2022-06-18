require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const Cron = require("croner");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sw.garrettroell.com"],
  })
);

// email boilerplate
function sendEmail({ from, to, subject, html }) {
  console.log("sending email");
  const msg = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent from ${from} to ${to}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

const {
  writeFlightsToDatabase,
  getFlightDetails,
} = require("./helpers/databaseHelpers");
const { getFlights, checkIn } = require("./helpers/puppeteerHelpers");
const { DateTime } = require("luxon");

app.get("/", (_req, res) => {
  res.send("Hello world from southwest check in backend");
});

app.post("/set-up", async (req, res) => {
  // get user's first name, last name, confirmation number, and email from req body
  let { firstName, lastName, confirmationNumber } = req.body;

  // get list of flight objects using puppeteer
  const flights = await getFlights({ firstName, lastName, confirmationNumber });

  // write the user info to the database
  await writeFlightsToDatabase({
    flights,
    firstName,
    lastName,
    confirmationNumber,
  });

  // send email for tracking
  sendEmail({
    from: process.env.SENDING_EMAIL,
    to: process.env.GARRETTS_EMAIL,
    subject: `New Southwest set up: ${firstName} ${lastName}`,
    html: `Confirmation number: ${confirmationNumber}`,
  });

  // schedule check in to occur at specified time (will need to do this for each flight)
  console.log("5. scheduling cron jobs");
  flights.forEach((flight) => {
    console.log("cron timezone: ", flight.departureTimezone);

    let job = Cron(
      // "2022-04-21T1:56:00", // test code
      flight.checkInCronString,
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

  // res.json(flights);
});

// function to run on cron job
async function runCron() {
  console.log("Cron function running");
  // get all flights in database
  const _flights = await getFlightDetails();

  // filter to isolated flights within 24 hours of their check in time
  const upcomingFlights = _flights.filter((flight) => {
    // get difference in hours between current time and check in time
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInCronString, {
      zone: flight.departureTimezone,
    });
    var diffInHours = Math.abs(
      checkInTime.diff(currentTime, "hours").toObject().hours
    );

    // cut out flights with checkout times not close to current time
    return diffInHours < 25;
  });

  // filter out trips with duplicate flight information
  let uniqueFlights = [];
  let flightStrings = [];
  upcomingFlights.forEach((flight) => {
    const flightData = {
      firstName: flight.firstName,
      lastName: flight.lastName,
      confirmationNumber: flight.confirmationNumber,
      // email could go here
    };

    if (!flightStrings.includes(JSON.stringify(flightData))) {
      uniqueFlights.push(flightData);
      flightStrings.push(JSON.stringify(flightData));
    }
  });

  // check into each applicable flight
  uniqueFlights.forEach((flight) => {
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
