import { Box, Flex, Heading, Spacer, Stack, useMediaQuery, VStack } from "@chakra-ui/react";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";
import { MdOutlineNotes, MdOutlineScheduleSend, MdOutlineAirplaneTicket, MdOutlineMarkEmailRead } from 'react-icons/md';
import { IoMdPaperPlane } from 'react-icons/io';

const AboutPage = () => {
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)')
  const [isLargerThan550] = useMediaQuery('(min-width: 550px)')
  return ( 
    <>
      <Box w="100vw" h="100vh" positon="relative">
        <NavBar />
        <Heading textAlign="center">How it works</Heading>
        <Stack maxW="1000px"w="100%" m="auto" direction={isLargerThan1000 ? "row" : "column"} spacing="0px" px="20px" mt="50px">
          <Stack direction={isLargerThan550 ? "row" : "column"} spacing="0px" w="100%" >
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">1. User Inputs Data</Heading>
              <Spacer h="15px" />
              <Flex h="140px" w="140px" m="auto" textAlign="center" align="center" justify="center">
                <MdOutlineNotes fontSize="75px"  />
              </Flex>
            </Box>
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">2. Server get details</Heading>
              <Spacer h="15px" />
              <Flex h="140px" w="140px" m="auto" textAlign="center" align="center" justify="center">
                <MdOutlineMarkEmailRead fontSize="75px"  />
              </Flex>
            </Box>
          </Stack>
          <Stack direction={isLargerThan550 ? "row" : "column"} spacing="0px" w="100%">
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">3. Server schedules run</Heading>
              <Spacer h="15px" />
              <Flex h="140px" w="140px" m="auto" textAlign="center" align="center" justify="center">
                <MdOutlineScheduleSend fontSize="75px"  />
              </Flex>
            </Box>
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">4. Server executes check in</Heading>
              <Spacer h="15px" />
              <Flex h="140px" w="140px" m="auto" textAlign="center" align="center" justify="center">
                <MdOutlineAirplaneTicket fontSize="75px"  />
              </Flex>
            </Box>
          </Stack>
        </Stack>
        <VStack maxW="1000px" m="auto" align="flex-start">
          <Heading fontSize="20px">1: </Heading>
          <Heading fontSize="16px">
            Only minimal information is needed to set up the automatic check in. Only tell us first name, last name,
            and confirmation number, and you'll be set. You won't be asked to share an email or create an account.
          </Heading>
          <Heading fontSize="20px">2: </Heading>
          <Heading fontSize="16px">
            Using the minimal trip details, we can get your flight time and departure time zone.
          </Heading>
          <Heading fontSize="20px">3: </Heading>
          <Heading fontSize="16px">
            We'll create a scheduled function call to run 24 hours before your flight.
          </Heading>
          <Heading fontSize="20px">4: </Heading>
          <Heading fontSize="16px">
            Percisely 24 hours before your flight a bot will check you into your flight.
          </Heading>
        </VStack>
        <Footer />
      </Box>
      
    </>
   );
}
 
export default AboutPage;