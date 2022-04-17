// This code could be used for testing new functions when southwest changes their website html.

let data;
try {
  //
  data = fs.readFileSync(
    "/Users/garrettroell/node_projects/sw_check_in/server/htmlExamples/roundTrip.html",
    "utf8"
  );
  // console.log(data);
} catch (err) {
  console.error(err);
}

// all html -> list of flight html fragments
function HTMLtoFlightList(html) {
  // remove the text after the flight details
  let trimmedText = html.split(
    '<section class="section icon-legend reservation--icon-legend"'
  )[0];

  // split into individual flights
  let flightList = trimmedText.split("checkout-flight-detail");

  // remove the text before the flight details
  flightList.shift();

  return flightList;
}

// get flight fragments and print out flight info for each one
const flights = HTMLtoFlightList(data);
flights.forEach((flight) => {
  console.log("number:", flightNumber(flight));
  console.log("date", flightDate(flight));
  console.log("time", flightDepartureTime(flight));
  console.log("from city:", flightFromCity(flight));
  console.log("from code:", flightFromCode(flight));
  console.log("to city:", flightToCity(flight));
  console.log("to code:", flightToCode(flight));
  console.log();
});
