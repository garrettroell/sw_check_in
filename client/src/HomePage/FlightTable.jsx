import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const FlightTable = ({flightInfo}) => {
  console.log(flightInfo)
  return ( 
    <Table variant='unstyled' size="sm">
      <Thead>
        <Tr>
          <Th textAlign="center" textDecoration="underline">Date</Th>
          <Th textAlign="center" textDecoration="underline">Time</Th>
          <Th textAlign="center" textDecoration="underline">From</Th>
          <Th textAlign="center" textDecoration="underline">To</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          flightInfo.flightInfo.map(flight => {
            return(
              <Tr>
                <Td textAlign="center">{flight.date}</Td>
                <Td textAlign="center">{flight.departureTime}</Td>
                <Td textAlign="center">To City</Td>
                <Td textAlign="center">From City</Td>
              </Tr>
            )
          })
        }
      </Tbody>
    </Table> 
  );
}
 
export default FlightTable;