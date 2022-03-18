import { Box, Heading } from "@chakra-ui/react";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";

const AboutPage = () => {
  return ( 
    <>
      <Box w="100vw" h="100vh" positon="relative">
        <NavBar />
        <Heading textAlign="center">About Page</Heading>
        <Footer />
      </Box>
      
    </>
   );
}
 
export default AboutPage;