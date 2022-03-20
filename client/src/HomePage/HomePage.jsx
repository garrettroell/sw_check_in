import { Box, useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
// import Footer from "../Footer/Footer";
import SetupForm from "./SetupForm";
import FlightInfo from "./FlightInfo";

let endPoint
if (import.meta.env.MODE === 'development') {
  endPoint = import.meta.env.VITE_LOCAL_ENDPOINT
} else {
  endPoint = import.meta.env.VITE_PROD_ENDPOINT
}

const HomePage = () => {
  const [flightInfo, setFlightInfo] = useState({})
  const { setColorMode } = useColorMode()

  // set inital color mode
  useEffect(() => {
    setColorMode('dark')
  }, []);

  return ( 
    <>
    <Box w="100vw" h="100vh" positon="relative" px="20px">
      <NavBar />
      { Object.keys(flightInfo).length === 0
        ? <SetupForm setFlightInfo={setFlightInfo} />
        : <FlightInfo flightInfo={flightInfo} />
      }
      
    </Box>
    {/* <Footer /> */}
    
  </>
   );
}
 
export default HomePage;