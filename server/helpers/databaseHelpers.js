require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

async function writeFlightsToDatabase({
  firstName,
  lastName,
  confirmationNumber,
  flights,
}) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  flights.forEach(async (flight) => {
    const { error } = await supabase.from("flights").insert([
      {
        firstName: firstName,
        lastName: lastName,
        confirmationNumber: confirmationNumber,
        date: flight.date,
        departureTime: flight.departureTime,
        departureTimezone: flight.departureTimezone,
        checkInTime: flight.checkInTime,
        checkInCronString: flight.checkInCronString,
        number: flight.number,
        fromCity: flight.fromCity,
        fromCode: flight.fromCode,
        toCity: flight.toCity,
        toCode: flight.toCode,
      },
    ]);
    if (error) {
      console.log("Supabase error: ", error);
    }
  });
}

async function getFlightDetails() {
  console.log("getting details");
  const { data, error } = await supabase.from("flights").select("*");

  if (error) {
    console.log(error);
  }

  return data;
}

exports.writeFlightsToDatabase = writeFlightsToDatabase;
exports.getFlightDetails = getFlightDetails;
