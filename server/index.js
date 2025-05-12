require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendEmail } = require("./helpers/emailSender/sendEmail");

const {
  upcomingFlightsHandler,
} = require("./helpers/routeHandlers/upcomingFlightsHandler");
const { setupHandler } = require("./helpers/routeHandlers/setupHandler");
const { setUpCronJobs } = require("./helpers/cron/setUpCronJobs");

// set up cors and body parser
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sw.garrettroell.com"],
  })
);

// Print a message when the server starts
console.log("\n\nServer starting...");

// set up cron jobs when the server starts
setUpCronJobs();

// homepage route
app.get("/", (_req, res) => {
  res.send("Hello world from southwest check in backend");
});

// an end point to set up a check in
app.post("/set-up", async (req, res) => {
  try {
    const flights = await setupHandler(req);

    res.json(flights);
  } catch (e) {
    console.log(e);
    res.json({});
  }
});

// an endpoint to get upcoming flights. Note the personal data is obscured
app.get("/upcoming-flights", async (_req, res) => {
  console.log("sending upcoming flights");

  const upcomingFlights = await upcomingFlightsHandler();

  res.send(upcomingFlights);
});

// an end point so that the front end can generate a plot of the check in results
app.get("/check-in-results", async (req, res) => {
  const checkInResults = fs.readFileSync(
    "./data/check_in_results.json",
    "utf-8"
  );

  res.send(JSON.parse(checkInResults));
});

// an end point to send feedback to the developer
app.post("/feedback", async (req, res) => {
  let { feedback, firstName, lastName } = req.body;

  sendEmail({
    isMonitoring: true,
    subject: `Southwest Feedback from ${firstName} ${lastName}`,
    text: `Feedback:\n${feedback}`,
  });

  res.sendStatus(200);
});

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}.`);
});
