// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
require("dotenv").config();
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
} = require("../HTMLparsers/HTMLparsers");
const {
  getTimezone,
  getTimezoneOffset,
  checkInTime,
  checkInUTCString,
  flightToDateTime,
  daysUntilFlight,
} = require("../timeHandlers/timeHandlers");
const { checkInToSWController } = require("./checkInToSWController");
const { formatTimeToFlight } = require("../timeHandlers/formatTimeToFlight ");

puppeteer.use(StealthPlugin());

async function getFlightsFromSWController({
  firstName,
  lastName,
  confirmationNumber,
}) {
  // use user details to get flight information
  const url = `https://www.southwest.com/air/manage-reservation/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;

  console.log(`Using URL: ${url}`);
  console.log("1. Opening browser to the 'Manage Reservation' form page.");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });
  await page.waitForSelector("#form-mixin--submit-button", { timeout: 0 });
  console.log("2. 'Manage Reservation' form page loaded.");

  // click the first check in button
  await page.click("#form-mixin--submit-button");
  console.log("3. Clicked button to start search for reservation.");

  // handle the case where flight information is found
  try {
    // after loading next page, click the second check in button
    await page.waitForSelector("#air-reservation > div.reservation--summary", {
      timeout: 30000,
    });

    console.log("4. 'Your Reservation Details' page loaded.");

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
        departureDateTime: flightToDateTime(flight),
        checkInTime: checkInTime(flight),
        checkInUTCString: checkInUTCString(flight),
        number: flightNumber(flight),
        fromCity: flightFromCity(flight),
        fromCode: flightFromCode(flight),
        toCity: flightToCity(flight),
        toCode: flightToCode(flight),
      };
    });

    // close the browser
    await browser.close();
    console.log("5. Closed browser after set up.");

    // get unique flights
    let uniqueFlights = [];
    let flightStrings = [];
    flights.forEach((flight) => {
      if (!flightStrings.includes(JSON.stringify(flight))) {
        uniqueFlights.push(flight);
        flightStrings.push(JSON.stringify(flight));
      }
    });

    // If a flight is within 24 hrs of current time run check in function
    uniqueFlights.forEach((flight) => {
      // add daysUntilFlight property here because when it was added earlier it caused a problem with the same flight to not be unique
      flight.daysUntilFlight = daysUntilFlight(flight);

      if (flight.daysUntilFlight > 0 && flight.daysUntilFlight < 1) {
        // check in to flight (add space in the logging to separate setup and check in logs)
        console.log("\n");
        console.log(
          `Found flight in less than 24 hours: ${formatTimeToFlight(
            flight.daysUntilFlight
          )}`
        );
        checkInToSWController({ firstName, lastName, confirmationNumber });
      }

      return flight;
    });

    console.log(`6. Found ${uniqueFlights.length} unique flights.`);

    return uniqueFlights;
  } catch (e) {
    console.log(e);
    // handle case where flight info is NOT found
    console.log("flight information not found");
    return [];
  }
}

exports.getFlightsFromSWController = getFlightsFromSWController;
