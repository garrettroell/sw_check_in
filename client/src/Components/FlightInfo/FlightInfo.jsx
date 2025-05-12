import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import FlightDetails from "./FlightDetails";

const FlightInfo = ({ flightInfo }) => {
  if (flightInfo) {
    return (
      <>
        <VStack maxW="800px" m="auto" spacing="16px" align="left">
          {/* header text */}
          <Heading mt="80px" textAlign="center">
            Success
          </Heading>

          <Box h="30px" w="100px" />

          <VStack spacing="0px">
            {/* color bar */}
            <HStack
              w="100%"
              h="15px"
              bg="#C3322C"
              transform="translateY(10px)"
              borderTopRadius="15px"
            >
              <Box
                h="100%"
                w="50%"
                bg="#F5C14D"
                borderTopLeftRadius="15px"
              ></Box>
            </HStack>

            {/* data container */}
            <Box w="100%" py="20px" borderWidth="1px" borderRadius="15px">
              <Heading fontSize="16px" mt="10px" mb="20px" textAlign="center">
                {flightInfo.firstName} {flightInfo.lastName} (
                {flightInfo.confirmationNumber})
              </Heading>
              <FlightDetails flightInfo={flightInfo} />
            </Box>
          </VStack>

          {/* check in time display */}
          {flightInfo.flights.map((flight) => {
            {
              /* handle if flight already happened or is within the next 24 hours */
            }
            if (parseFloat(flight.daysUntilFlight) < 0) {
              return (
                <Heading mt="30px" fontSize="16px" key={Math.random()}>
                  Your flight on {flight.date} already happened.
                </Heading>
              );
            } else if (parseFloat(flight.daysUntilFlight) < 1) {
              return (
                <Heading mt="30px" fontSize="16px" key={Math.random()}>
                  We're checking you into your flight on {flight.date} right
                  now.
                </Heading>
              );
            } else {
              return (
                <Heading mt="30px" fontSize="16px" key={Math.random()}>
                  You'll be checked in at {flight.checkInTime}
                </Heading>
              );
            }
          })}
        </VStack>
      </>
    );
  } else {
    return (
      <Heading fontSize="24px" mt="50px" textAlign="center">
        Loading Data...
      </Heading>
    );
  }
};

export default FlightInfo;
