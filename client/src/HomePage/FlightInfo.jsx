import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import FlightDetails from "./FlightDetails";

const FlightInfo = ({ flightInfo, setDisplayMode }) => {
  return ( 
    <> 
      <VStack maxW="800px" m="auto" spacing="16px" align="left">
        
        {/* header text */}
        <Heading mt="80px" textAlign="center">Success</Heading>

        <Box h="30px" w="100px" />

        {/* Trip Details */}
        {/* <Heading mt="75px" textAlign="center" fontSize="24px">Trip Details</Heading> */}
        <VStack spacing="0px">
          {/* color bar */}
          <HStack w="100%" h="15px" bg="#C3322C" transform="translateY(10px)" borderTopRadius="15px">
            <Box h="100%" w="50%" bg="#F5C14D" borderTopLeftRadius="15px"></Box>
          </HStack>

          {/* data container */}
          <Box w="100%" py="20px" borderWidth="1px" borderRadius="15px">
            <Heading fontSize="16px" mt="10px" mb="20px" textAlign="center">{flightInfo.firstName} {flightInfo.lastName} ({flightInfo.confirmationNumber})</Heading>
            <FlightDetails flightInfo={flightInfo} />
          </Box>
        </VStack>
        {/* check in time display */}
        { flightInfo.flights.length === 1 
          ? <Heading mt="30px" fontSize="16px">You'll be checked in at {flightInfo.flights[0].checkInTime}</Heading>
          : <></>
        }
        { flightInfo.flights.length === 2
          ? <Heading mt="30px" fontSize="16px">You'll be checked in at {flightInfo.flights[0].checkInTime} You'll also be checked in at {flightInfo.flights[1].checkInTime}</Heading>
          : <></>
        }
        
        {/* back arrow */}
        <Box w="170px" maxW="800px" m="auto">
          <HStack 
            spacing="5px" 
            cursor="pointer" 
            transitionDuration="300ms"
            transitionTimingFunction="ease-out"
            onClick={() => setDisplayMode('form')} 
            _hover={{
              "marginLeft": "-12px",
              "color": "#F5C14D"
            }}
          >
            <Heading fontSize="16px">←</Heading>
            <Heading fontSize="16px">set up another trip</Heading>
          </HStack>
        </Box>

        {/* keep this on the bottom so elements are blocked by footer */}
        <Box h="100px"></Box>
      </VStack>
    </>
   );
}
 
export default FlightInfo;