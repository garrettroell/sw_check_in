import { Box, Heading } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
import FlightInfo from "./FlightInfo";

const SuccessPage = () => {

  const {state} = useLocation();
  const flightInfo = state; // Read values passed on state

  return ( 
    <>
      <Box w="100vw" h="100vh" positon="relative" px="20px">
        <NavBar />
        <FlightInfo flightInfo={flightInfo} />
      </Box>
      <Footer />
    </>
  );
}
 
export default SuccessPage;