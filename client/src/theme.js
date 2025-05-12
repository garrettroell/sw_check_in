import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  // fonts: {
  //   heading: 'Poppins, sans-serif',
  //   body: 'Poppins, sans-serif',
  // },
};

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
