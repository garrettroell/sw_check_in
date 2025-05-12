import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Heading,
} from "@chakra-ui/react";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import SetUpFormBox from "../Components/SetUpForm/SetUpFormBox";
import PastResultsSection from "../Components/PastResults/PastResultsSection";

const HomePage = () => {
  return (
    <>
      <Box px="20px" mb="100px">
        {/* navbar */}
        <NavBar />

        {/* top text */}
        <Heading mt="75px" textAlign="center" fontSize="16px">
          Add your Southwest trip details, and this site will check you in
          seconds after the check in window opens.
        </Heading>
        <Alert status="warning" maxW="430px" margin="auto" px="10px" mt="40px">
          <AlertIcon />
          <AlertDescription>
            This site is still experimental, so there may be errors
          </AlertDescription>
        </Alert>

        {/* set up form */}
        <SetUpFormBox />

        {/* past results button and graph */}
        <PastResultsSection />
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
