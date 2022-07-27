import { Box, Spacer } from "@chakra-ui/react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
import FlightInfo from "./FlightInfo";
import FeedbackForm from "./FeedbackForm";

const SuccessPage = () => {
  const { state } = useLocation();
  const flightInfo = state; // Read values passed on state

  return (
    <>
      <Box px="20px" position="relative">
        <NavBar />
        <FlightInfo flightInfo={flightInfo} />
        <Spacer h="100px" />

        <FeedbackForm flightInfo={flightInfo} />
      </Box>

      {/* spacer prevents the footer from blocking content */}
      <Spacer h="100px" />
      <Footer />
    </>
  );
};

export default SuccessPage;
