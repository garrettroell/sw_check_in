import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import theme from "./Theme/Theme";
import AboutPage from "./About/AboutPage";
import SuccessPage from "./SuccessPage/SuccessPage";
import UpcomingFlightsPage from "./UpcomingFlightsPage/UpcomingFlightsPage";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/upcoming-flights" element={<UpcomingFlightsPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
