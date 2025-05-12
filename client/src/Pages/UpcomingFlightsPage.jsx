import { Box, Heading, VStack } from "@chakra-ui/react";
import Footer from "../Components/Footer/Footer";
import NavBar from "../Components/NavBar/NavBar";
import getBackendUrl from "../Helpers/getBackendUrl";
import flightTimeString from "../Helpers/flightTimeString";
import { useEffect, useState } from "react";

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
        <Heading textAlign="center">Upcoming Check Ins</Heading>
        <VStack h="60px" maxW="700px" m="auto" px="10px" mt="30px">
          {flights.map((flight, index) => {
            return (
              <>
                <Heading fontSize="sm">
                  {flightTimeString(flight)} {flight.firstName}{" "}
                  {flight.lastName} {flight.confirmationNumber}
                </Heading>
              </>
            );
          })}
        </VStack>
        <Footer />
      </Box>
    </>
  );
};

export default UpcomingFlightsPage;
