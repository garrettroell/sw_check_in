require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sw.garrettroell.com"],
  })
);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const cron = require("node-cron");
const Cron = require("croner");

// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {
  flightDate,
  flightDepartureTime,
  flightNumber,
  flightFromCity,
  flightFromCode,
  flightToCity,
  flightToCode,
} = require("./helpers/HTMLparsers");
const {
  getTimezone,
  getTimezoneOffset,
  checkInTime,
  checkInCronString,
} = require("./helpers/timeHandlers");
puppeteer.use(StealthPlugin());

// app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello world from southwest check in backend");
});

app.post("/set-up", async (req, res) => {
  // get user's first name, last name, confirmation number, and email from req body
  let { firstName, lastName, confirmationNumber } = req.body;

  // use user details to get flight information
  const url = `https://www.southwest.com/air/manage-reservation/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });
  await page.waitForSelector("#form-mixin--submit-button", { timeout: 0 });
  console.log("1. First page content loaded.");

  // click the first check in button
  await page.click("#form-mixin--submit-button");
  console.log("2. Loading reservation details.");

  // after loading next page, click the second check in button
  await page.waitForSelector("#air-reservation > div.reservation--summary", {
    timeout: 0,
  });
  console.log("3. Data recieved");

  // get HTML for each flight on page
  const flightElements = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".checkout-flight-detail"),
      (element) => element.outerHTML
    )
  );

  // isolate particular details from each flight html section
  const flights = flightElements.map((flight) => {
    return {
      date: flightDate(flight),
      departureTime: flightDepartureTime(flight),
      departureTimezone: getTimezone(flightFromCode(flight)),
      departureTimezoneOffset: getTimezoneOffset(flightFromCode(flight)),
      checkInTime: checkInTime(flight),
      checkInCronString: checkInCronString(flight),
      number: flightNumber(flight),
      fromCity: flightFromCity(flight),
      fromCode: flightFromCode(flight),
      toCity: flightToCity(flight),
      toCode: flightToCode(flight),
    };
  });

  await browser.close();

  // get unique flights
  let uniqueFlights = [];
  let flightStrings = [];
  flights.forEach((flight) => {
    //
    if (!flightStrings.includes(JSON.stringify(flight))) {
      uniqueFlights.push(flight);
      flightStrings.push(JSON.stringify(flight));
    }
  });

  console.log("4. write data to supabase");
  uniqueFlights.forEach((flight) => {
    // add flight to supabase
  });

  // schedule check in to occur at specified time (will need to do this for each flight)
  console.log("5. scheduling cron jobs");
  uniqueFlights.forEach((flight) => {
    console.log("cron string", flight.checkInCronString);
    console.log("cron timezone", flight.departureTimezone);
    // const cronString =;
    // let job = Cron(
    //   // "2022-04-17T11:52:00"
    //   "2022-04-17T12:00:00",
    //   {
    //     timezone: "America/Chicago",
    //   },
    //   () => {
    //     console.log("sending test email");
    //     checkIn();
    //   }
    // );
  });

  // send flight details to the front end
  console.log("6. Sent data to user");
  res.json(uniqueFlights);
});

function checkIn() {
  // get user info from supabase

  // temp variables
  const firstName = "test first name";
  const lastName = "test last name";
  const confirmationNumber = "test confirmation number";

  // send email (abstract some of this)
  const msg = {
    to: "garrettroell@gmail.com", // Change to your recipient
    from: "garrettroell@gmail.com", // Change to your verified sender
    subject: "Southwest auto check in happened",
    text: firstName + " " + lastName + " " + confirmationNumber,
    html: "<strong>We'll email you when you are officially checked in</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});

// check in function in indexOld.js

// define a delay function
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// test area
// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
// });

// time zone example
// cron.schedule('0 1 * * *', () => {
//   console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
// }, {
//   scheduled: true,
//   timezone: "America/Sao_Paulo"
// });

// function sendEmail() {
//   console.log("This will run every second.");
// }

// Cron("* * * * * *", sendEmail);
