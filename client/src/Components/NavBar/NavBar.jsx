import {
  Box,
  Heading,
  HStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import shoutlessBlue from "../../Assets/shoutless.png";
import shoutlessWhite from "../../Assets/shoutless_white.png";

const NavBar = () => {
  return (
    <Box maxW="1000px" m="auto" px="5px">
      <HStack h="100px" justify="space-between" align="center">
        <Link to="/">
          <Box boxSize="md" w="225px" h="41px">
            <Image
              src={useColorModeValue(shoutlessBlue, shoutlessWhite)}
              alt="Website logo"
            />
          </Box>
        </Link>
        <Link to="/about">
          <Heading
            fontSize="18px"
            color={useColorModeValue("#304BB3", "white")}
            _hover={{ color: "#F5C14D" }}
          >
            About
          </Heading>
        </Link>
      </HStack>
    </Box>
  );
};

export default NavBar;
