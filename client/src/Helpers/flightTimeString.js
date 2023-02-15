import ordinal from "../Helpers/ordinal";

function flightTimeString(flight) {
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (Object.keys(flight).length === 0) {
    return "";
  } else {
    // check in UTC string has format: 2023-01-05T14:04:00
    const year = flight.checkInUTCString.split("-")[0];
    const month = months[parseInt(flight.checkInUTCString.split("-")[1])];
    const day = ordinal(
      parseInt(flight.checkInUTCString.split("-")[2].split("T")[0])
    );
    const flightTime = flight.localTime
      ? flight.localTime
      : flight.departureTime;
    return `${flightTime} on ${month} ${day}, ${year} (${flight.departureTimezone})`;
  }
}

export default flightTimeString;
