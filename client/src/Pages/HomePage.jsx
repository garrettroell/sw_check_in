import { Box } from "@chakra-ui/react";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import SetUpForm from "../Components/SetUpForm/SetUpForm";
import PastResultsSection from "../Components/PastResults/PastResultsSection";

const HomePage = () => {
  return (
    <>
      <Box px="20px" mb="100px">
        <NavBar />
        <SetUpForm />
        <PastResultsSection />
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
