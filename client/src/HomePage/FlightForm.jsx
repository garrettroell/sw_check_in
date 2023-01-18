import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import getBackendUrl from "../Helpers/getBackendUrl";

const FlightForm = () => {
  const toast = useToast();
  const toastIdRef = useRef();
  const emailRef = useRef(null);
  let navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  function validateField(value) {
    let error;
    if (!value) {
      error = `This field is required`;
    }
    return error;
  }

  function validateEmail(value) {
    let error;
    if (!value) {
      error = null;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  return (
    <>
      <Heading mt="75px" textAlign="center" fontSize="16px">
        Add your Southwest trip details, and this site will check you in seconds
        after the check in window opens.
      </Heading>
      {/* color bar */}
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
        mb="50px"
        borderWidth="1px"
        borderRadius="15px"
      >
        <Formik
          // may need to separate shipping and billing addresses
          initialValues={{
            firstName: "",
            lastName: "",
            confirmationNumber: "",
            email: "",
          }}
          onSubmit={(values, actions) => {
            setSubmitted(true);

            toastIdRef.current = toast({
              title: "Getting data from Southwest",
              status: "info",
              isClosable: true,
              duration: 20000, // 20 seconds
            });

            // send data to server
            fetch(`${getBackendUrl()}/set-up`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...values }),
            })
              .then((r) => {
                r.json().then((flights) => {
                  // handle case where flights are found
                  if (Object.keys(flights).length > 0) {
                    console.log(
                      "flights",
                      flights,
                      Object.keys(flights).length
                    );
                    actions.setSubmitting(false);
                    if (toastIdRef.current) {
                      toast.close(toastIdRef.current);
                    }
                    navigate("/success", {
                      state: { ...values, flights: flights },
                    });
                  }
                  // handle case where flights are NOT found
                  else {
                    actions.setSubmitting(false);
                    if (toastIdRef.current) {
                      toast.close(toastIdRef.current);
                    }
                    toastIdRef.current = toast({
                      title: "Southwest reserveration was not found.",
                      status: "error",
                      isClosable: true,
                    });
                  }
                });
              })
              .catch((e) => {
                console.log(e);
                actions.setSubmitting(false);
                if (toastIdRef.current) {
                  toast.close(toastIdRef.current);
                }
                toastIdRef.current = toast({
                  title: e,
                  status: "info",
                  isClosable: true,
                });
              });
          }}
        >
          {(props) => (
            <Form
              onChange={(inputElement) => {
                // if the email changes and the field is not blank, then show email field
                if (inputElement.target.id === "email") {
                  const emailText = inputElement.target.value;
                  if (emailText !== "") {
                    setShowEmail(true);
                  }
                }
              }}
            >
              <Spacer h="15px" />
              <Field name="firstName" validate={validateField}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.firstName && form.touched.firstName}
                  >
                    <FormLabel htmlFor="firstName" fontSize="sm" mb="0px">
                      First Name
                    </FormLabel>
                    <Input
                      {...field}
                      id="firstName"
                      placeholder=""
                      px="10px"
                      h="35px"
                      minW="100%"
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
              <Spacer h="15px" />
              <Field name="lastName" validate={validateField}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.lastName && form.touched.lastName}
                  >
                    <FormLabel htmlFor="lastName" fontSize="sm" mb="0px">
                      Last Name
                    </FormLabel>
                    <Input
                      {...field}
                      id="lastName"
                      placeholder=""
                      px="10px"
                      h="35px"
                      minW="100%"
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
              <Spacer h="15px" />
              <Field name="confirmationNumber" validate={validateField}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.confirmationNumber &&
                      form.touched.confirmationNumber
                    }
                  >
                    <FormLabel
                      htmlFor="confirmationNumber"
                      fontSize="sm"
                      mb="0px"
                    >
                      Confirmation Number
                    </FormLabel>
                    <Input
                      {...field}
                      id="confirmationNumber"
                      placeholder=""
                      px="10px"
                      h="35px"
                      minW="100%"
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
              <Spacer h="25px" />

              <Field name="email" validate={validateEmail}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                    // if email field is blank when blurred, show button
                    onBlur={() => {
                      if (form.values.email === "") {
                        setShowEmail(false);
                      }
                    }}
                  >
                    <Box h={showEmail ? "35px" : "0px"}>
                      <Input
                        {...field}
                        id="email"
                        ref={emailRef}
                        placeholder=""
                        px="10px"
                        borderWidth={showEmail ? "1px" : "0px"}
                        minW="100%"
                        maxH="35px"
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
                    </Box>
                  </FormControl>
                )}
              </Field>
              <Button
                display={showEmail ? "none" : ""}
                variant="ghost"
                m="0px"
                h="35px"
                w="100%"
                borderWidth="1px"
                fontSize="14px"
                onClick={() => {
                  setShowEmail(true);
                  emailRef.current.focus();
                }}
              >
                Optionally, add your email address
              </Button>
              <Heading
                fontSize="11px"
                opacity="0.8"
                mt="6px"
                textAlign="center"
              >
                We'll only use this to deliver your boarding pass
              </Heading>

              <Spacer h="30px" />
              <Button
                type="submit"
                bg="#304BB3"
                color="white"
                isLoading={props.isSubmitting}
                m="auto"
                w="100%"
              >
                Set up automatic check in
              </Button>
            </Form>
          )}
        </Formik>
      </Box>

      {submitted ? (
        <Alert status="warning" maxW="520px" margin="auto" px="10px">
          <AlertIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This site is still experimental, so there may be errors
          </AlertDescription>
        </Alert>
      ) : (
        <></>
      )}

      <Box h="25px"></Box>
    </>
  );
};

export default FlightForm;
