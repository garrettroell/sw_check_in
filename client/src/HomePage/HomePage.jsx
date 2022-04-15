import { Box, useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import FlightForm from "./FlightForm";
import FlightInfo from "./FlightInfo";
import PlaneIcon from "../Assets/PlaneIcon";

const HomePage = () => {
  const [flightInfo, setFlightInfo] = useState({})

  // mock data
  // const [flightInfo, setFlightInfo] = useState({
  //   confirmationNumber: "2N42AQ",
  //   firstName: "Garrett",
  //   flightInfo: [
  //     {date: '5/12/22', departureTime: '1:40'},
  //     {date: '5/12/22', departureTime: '1:40'}
  //   ],
  //   lastName: "Roell"
  // })

  const [displayMode, setDisplayMode] = useState('form')

  const { setColorMode } = useColorMode()

  // set inital color mode
  useEffect(() => {
    setColorMode('dark')
  }, []);

  return ( 
    <>
    <Box w="100vw" h="100vh" positon="relative" px="20px">
      <NavBar />
      { displayMode === 'form' ? <FlightForm setFlightInfo={setFlightInfo} setDisplayMode={setDisplayMode} /> : <></> }
      { displayMode === 'info' ? <FlightInfo flightInfo={flightInfo} setFlightInfo={setFlightInfo} setDisplayMode={setDisplayMode} /> : <></> }      
    </Box>
    <Footer />
    
  </>
   );
}
 
export default HomePage;