import { Box } from "@chakra-ui/react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import FlightForm from "./FlightForm";
import PastResults from "./PastResultsButton";

const HomePage = () => {
  return (
    <>
      <Box px="20px" mb="100px">
        <NavBar />
        <FlightForm />
        <PastResults />
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
