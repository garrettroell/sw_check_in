// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
require("dotenv").config();
const fs = require("fs");
const { DateTime } = require("luxon");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const writeSuccessEmailHTML = require("../emailHTMLwriters/writeSuccessEmailHTML");
const { writeToCheckInResults } = require("../database/writeToCheckInResults");
const { sendEmail } = require("../emailSender/sendEmail");

const { checkInHTMLToBoardingPosition } = require("../HTMLParsers/HTMLParsers");
const { getCurrentTimeString } = require("../timeHandlers/timeHandlers");

puppeteer.use(StealthPlugin());

// check in function here
async function checkInToSWController({
  firstName,
  lastName,
  confirmationNumber,
  email,
}) {
  try {
    // navigate to check in form page
    const url = `https://www.southwest.com/air/check-in/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;

    console.log(`Using URL: ${url}`);

    console.log(
      `Checking in ${firstName} ${lastName} starting at ${getCurrentTimeString()}`
    );

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    const page = await browser.newPage();
    await page.goto(url, { timeout: 30001 });
    await page.waitForSelector("#form-mixin--submit-button", {
      timeout: 30002,
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
          { timeout: 30003 } // 10 seconds before declaring an error
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
          { timeout: 30004 } // 10 seconds before declaring an error
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
        console.log("Browser closed after check in");

        console.log(
          `Successfully checked in for ${firstName} ${lastName} at ${checkInClickTime} and got position ${boardingPosition}`
        );

        // get the possible flights and filter by confirmation number
        const allFlights = JSON.parse(fs.readFileSync("data/flights.json"));
        const flights = allFlights.filter(
          (flight) => flight.confirmationNumber === confirmationNumber
        );

        // send the user the successful check in message
        const successEmailHTML = writeSuccessEmailHTML({
          firstName,
          lastName,
          confirmationNumber,
          boardingPosition,
          flights,
        });

        // send email to user
        if (email) {
          sendEmail({
            to: email,
            subject: `Successful Southwest automatic check in: ${boardingPosition} (${confirmationNumber})`,
            html: successEmailHTML,
            attachments: [],
          });
        }

        // send email to garrett for quality control
        sendEmail({
          isMonitoring: true,
          subject: `Successful Southwest automatic check in: ${boardingPosition} (${confirmationNumber})`,
          html: successEmailHTML,
          attachments: [],
        });

        // add the result to the check_in_results object
        writeToCheckInResults({
          confirmationNumber,
          boardingPosition,
          checkInClickTime,
          flights,
        });
      } catch (e) {
        console.log(
          `Error occured when checking ${firstName} ${lastName} in. It happened AFTER waiting to press the check in button. (${confirmationNumber}). ${e}`
        );
        console.log(e);

        // save screen shot of error
        const errorImagePath = `./errors/${firstName}_${lastName}_${confirmationNumber}.png`;
        await page.screenshot({
          path: errorImagePath,
          fullPage: true,
        });

        await browser.close();
        console.log("Browser closed after error occured");

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

        // alert the user of the error
        if (email) {
          sendEmail({
            to: email,
            subject: `Error in Southwest Check In`,
            text: `An error occured for  ${firstName} ${lastName} (${confirmationNumber})`,
            attachments: attachments,
          });
        }

        // send email to developer for quality control
        sendEmail({
          isMonitoring: true,
          subject: `Error in Southwest Check In for ${firstName} ${lastName}`,
          text: `Error 1 happened at ${getCurrentTimeString()} when checking in with confirmation number ${confirmationNumber}. ${e}`,
          attachments: attachments,
        });
      }
    }, msUntilStartOfNextMinute);
  } catch (e) {
    console.log(
      `Error occured when checking ${firstName} ${lastName} in. It happened BEFORE waiting to press the check in button. (${confirmationNumber})`
    );
    console.log(e);

    // alert the user of the error
    if (email) {
      sendEmail({
        to: email,
        subject: `Error in Southwest Check In`,
        text: `An error occured for  ${firstName} ${lastName} (${confirmationNumber})`,
        attachments: attachments,
      });
    }

    sendEmail({
      isMonitoring: true,
      subject: `Error in Southwest Check In for ${firstName} ${lastName}`,
      text: `Error occured when checking ${firstName} ${lastName} in. It happened BEFORE waiting to press the check in button. (${confirmationNumber}).\n\n ${e}. No screenshot available`,
    });
  }
}

exports.checkInToSWController = checkInToSWController;
