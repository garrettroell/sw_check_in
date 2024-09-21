// function to run on cron job
async function runCron() {
  console.log("Cron function running");

  // get all flights in database
  const flightData = JSON.parse(fs.readFileSync("data/flights.json"));

  let confirmationNumbers = [];

  // this logic is a little too complex for a filter function
  let upcomingFlights = [];

  // filter to isolate flights within 24 hours of their check in time
  flightData.forEach((flight) => {
    // get difference in hours between current time and check in time
    const currentTime = DateTime.now();
    const checkInTime = DateTime.fromISO(flight.checkInUTCString, {
      zone: "UTC",
    });
    const diffInHours = checkInTime.diff(currentTime, "hours").toObject().hours;

    if (
      diffInHours < 1 &&
      diffInHours > -1 &&
      !confirmationNumbers.includes(flight.confirmationNumber)
    ) {
      console.log(
        `In runCron: Checking in ${flight.firstName} ${flight.lastName} ${flight.confirmationNumber}`
      );
      upcomingFlights = [...upcomingFlights, flight];
      confirmationNumbers = [...confirmationNumbers, flight.confirmationNumber];
    }
  });

  // check into each applicable flight one at a time to not overwhelm server resources
  for (const flight of upcomingFlights) {
    await checkInToSWController({
      confirmationNumber: flight.confirmationNumber,
      firstName: flight.firstName,
      lastName: flight.lastName,
      email: flight.email ? flight.email : "",
    });
  }
}

module.runCron = runCron;
