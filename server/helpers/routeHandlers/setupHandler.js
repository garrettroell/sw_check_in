const Cron = require("croner");

const { addFlightsToDatabase } = require("../database/addFlightsToDatabase");
const isNewReservation = require("../database/isNewReservation");
const writeSetupEmailHTML = require("../emailHTMLwriters/writeSetupEmailHTML");
const { sendEmail } = require("../emailSender/sendEmail");
const {
  getFlightsFromSWController,
} = require("../puppeteerControllers/getFlightsFromSWController");

async function setupHandler(req) {
  let { firstName, lastName, confirmationNumber, email } = req.body;

  // get list of flight objects using puppeteer
  const { flights, error } = await getFlightsFromSWController({
    firstName,
    lastName,
    confirmationNumber,
  });

  // handle the case where the flight information is NOT found
  if (error) {
    console.log("Error getting flights:", error);
    return {
      flights: [],
      error: error,
    };
  }

  // handle the case where the flight information IS found
  if (flights.length > 0) {
    // check if the reservation is new
    const isNew = isNewReservation(confirmationNumber);

    if (isNew) {
      // only add the flights to the database if the reservation is new
      addFlightsToDatabase({
        flights,
        firstName,
        lastName,
        confirmationNumber,
        email,
      });

      console.log("5. scheduling cron jobs");
      flights.forEach((flight) => {
        let job = Cron(
          // "2022-07-18T03:50:00", // test code
          flight.checkInUTCString,
          {
            timezone: "UTC",
          },
          () => {
            runCron();
          }
        );
      });
    } else {
      console.log("Reservation already exists in database.");
    }

    // only schedule a cron task for a new reservation.
    if (isNew) {
    } else {
      console.log("5. Cronjob is already scheduled.");
    }

    // get the email html to send to the user
    const setupEmailHTML = writeSetupEmailHTML({
      firstName,
      lastName,
      confirmationNumber,
      flights,
    });

    sendEmail({
      isMonitoring: true,
      to: email,
      subject: `Southwest automatic check in is set up (${confirmationNumber})`,
      html: setupEmailHTML,
      attachments: [],
    });

    console.log("6. Monitoring email sent");

    // send email to the user if email address was provided
    if (email) {
      sendEmail({
        to: email,
        subject: `Southwest automatic check in is set up (${confirmationNumber})`,
        html: setupEmailHTML,
        attachments: [],
      });
      console.log("7. Setup email sent to user");
    } else {
      console.log("7. No email address provided (skipping email to user)");
    }

    return {
      flights: flights,
      error: "",
    };
  }
  // handle the case where the flight information is NOT found
  else {
    return {
      flights: [],
      error: "Flight information not found",
    };
  }
}

exports.setupHandler = setupHandler;
