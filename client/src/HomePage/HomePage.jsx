import { Box, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import FlightForm from "./FlightForm";

const HomePage = () => {
  const { setColorMode } = useColorMode()

  // set inital color mode
  useEffect(() => {
    setColorMode('dark')
  }, []);

  return ( 
    <>
      <Box w="100vw" h="100vh" positon="relative" px="20px">
        <NavBar />
        <FlightForm />
      </Box>
      <Footer />
    </>
  );
}
 
export default HomePage;