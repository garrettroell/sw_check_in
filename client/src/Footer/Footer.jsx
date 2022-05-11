import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Heading, HStack, useColorMode, Link } from "@chakra-ui/react";
import { FiGithub } from 'react-icons/fi';

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const currentYear = new Date().getFullYear()
  return ( 
    <HStack position="fixed" bottom="0px" left="0px" width="100vw" height="50px" bg="#304BB3" justify="space-between" px="40px">
      <Heading fontSize="16px" color="white">
        <Link href='https://garrettroell.com' _hover={{color: '#F5C14D'}} isExternal>
          Garrett Roell {currentYear}
        </Link>
      </Heading>
      <HStack>
        <Link href='https://github.com/garrettroell/sw_check_in' isExternal>
          <Button variant="outline">
            <FiGithub color="white"/>
          </Button>
        </Link>
        <Button  onClick={toggleColorMode} variant="outline">
          {colorMode === 'light' ? <MoonIcon w={4} h={4} p="0" color="white" /> : <SunIcon w={4} h={4} px="0" />}
        </Button>
      </HStack>
    </HStack>
   );
}
 
export default Footer;