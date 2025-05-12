export function validateRequiredField(value) {
  let error;
  if (!value) {
    error = `This field is required`;
  }
  return error;
}

export function validateEmail(value) {
  let error;
  if (!value) {
    error = null;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}
