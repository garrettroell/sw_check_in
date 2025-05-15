import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";

export const CustomInputField = React.forwardRef(
  ({ name, label, validate, ...rest }, ref) => (
    <Field name={name} validate={validate}>
      {({ field, form }) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          {label && (
            <FormLabel htmlFor={name} fontSize="sm" mb="0px">
              {label}
            </FormLabel>
          )}
          <Input
            {...field}
            id={name}
            ref={ref}
            px="10px"
            h="35px"
            fontSize="14px"
            minW="100%"
            _autofill={{
              textFillColor: useColorModeValue("rgb(26, 32, 44)", "white"),
              boxShadow: "0 0 0px 1000px #00000000 inset",
              transition: "background-color 5000s ease-in-out 0s",
            }}
            {...rest}
          />
        </FormControl>
      )}
    </Field>
  )
);

// Optional: add a display name for clearer debugging
CustomInputField.displayName = "CustomInputField";

export default CustomInputField;
