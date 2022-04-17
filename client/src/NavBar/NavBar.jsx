import { Box, Heading, HStack, Image, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import shoutwestBlue from'../Assets/shoutwest.png';
import shoutwestWhite from'../Assets/shoutwest_white.png';

const NavBar = () => {
  return ( 
    <Box maxW="1000px" m="auto" >
      <HStack h="100px" justify="space-between" align="center">
        <Link to="/">
          <Box boxSize='md' w="225px" h="41px">
            <Image src={useColorModeValue(shoutwestBlue, shoutwestWhite)} alt='Dan Abramov' />
          </Box>
        </Link>
        <Link to="/about"><Heading fontSize="18px" color={useColorModeValue("#304BB3", "white")}>About</Heading></Link>
      </HStack>
    </Box>
   );
}
 
export default NavBar;