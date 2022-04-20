import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './HomePage/HomePage'
import theme from './Theme/Theme'
import AboutPage from './About/AboutPage'
import SuccessPage from './SuccessPage/SuccessPage'

// const flightInfoContext = createContext()
// const [flightInfo, setFlightInfo] = useState("Test");

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* <flightInfoContext.Provider flightInfo={flightInfo}> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      {/* </flightInfoContext.Provider> */}
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
