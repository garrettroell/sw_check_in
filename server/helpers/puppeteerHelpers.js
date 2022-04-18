// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { getFlightDetails } = require("./databaseHelpers");
const { sendEmail } = require("./emailHelpers");

const {
  flightDate,
  flightDepartureTime,
  flightNumber,
  flightFromCity,
  flightFromCode,
  flightToCity,
  flightToCode,
} = require("./HTMLparsers");
const {
  getTimezone,
  getTimezoneOffset,
  checkInTime,
  checkInCronString,
} = require("./timeHandlers");

puppeteer.use(StealthPlugin());

async function getFlights({ firstName, lastName, confirmationNumber }) {
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

  return uniqueFlights;
}

// check in function here
async function checkIn() {
  console.log("Scheduled check in function running");

  const flights = await getFlightDetails();
  console.log(flights);

  sendEmail({ text: "this is from a scheduled function" });
}

exports.getFlights = getFlights;
exports.checkIn = checkIn;
