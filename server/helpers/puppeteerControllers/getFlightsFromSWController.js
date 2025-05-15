// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { parseFlight } = require("../HTMLParsers/HTMLParsers");
const {
  checkInTime,
  checkInUTCString,
  flightToDateTime,
  daysUntilFlight,
} = require("../timeHandlers/timeHandlers");
const { checkInToSWController } = require("./checkInToSWController");
const { formatTimeToFlight } = require("../timeHandlers/formatTimeToFlight");

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

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });
  await page.waitForSelector("#lookupReservation", { timeout: 0 });
  console.log("2. 'Manage Reservation' form page loaded.");

  // type the confirmation number into the input field
  await page.focus('input[name="reservationForm.record_locator"]');
  await page.keyboard.type(confirmationNumber);

  // type the first name into the input field
  await page.focus('input[name="reservationForm.first_name"]');
  await page.keyboard.type(firstName);

  // type the last name into the input field
  await page.focus('input[name="reservationForm.last_name"]');
  await page.keyboard.type(lastName);

  // click the first check in button
  await page.click("#lookupReservation");
  console.log("3. Clicked button to start search for reservation.");

  // handle the case where flight information is found
  try {
    // after loading next page, click the second check in button
    await page.waitForSelector('div[class^="tripSummary__"]', {
      timeout: 30000,
    });

    console.log("4. 'Your Reservation Details' page loaded.");

    // get HTML for each flight on page
    const flightElements = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('div[class*="flightSummaryContainer"]'),
        (element) => element.outerHTML
      )
    );

    // isolate particular details from each flight html section
    let flights = flightElements.map(parseFlight);

    // add timezone and offset to each flight object
    flights = flights.map((flight) => {
      flight.checkInTime = checkInTime(flight);
      flight.checkInUTCString = checkInUTCString(flight);
      flight.daysUntilFlight = daysUntilFlight(flight);
      return flight;
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

    return {
      flights: uniqueFlights,
      error: "",
    };
  } catch (e) {
    console.log(e);
    return {
      flights: [],
      error: e,
    };
  }
}

exports.getFlightsFromSWController = getFlightsFromSWController;
