import { Box, Button, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import getBackendUrl from "../../Helpers/getBackendUrl";
import flightTimeString from "../../Helpers/flightTimeString";
import PastResultsGraph from "./PastResultsGraph";

function checkInTimeString(result) {
  if (Object.keys(result).length === 0) {
    return "";
  } else {
    return `Most recent check in: ${result.positionName} at ${flightTimeString(
      result
    )})`;
  }
}

async function getCheckInResults() {
  const response = await fetch(`${getBackendUrl()}/check-in-results`);

  return response.json();
}

const PastResultsSection = () => {
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
            Hide past results ({checkInResults.length})
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
            See past results ({checkInResults.length})
          </Button>
        </Box>
      </>
    );
  }
};

export default PastResultsSection;
