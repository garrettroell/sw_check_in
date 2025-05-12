import { Box, HStack } from "@chakra-ui/react";
import SetUpForm from "./SetUpForm";

const SetUpFormBox = () => {
  return (
    <>
      <HStack
        maxW="350px"
        m="auto"
        h="15px"
        bg="#C3322C"
        transform="translateY(35px)"
        borderTopRadius="15px"
      >
        <Box h="100%" w="50%" bg="#F5C14D" borderTopLeftRadius="15px"></Box>
      </HStack>

      {/* form container */}
      <Box
        maxW="350px"
        m="auto"
        mt="20px"
        p="20px"
        borderWidth="1px"
        borderRadius="15px"
      >
        <SetUpForm />
      </Box>
    </>
  );
};

export default SetUpFormBox;
