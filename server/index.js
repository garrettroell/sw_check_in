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

const cron = require("node-cron");

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
  checkInEpoch,
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
      checkInEpoch: checkInEpoch(flight),
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

  // send email (abstract some of this)
  const msg = {
    to: "garrettroell@gmail.com", // Change to your recipient
    from: "garrettroell@gmail.com", // Change to your verified sender
    subject: "Southwest auto check in confirmed",
    text: "Congrats",
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

  console.log("4. Sent data to user");

  // send flight details to the front end
  res.json(uniqueFlights);
});

app.get("/check-in", async (req, res) => {
  res.send("check in function");

  // send email to tell person that they're checked in
});

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
