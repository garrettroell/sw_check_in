import { Box, useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import SetupForm from "./SetupForm";

let endPoint
if (import.meta.env.MODE === 'development') {
  endPoint = import.meta.env.VITE_LOCAL_ENDPOINT
} else {
  endPoint = import.meta.env.VITE_PROD_ENDPOINT
}

console.log(import.meta.env.MODE)

const HomePage = () => {
  const { setColorMode } = useColorMode()


  useEffect(() => {
    // set inital color mode
    setColorMode('dark')
  }, []);
  return ( 
    <>
    <Box w="100vw" h="100vh" positon="relative" px="20px">
      <NavBar />
      <SetupForm />
    </Box>
    <Footer />
    
  </>
   );
}
 
export default HomePage;