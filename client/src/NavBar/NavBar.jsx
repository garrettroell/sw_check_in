import { Box, Heading, HStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import shoutwestLogo from'../Assets/shoutwest.png';

const NavBar = () => {
  return ( 
    <Box maxW="1000px" m="auto" >
      <HStack h="100px" justify="space-between" align="center">
        <Link to="/">
          <Box boxSize='md' w="225px" h="41px">
            <Image src={shoutwestLogo} alt='Dan Abramov' />
          </Box>
        </Link>
        <Link to="/about"><Heading fontSize="18px" color="#304BB3">About</Heading></Link>
      </HStack>
    </Box>
   );
}
 
export default NavBar;