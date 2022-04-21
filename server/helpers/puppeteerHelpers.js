// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
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
async function checkIn({ firstName, lastName, confirmationNumber }) {
  console.log(`checking in ${firstName} ${lastName}`);

  let errorOccured = false;

  const url = `https://www.southwest.com/air/check-in/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    await page.waitForSelector("#form-mixin--submit-button", { timeout: 0 });
    console.log("made it to first page");

    // click the first check in button
    await page.click("#form-mixin--submit-button");
    console.log("clicked first check in button");

    try {
      await page.waitForSelector(
        "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button",
        { timeout: 60000 } // 1 minute before declaring an error
      );
    } catch {
      errorOccured = true;
      await page.screenshot({
        path: `errors/${firstName}_${lastName}_${confirmationNumber}.png`,
        fullPage: true,
      });
    }

    console.log("clicked second check in button");
    await delay(5000); // arbitrary time length
    await page.screenshot({
      path: `receipts/${firstName}_${lastName}_${confirmationNumber}.png`,
      fullPage: true,
    });
  } catch (e) {
    errorOccured = true;
  } finally {
    await browser.close();
  }

  // email depends on if an error occured
  if (errorOccured) {
    console.log(`Error happened in SW check in for ${firstName} ${lastName}`);
    sendEmail({
      text: `Error happened in SW check in for ${firstName} ${lastName}`,
    });
  } else {
    console.log(`Successfully checked in for ${firstName} ${lastName}`);
    sendEmail({ text: `Successfully checked in for ${firstName} ${lastName}` });
  }
}

exports.getFlights = getFlights;
exports.checkIn = checkIn;

// define a delay function
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
