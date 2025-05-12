import {
  Box,
  Flex,
  Heading,
  Spacer,
  Stack,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import Footer from "../Components/Footer/Footer";
import NavBar from "../Components/NavBar/NavBar";
import {
  MdOutlineNotes,
  MdOutlineScheduleSend,
  MdOutlineAirplaneTicket,
  MdOutlineMarkEmailRead,
  MdOutlineEmail,
} from "react-icons/md";
import { IoMdPaperPlane } from "react-icons/io";
import { EmailIcon } from "@chakra-ui/icons";

const AboutPage = () => {
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const [isLargerThan550] = useMediaQuery("(min-width: 550px)");
  return (
    <>
      <Box w="100vw" h="100vh" positon="relative">
        <NavBar />
        <Heading textAlign="center">How it works</Heading>
        <Stack
          maxW="1000px"
          w="100%"
          m="auto"
          direction={isLargerThan1000 ? "row" : "column"}
          spacing="10px"
          px="20px"
          mt="50px"
        >
          <Stack
            direction={isLargerThan550 ? "row" : "column"}
            spacing="0px"
            w={isLargerThan1000 ? "67%" : "100%"}
          >
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">
                1. User Inputs Data
              </Heading>
              <Spacer h="15px" />
              <Flex
                h="140px"
                w="140px"
                m="auto"
                textAlign="center"
                align="center"
                justify="center"
              >
                <MdOutlineNotes fontSize="75px" />
              </Flex>
            </Box>
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">
                2. Server schedules run
              </Heading>
              <Spacer h="15px" />
              <Flex
                h="140px"
                w="140px"
                m="auto"
                textAlign="center"
                align="center"
                justify="center"
              >
                <MdOutlineScheduleSend fontSize="75px" />
              </Flex>
            </Box>
          </Stack>
          <Stack
            direction={isLargerThan550 ? "row" : "column"}
            spacing="0px"
            w={isLargerThan1000 ? "33%" : "100%"}
          >
            <Box w="100%" h="200px">
              <Heading fontSize="18px" textAlign="center">
                3. Server executes check in
              </Heading>
              <Spacer h="15px" />
              <Flex
                h="140px"
                w="140px"
                m="auto"
                textAlign="center"
                align="center"
                justify="center"
              >
                <MdOutlineAirplaneTicket fontSize="75px" />
              </Flex>
            </Box>
            {isLargerThan550 && !isLargerThan1000 ? (
              <Box w="100%" h="200px" />
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
        <Footer />
      </Box>
    </>
  );
};

export default AboutPage;
