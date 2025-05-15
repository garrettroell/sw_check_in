import { Box, Button, Heading, Spacer, useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateRequiredField,
} from "../../Helpers/setUpFormValidation";
import { showToast, closeToast } from "../../Helpers/toastUtils";
import getBackendUrl from "../../Helpers/getBackendUrl";
import { fetchFlightData } from "./fetchFlightData";
import CustomInputField from "./CustomInputField";

const SetUpForm = () => {
  const toast = useToast();
  const toastIdRef = useRef();
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const backendUrl = getBackendUrl();

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        confirmationNumber: "",
        email: "",
      }}
      onSubmit={async (values, actions) => {
        showToast(toast, toastIdRef, {
          title: "Getting data from Southwest",
          status: "info",
          isClosable: true,
          duration: 20000,
        });

        try {
          const flights = await fetchFlightData(backendUrl, values);
          console.log("Flights data:", flights);
          closeToast(toast, toastIdRef);
          actions.setSubmitting(false);

          console.log("Flights data:", flights);

          if (Object.keys(flights).length > 0) {
            navigate("/success", { state: { ...values, flights } });
          } else {
            showToast(toast, toastIdRef, {
              title: "Southwest reservation not found.",
              status: "error",
              isClosable: true,
            });
          }
        } catch {
          closeToast(toast, toastIdRef);
          actions.setSubmitting(false);
          showToast(toast, toastIdRef, {
            title: "Server not connected",
            status: "error",
            isClosable: true,
          });
        }
      }}
    >
      {(props) => (
        <Form
          onChange={(e) => {
            if (e.target.id === "email" && e.target.value !== "") {
              setShowEmail(true);
            }
          }}
        >
          <Spacer h="15px" />
          <CustomInputField
            name="firstName"
            label="First Name"
            validate={validateRequiredField}
          />
          <Spacer h="15px" />
          <CustomInputField
            name="lastName"
            label="Last Name"
            validate={validateRequiredField}
          />
          <Spacer h="15px" />
          <CustomInputField
            name="confirmationNumber"
            label="Confirmation Number"
            validate={validateRequiredField}
          />
          <Spacer h="25px" />
          <Box h={showEmail ? "35px" : "0px"}>
            <CustomInputField
              name="email"
              validate={validateEmail}
              ref={emailRef}
              borderWidth={showEmail ? "1px" : "0px"}
              onBlur={(e) => {
                if (e.target.value === "") setShowEmail(false);
              }}
            />
          </Box>
          {!showEmail && (
            <Button
              variant="ghost"
              m="0px"
              h="35px"
              w="100%"
              borderWidth="1px"
              fontSize="14px"
              onClick={() => {
                setShowEmail(true);
                emailRef.current?.focus();
              }}
            >
              Optionally, add your email address
            </Button>
          )}
          <Heading fontSize="11px" opacity="0.8" mt="6px" textAlign="center">
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
  );
};

export default SetUpForm;
