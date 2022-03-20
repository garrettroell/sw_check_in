import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import FlightTable from "./FlightTable";

const FlightInfo = ({ flightInfo }) => {
  console.log(flightInfo)
  return ( 
    <>
      <Heading mt="75px" textAlign="center" fontSize="24px">Flight Info</Heading>
       {/* color bar */}
      <HStack maxW="800px" m="auto" h="15px" bg="#C3322C" transform="translateY(35px)" borderTopRadius="15px">
        <Box h="100%" w="50%" bg="#F5C14D" borderTopLeftRadius="15px"></Box>
      </HStack>

      {/* data container */}
      <Box maxW="800px" m="auto" mt="20px" p="20px" borderWidth="1px" borderRadius="15px">
        <Heading fontSize="16px" mt="10px" mb="30px">{flightInfo.firstName} {flightInfo.lastName} ({flightInfo.confirmationNumber})</Heading>
        <FlightTable flightInfo={flightInfo}/>
      </Box>
    </>
   );
}
 
export default FlightInfo;