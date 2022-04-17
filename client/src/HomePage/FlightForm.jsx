import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, Spacer, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';
import { useRef, useState } from "react";
import getBackendUrl from "../Helpers/getBackendUrl";

const FlightForm = ({setFlightInfo, setDisplayMode}) => {
  const toast = useToast()
  const toastIdRef = useRef()
  const [showEmail, setShowEmail] = useState(false)

  function validateField(value) {
    let error
    if (!value) {
      error = `This field is required`
    }
    return error
  }

  return ( 
    <>
      <Heading mt="75px" textAlign="center" fontSize="24px">Southwest Auto Check-in</Heading>
       {/* color bar */}
      <HStack maxW="350px" m="auto" h="15px" bg="#C3322C" transform="translateY(35px)" borderTopRadius="15px">
        <Box h="100%" w="50%" bg="#F5C14D" borderTopLeftRadius="15px"></Box>
      </HStack>

      {/* form container */}
      <Box maxW="350px" m="auto" mt="20px"  p="20px" mb="50px" borderWidth="1px" borderRadius="15px">
        <Formik
        // may need to separate shipping and billing addresses
        initialValues={{ 
          // email: '', 
          firstName: '',
          lastName: '',
          confirmationNumber: '',
        }}
        onSubmit={(values, actions) => {
          toastIdRef.current = toast({
            title: 'Getting data from Southwest',
            status: 'info',
            isClosable: true,
          })
  
          // send data to server
          fetch(`${getBackendUrl()}/set-up`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...values }),
          }).then(r => {
            r.json().then(flights => {
              // console.log(flightInfo)
              setFlightInfo({...values, flights: flights})
              actions.setSubmitting(false)
              setDisplayMode('info')
              if (toastIdRef.current) {
                toast.close(toastIdRef.current)
              }
            })
          }).catch(e =>  {
            console.log(e)
            actions.setSubmitting(false)
            if (toastIdRef.current) {
              toast.close(toastIdRef.current)
            }
            toastIdRef.current = toast({
              title: e,
              status: 'info',
              isClosable: true,
            })
          })
            
        }}
      >
        {(props) => (
          <Form>
            <Spacer h="15px" />
            <Field name='firstName' validate={validateField}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                  <FormLabel htmlFor='firstName' fontSize="sm" mb="0px">First Name</FormLabel>
                  <Input {...field} 
                    id='firstName' 
                    placeholder='' 
                    px="10px" 
                    h="35px" 
                    minW="100%" 
                    fontSize="14px"
                    _autofill= {{
                      textFillColor: useColorModeValue('rgb(26, 32, 44)', 'white'),
                      boxShadow: "0 0 0px 1000px #00000000 inset",
                      transition: "background-color 5000s ease-in-out 0s",
                    }} 
                  />
                </FormControl>
              )}
            </Field>
            <Spacer h="15px" />
            <Field name='lastName' validate={validateField}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                  <FormLabel htmlFor='lastName' fontSize="sm" mb="0px">Last Name</FormLabel>
                  <Input {...field} 
                    id='lastName' 
                    placeholder='' 
                    px="10px" 
                    h="35px" 
                    minW="100%" 
                    fontSize="14px" 
                    _autofill= {{
                      textFillColor: useColorModeValue('rgb(26, 32, 44)', 'white'),
                      boxShadow: "0 0 0px 1000px #00000000 inset",
                      transition: "background-color 5000s ease-in-out 0s",
                    }}
                  />
                </FormControl>
              )}
            </Field>
            <Spacer h="15px" />
            <Field name='confirmationNumber' validate={validateField}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.confirmationNumber && form.touched.confirmationNumber}>
                  <FormLabel htmlFor='confirmationNumber' fontSize="sm" mb="0px">Confirmation Number</FormLabel>
                  <Input {...field}  
                    id='confirmationNumber'  
                    placeholder='' 
                    px="10px" 
                    h="35px"  
                    minW="100%"  
                    fontSize="14px"
                    _autofill= {{
                      textFillColor: useColorModeValue('rgb(26, 32, 44)', 'white'),
                      boxShadow: "0 0 0px 1000px #00000000 inset",
                      transition: "background-color 5000s ease-in-out 0s",
                    }}
                  />
                </FormControl>
              )}
            </Field>
            {/* <Spacer h="30px" /> */}
            {/* {
              showEmail
              ?  <Text>yooo</Text>
              : <Button
              onClick={setShowEmail(true)}
              bg="transparent" 
              borderWidth="1px"
              color="#ffffffbb" 
              isLoading={props.isSubmitting}
              m="auto"
              w="100%"
            >
              Opt-in for email updates?
            </Button>
            } */}
            
            <Spacer h="30px" />
            
            <Button 
              type='submit' 
              bg="#304BB3" 
              color="white" 
              isLoading={props.isSubmitting}
              m="auto"
              w="100%"
            >
              Auto Check In
            </Button>
          </Form>
        )}
        </Formik>
      </Box>
      <Box h="25px"></Box>
    </>
   );
}
 
export default FlightForm;