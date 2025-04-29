// loginValidation.js
import * as yup from "yup";

/**
 * Validation schema for Login
 */
const loginValidation = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .trim()
    .min(6, "Must be 8 or more than 8 characters")
    .required("Password field is Required")
    .matches(/\w/, "Please enter a valid password"),
});

export default loginValidation;
