// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
const fs = require("fs");
const { DateTime } = require("luxon");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { sendMonitoringEmail } = require("./emailHelpers");

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
      timeout: 15000,
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
      timeout: 11000,
    });
    console.log(`Loaded check in form at ${getCurrentTimeString()}`);

    // Calculate the milliseconds until the start of the next minute
    const adjustment = 12000; // A two second buffer gave errors. Trying a ten second buffer
    const currentTime = DateTime.now();
    const currentSeconds = currentTime.second + currentTime.millisecond / 1000;
    const msUntilStartOfNextMinute = 60000 - 1000 * currentSeconds + adjustment;
    console.log(
      `Waiting ${parseInt(
        Math.floor(msUntilStartOfNextMinute / 1000)
      )} seconds before submitting form`
    );

    // function that runs at the start of the next minute
    setTimeout(async () => {
      try {
        // click the submit button on the check in form page
        console.log(`Submitted Check in form at ${getCurrentTimeString()}`);
        await page.click("#form-mixin--submit-button");

        // wait for actual check in button to load
        await page.waitForSelector(
          "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button",
          { timeout: 13000 } // 10 seconds before declaring an error
        );

        const checkInClickTime = getCurrentTimeString();
        console.log(`Clicked check in button at ${getCurrentTimeString()}`);

        // click button at the exact start of the minute
        await page.click(
          "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button"
        );

        // load the page with the boarding position
        await page.waitForSelector(
          ".air-check-in-passenger-item--information-boarding-position",
          { timeout: 14000 } // 10 seconds before declaring an error
        );
        console.log("Loaded page with boarding position");

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
        sendMonitoringEmail({
          subject: `Successful Southwest Check In for ${firstName} ${lastName} ${confirmationNumber}`,
          text: `Checked in at ${checkInClickTime} and got position ${boardingPosition}`,
        });

        // // send the user the successful check in message
        // if(email) {
        //   sendMonitoringEmail({
        //     userEmail: email,
        //     subject: `Successful Southwest Check In for ${firstName} ${lastName} ${confirmationNumber}`,
        //     text: `Checked in at ${checkInClickTime} and got position ${boardingPosition}`,
        //   });
        // }
      } catch (e) {
        console.log(
          `Error 1 happened in SW check in for ${firstName} ${lastName}`
        );
        console.log(e);

        // save screen shot of error
        const errorImagePath = `./errors/${firstName}_${lastName}_${confirmationNumber}.png`;
        await page.screenshot({
          path: errorImagePath,
          fullPage: true,
        });

        await browser.close();

        // create an attachment for the error and send email
        const attachment = fs.readFileSync(errorImagePath).toString("base64");
        const attachments = [
          {
            content: attachment,
            filename: "attachment.png",
            type: "application/png",
            disposition: "attachment",
          },
        ];

        sendMonitoringEmail({
          subject: `Error 1 in Southwest Check In for ${firstName} ${lastName}`,
          text: `Error 1 happened at ${getCurrentTimeString()} when checking in with confirmation number ${confirmationNumber}. ${e}`,
          attachments: attachments,
        });
      }
    }, msUntilStartOfNextMinute);
  } catch (e) {
    console.log(`Error 2 happened in SW check in for ${firstName} ${lastName}`);
    console.log(e);

    sendMonitoringEmail({
      subject: `Error 2 in Southwest Check In for ${firstName} ${lastName}`,
      text: `Error 2 happened at ${getCurrentTimeString()} when checking in with confirmation number ${confirmationNumber}. ${e}. No screenshot available`,
    });
  }
}

exports.getFlights = getFlights;
exports.checkIn = checkIn;

// working example
// checkIn({
//   firstName: "Ryan",
//   lastName: "Maddox",
//   confirmationNumber: "4E3LE8",
// });

// causes error
// checkIn({
//   firstName: "Caryn",
//   lastName: "Tran",
//   confirmationNumber: "4ONYZP",
// });
