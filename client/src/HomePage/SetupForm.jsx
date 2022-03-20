import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, Spacer } from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';
import getBackendUrl from "../Helpers/getBackendUrl";

const SetupForm = ({setFlightInfo}) => {

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
      <Box maxW="350px" m="auto" mt="20px" p="20px" borderWidth="1px" borderRadius="15px">
        <Formik
        // may need to separate shipping and billing addresses
        // initialValues={{ 
        //   // email: '', 
        //   firstName: '',
        //   lastName: '',
        //   confirmationNumber: '',
        // }}
        initialValues={{ 
          // email: '', 
          firstName: 'Garrett',
          lastName: 'Roell',
          confirmationNumber: '25XRZV',
        }}


        onSubmit={(values, actions) => {
  
          // send data to server
          fetch(`${getBackendUrl()}/set-up`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...values }),
          }).then(r => {
            r.json().then(flightInfo => {
              console.log(flightInfo)
              setFlightInfo({...values, flightInfo: flightInfo})
              actions.setSubmitting(false)
            })
          }).catch(e =>  {
            console.log(e)
            actions.setSubmitting(false)
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
                  <Input {...field} id='firstName' placeholder='' px="10px" h="35px" minW="100%" fontSize="14px" />
                </FormControl>
              )}
            </Field>
            <Spacer h="15px" />
            <Field name='lastName' validate={validateField}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                  <FormLabel htmlFor='lastName' fontSize="sm" mb="0px">Last Name</FormLabel>
                  <Input {...field} id='lastName' placeholder='' px="10px" h="35px" minW="100%" fontSize="14px" />
                </FormControl>
              )}
            </Field>
            <Spacer h="15px" />
            <Field name='confirmationNumber' validate={validateField}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.confirmationNumber && form.touched.confirmationNumber}>
                  <FormLabel htmlFor='confirmationNumber' fontSize="sm" mb="0px">Confirmation Number</FormLabel>
                  <Input {...field} id='confirmationNumber' placeholder='' px="10px" h="35px" minW="100%" fontSize="14px" />
                </FormControl>
              )}
            </Field>
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
    </>
   );
}
 
export default SetupForm;