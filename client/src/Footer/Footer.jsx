import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Heading, HStack, useColorMode } from "@chakra-ui/react";

const Footer = () => {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode()
  return ( 
    <HStack position="absolute" bottom="0px" left="0px" width="100vw" height="50px" bg="#304BB3" justify="space-between" px="40px">
      <Heading fontSize="16px" color="white">Garrett Roell 2022</Heading>
      <Button  onClick={toggleColorMode} >
        {colorMode === 'light' ? <MoonIcon w={4} h={4} p="0" /> : <SunIcon w={4} h={4} px="0" />}
      </Button>
    </HStack>
   );
}
 
export default Footer;