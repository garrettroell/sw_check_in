require("dotenv").config();
const express = require("express");
const app = express();
// cors

const cron = require("node-cron");

// add use puppeteer with stealth plugin and use defaults (all evasion techniques)
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello world from southwest check in backend");
});

app.get("/set-up", (req, res) => {
  // get user's first name, last name, confirmation number, and email from req body

  // go to southwest website to get the flight time(s)
  getCheckInTimes({
    firstName: "Garrett",
    lastName: "Roell",
    confirmationNumber: "25XRZV",
  });
});

app.get("/check-in", async (req, res) => {
  res.send("check in function");

  // get user's first name, last name, confirmation number, and email from req body

  // go to southwest website to get the flight time(s)
  getCheckInTimes({
    firstName: "Garrett",
    lastName: "Roell",
    confirmationNumber: "25XRZV",
  });

  // set up a function to run at a certain time to check the person in (this works)
  // checkIn({
  //   firstName: "Garrett",
  //   lastName: "Roell",
  //   confirmationNumber: "25XRZV",
  // });

  // send email to tell person that they're set to be checked at the time(s)
});

cron.schedule("* * * * *", function () {
  console.log("running a task every minute");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});

async function getCheckInTimes({ confirmationNumber, firstName, lastName }) {
  const url = `https://www.southwest.com/air/manage-reservation/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;
  console.log(url);
}

// a function to run when a person should check in
async function checkIn({ confirmationNumber, firstName, lastName }) {
  // put the users data into query parameters of the url
  const url = `https://www.southwest.com/air/check-in/index.html?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}`;
  puppeteer
    .launch({ headless: true })
    .then(async (browser) => {
      // go to the given url
      const page = await browser.newPage();
      await page.goto(url, { timeout: 0 });
      await page.waitForSelector("#form-mixin--submit-button", { timeout: 0 });
      console.log("made it to first page");

      // click the first check in button
      await page.click("#form-mixin--submit-button");
      console.log("clicked first check in button");

      // after loading next page, click the second check in button
      await page.waitForSelector(
        "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button",
        { timeout: 0 }
      );
      await page.click(
        "#swa-content > div > div:nth-child(2) > div > section > div > div > div.air-check-in-review-results--confirmation > button"
      );
      console.log("clicked second check in button");

      // after an arbitrary wait (change this later) save a screenshot of page
      await delay(5000);
      // await page.waitForSelector("flex_oj95d1xa4c9"); # this was a failed attempt
      await page.screenshot({
        path: `receipts/${firstName}_${lastName}_${confirmationNumber}.png`,
        fullPage: true,
      });
      console.log("checked in successfully");

      await browser.close();
    })
    .catch((e) => {
      console.log(e);
    });
}

// define a delay function
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
