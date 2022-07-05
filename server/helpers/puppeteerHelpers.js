// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
const { DateTime } = require("luxon");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { sendEmail } = require("./emailHelpers");

const {
  flightDate,
  flightDepartureTime,
  flightNumber,
  flightFromCity,
  flightFromCode,
  flightToCity,
  flightToCode,
  checkInHTMLToBoardingPosition,
} = require("./HTMLparsers");
const {
  getTimezone,
  getTimezoneOffset,
  checkInTime,
  checkInUTCString,
  flightToDateTime,
  daysUntilFlight,
  getCurrentTimeString,
} = require("./timeHandlers");

puppeteer.use(StealthPlugin());

async function getFlights({ firstName, lastName, confirmationNumber }) {
  // use user details to get flight information
  const url = `https://www.southwest.com/air/manage-reservation/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;
  console.log(url);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });
  await page.waitForSelector("#form-mixin--submit-button", { timeout: 0 });
  console.log("1. First page content loaded.");

  // click the first check in button
  await page.click("#form-mixin--submit-button");
  console.log("2. Loading reservation details.");

  // handle the case where flight information is found
  try {
    // after loading next page, click the second check in button
    await page.waitForSelector("#air-reservation > div.reservation--summary", {
      timeout: 10000,
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

    await browser.close();

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
      console.log(flight.daysUntilFlight);

      if (flight.daysUntilFlight > 0 && flight.daysUntilFlight < 1) {
        checkIn({ firstName, lastName, confirmationNumber });
      }

      return flight;
    });

    return uniqueFlights;
  } catch (e) {
    console.log(e);
    // handle case where flight info is NOT found
    console.log("flight information not found");
    return [];
  }
}

// check in function here
async function checkIn({ firstName, lastName, confirmationNumber }) {
  try {
    console.log(
      `checking in ${firstName} ${lastName} starting at ${getCurrentTimeString()}`
    );

    // navigate to check in form page
    const url = `https://www.southwest.com/air/check-in/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;
    console.log(url);
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.goto(url, { timeout: 10000 });
    await page.waitForSelector("#form-mixin--submit-button", {
      timeout: 10000,
    });
    console.log("Browser loaded check in form page");

    // click the submit button on the check in form page
    await page.click("#form-mixin--submit-button");
    console.log("Browser clicked submit button on the check in form page");

    // load the page with the check in button
    await page.waitForSelector(
      "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button",
      { timeout: 10000 } // 10 seconds before declaring an error
    );
    console.log("Browser loaded page with check in button");

    // calculate the number of milliseconds until the start of the next minute
    // the lag adjustment makes the check in button click event happen as close to the beginning of the minute as possible
    // ** maybe can even send the request early since there is some travel time to the southwest server **
    const latencyAdjustment = -1;
    const currentTime = DateTime.now();
    const currentSeconds = currentTime.second + currentTime.millisecond / 1000;
    const msUntilStartOfNextMinute =
      60000 - 1000 * currentSeconds - latencyAdjustment;
    console.log(`The current time is ${getCurrentTimeString()}`);

    // function that runs at the start of the next minute
    setTimeout(async () => {
      try {
        // record when the check in button was clicked
        const checkInClickTime = getCurrentTimeString();
        console.log(`clicked the check in button at ${checkInClickTime}`);

        // click button at the exact start of the minute
        await page.click(
          "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button"
        );

        // load the page with the boarding position
        await page.waitForSelector(
          ".air-check-in-passenger-item--information-boarding-position",
          { timeout: 10000 } // 10 seconds before declaring an error
        );
        console.log("Browser loaded page with boarding position");

        // get the boarding position
        const boardingPositionHTML = await page.content();
        const boardingPosition =
          checkInHTMLToBoardingPosition(boardingPositionHTML);

        // take a screenshot of boarding position page
        await page.screenshot({
          path: `receipts/${firstName}_${lastName}_${confirmationNumber}.png`,
          fullPage: true,
        });

        await browser.close();

        console.log(
          `Successfully checked in for ${firstName} ${lastName} at ${checkInClickTime} and got position ${boardingPosition}`
        );
        sendEmail({
          subject: `Successful Southwest Check In for ${firstName} ${lastName} ${confirmationNumber}`,
          text: `Checked in at ${checkInClickTime} and got position ${boardingPosition}`,
        });
      } catch (e) {
        console.log(
          `Error happened in SW check in for ${firstName} ${lastName}`
        );
        console.log(e);

        await browser.close();

        sendEmail({
          subject: `Error in Southwest Check In for ${firstName} ${lastName}`,
          text: `Error happened when checking in with confirmation number ${confirmationNumber}. ${e}`,
        });
      }
    }, msUntilStartOfNextMinute);
  } catch (e) {
    console.log(`Error happened in SW check in for ${firstName} ${lastName}`);
    console.log(e);

    await browser.close();

    sendEmail({
      subject: `Error in Southwest Check In for ${firstName} ${lastName}`,
      text: `Error happened when checking in with confirmation number ${confirmationNumber}. ${e}`,
    });
  }
}

exports.getFlights = getFlights;
exports.checkIn = checkIn;

// define a delay function
// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }

// test code here
// checkIn({
//   firstName: "Rebecca",
//   lastName: "Wong",
//   confirmationNumber: "4HEFRV",
// });
