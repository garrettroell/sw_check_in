import {
  Box,
  Heading,
  HStack,
  Stack,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import PlaneIcon from "../../Assets/PlaneIcon";
import { formatDate } from "../../Helpers/formatDate";

const FlightDetails = ({ flightInfo }) => {
  // console.log(flightInfo)
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  return (
    <VStack gap={isLargerThan600 ? "8px" : "20px"}>
      {flightInfo.flights.map((flight, index) => {
        return (
          <Stack
            direction={isLargerThan600 ? "row" : "column"}
            justify="space-between"
            w="100%"
            key={index}
            spacing={isLargerThan600 ? "0px" : "12px"}
          >
            <HStack spacing="30px" justify="center" w="100%">
              <Heading fontSize="20px">{flight.fromCode}</Heading>
              <Box w="30px" h="30px">
                <PlaneIcon />
              </Box>
              <Heading fontSize="20px">{flight.toCode}</Heading>
            </HStack>
            <HStack justify="center" w="100%">
              <Heading fontSize="16px">{flight.departureTime}</Heading>
              <Heading fontSize="16px">{formatDate(flight.date)}</Heading>
            </HStack>
          </Stack>
        );
      })}
    </VStack>
  );
};

export default FlightDetails;
