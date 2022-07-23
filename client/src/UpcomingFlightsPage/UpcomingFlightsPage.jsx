import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";
import getBackendUrl from "../Helpers/getBackendUrl";
import { useEffect, useState } from "react";

function obscureName(name) {
  let hiddenName = name[0].toUpperCase();

  for (const letter of name.substring(1)) {
    hiddenName += "*";
  }

  return hiddenName;
}

async function getUpcomingFlights() {
  const response = await fetch(`${getBackendUrl()}/upcoming-flights`);
  return response.json();
}

const UpcomingFlightsPage = () => {
  const [flights, setFlights] = useState([]);
  useEffect(async () => {
    const _flights = await getUpcomingFlights();
    if (_flights) {
      setFlights(_flights);
    }
  }, []);

  return (
    <>
      <Box w="100vw" h="100vh" positon="relative">
        <NavBar />
        <Heading textAlign="center">Upcoming Flights</Heading>
        <VStack h="60px" maxW="500px" m="auto" px="10px" mt="30px">
          {flights.map((flight, index) => {
            obscureName(flight.firstName);
            return (
              <HStack h="30px" w="100%" key={index}>
                <Heading fontSize="sm">{flight.date}</Heading>
                <Heading fontSize="sm">{flight.departureTime}</Heading>
                <Heading fontSize="sm">{flight.departureTimezone}</Heading>
                <Heading fontSize="sm">{obscureName(flight.firstName)}</Heading>
                <Heading fontSize="sm">{obscureName(flight.lastName)}</Heading>
                <Heading fontSize="sm">{flight.confirmationNumber}</Heading>
              </HStack>
            );
          })}
        </VStack>
        <Footer />
      </Box>
    </>
  );
};

export default UpcomingFlightsPage;
