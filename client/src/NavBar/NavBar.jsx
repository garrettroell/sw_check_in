import { Box, Heading, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return ( 
    <Box maxW="1000px" m="auto" >
      <HStack h="70px" justify="space-between" align="flex-end">
        <Link to="/"><Heading fontSize="40px">Easy A List</Heading></Link>
        <Link to="/about"><Heading fontSize="18px">About</Heading></Link>
      </HStack>
    </Box>
   );
}
 
export default NavBar;