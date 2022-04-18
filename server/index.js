require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const Cron = require("croner");

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sw.garrettroell.com"],
  })
);
// app.use("/static", express.static("public"));

const { writeFlightsToDatabase } = require("./helpers/databaseHelpers");
const { getFlights, checkIn } = require("./helpers/puppeteerHelpers");

app.get("/", (_req, res) => {
  res.send("Hello world from southwest check in backend");
});

app.post("/set-up", async (req, res) => {
  // get user's first name, last name, confirmation number, and email from req body
  let { firstName, lastName, confirmationNumber } = req.body;

  // get list of flight objects using puppeteer
  const flights = await getFlights({ firstName, lastName, confirmationNumber });

  await writeFlightsToDatabase({
    flights,
    firstName,
    lastName,
    confirmationNumber,
  });

  // schedule check in to occur at specified time (will need to do this for each flight)
  console.log("5. scheduling cron jobs");
  flights.forEach((flight) => {
    console.log("cron string: ", flight.checkInCronString);
    let job = Cron(
      // "2022-04-17T11:52:00"
      "2022-04-17T23:15:00",
      {
        timezone: "America/Chicago",
      },
      () => {
        checkIn();
      }
    );
  });

  // send flight details to the front end
  console.log("6. Sent data to user");
  res.json(flights);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});
