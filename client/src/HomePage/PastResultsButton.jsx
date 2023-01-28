import { Box, Button, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import getBackendUrl from "../Helpers/getBackendUrl";
import PastResultsGraph from "./PastResultsGraphs";

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function checkInTimeString(result) {
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

  if (Object.keys(result).length === 0) {
    return "";
  } else {
    // check in UTC string has format: 2023-01-05T14:04:00
    const year = result.checkInUTCString.split("-")[0];
    const month = months[parseInt(result.checkInUTCString.split("-")[1])];
    const day = ordinal(
      parseInt(result.checkInUTCString.split("-")[2].split("T")[0])
    );
    return `Most recent check in: ${result.positionName} at ${result.localTime} on ${month} ${day}, ${year} (${result.departureTimezone})`;
  }
}

async function getCheckInResults() {
  const response = await fetch(`${getBackendUrl()}/check-in-results`);

  return response.json();
}

const PastResults = () => {
  const [showGraphs, setShowGraphs] = useState(false);
  const [checkInResults, setCheckInResults] = useState([]);
  const [mostRecentResult, setMostRecentResult] = useState({});

  // fetch the check-in results
  useEffect(async () => {
    const _checkInResults = await getCheckInResults();
    if (_checkInResults) {
      setCheckInResults(_checkInResults);

      _checkInResults.sort(function (a, b) {
        return new Date(b.checkInUTCString) - new Date(a.checkInUTCString);
      });

      setMostRecentResult(_checkInResults[0]);
    }
  }, []);

  if (showGraphs && Object.keys(checkInResults).length !== 0) {
    return (
      <>
        <Box textAlign="center">
          <Heading fontSize="14px" my="10px">
            {mostRecentResult && checkInTimeString(mostRecentResult)}
          </Heading>
          <Button
            fontSize="14px"
            size="sm"
            onClick={() => setShowGraphs(false)}
          >
            Hide past results
          </Button>
          {checkInResults && (
            <PastResultsGraph checkInResults={checkInResults} />
          )}
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box textAlign="center">
          <Heading fontSize="14px" my="10px">
            {mostRecentResult && checkInTimeString(mostRecentResult)}
          </Heading>
          <Button fontSize="14px" size="sm" onClick={() => setShowGraphs(true)}>
            See past results
          </Button>
        </Box>
      </>
    );
  }
};

export default PastResults;
