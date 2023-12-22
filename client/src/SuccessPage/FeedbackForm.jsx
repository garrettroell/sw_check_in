import {
  Box,
  Button,
  FormControl,
  Heading,
  Spacer,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import getBackendUrl from "../Helpers/getBackendUrl";

function validateField(value) {
  let error;
  if (!value) {
    error = `This field is required`;
  }
  return error;
}

const FeedbackForm = ({ flightInfo }) => {
  const toast = useToast();

  return (
    <VStack
      maxW="500px"
      w="100%"
      m="auto"
      spacing="24px"
      align="center"
      p="25px"
      borderWidth="1px"
      borderRadius="15px"
    >
      <Heading fontSize="xl">Feedback?</Heading>

      {/* form container */}
      <Box w="100%">
        <Formik
          // may need to separate shipping and billing addresses
          initialValues={{
            feedback: "",
          }}
          onSubmit={(values, actions) => {
            console.log(values.feedback);
            actions.setSubmitting(false);

            // send data to server
            fetch(`${getBackendUrl()}/feedback`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...values,
                firstName: flightInfo.firstName,
                lastName: flightInfo.lastName,
              }),
            })
              .then((r) => {
                // console.log(r);
                actions.setSubmitting(false);
                actions.resetForm();

                toast({
                  title: "Success: Thanks for the feedback",
                  status: "success",
                  isClosable: true,
                });
              })
              .catch((e) => {
                // console.log(e);
                actions.setSubmitting(false);

                toast({
                  title: "Error: Message not sent",
                  status: "error",
                  isClosable: true,
                });
              });
          }}
        >
          {(props) => (
            <Form>
              <Field name="feedback" validate={validateField}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.feedback && form.touched.feedback}
                  >
                    <Textarea
                      {...field}
                      id="feedback"
                      placeholder="Message me about feature requests, bug reports, or a story about how you found this website."
                      px="10px"
                      h="35px"
                      w="100%"
                      fontSize="14px"
                      _autofill={{
                        textFillColor: useColorModeValue(
                          "rgb(26, 32, 44)",
                          "white"
                        ),
                        boxShadow: "0 0 0px 1000px #00000000 inset",
                        transition: "background-color 5000s ease-in-out 0s",
                      }}
                    />
                  </FormControl>
                )}
              </Field>
              <Spacer h="24px" />
              <Box align="center">
                <Button
                  type="submit"
                  bg="#304BB3"
                  color="white"
                  isLoading={props.isSubmitting}
                  m="auto"
                  w="150px"
                >
                  Send Feedback
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </VStack>
  );
};

export default FeedbackForm;
