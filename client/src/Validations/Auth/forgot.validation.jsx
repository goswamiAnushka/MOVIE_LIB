// forgotPassValidation.js
import * as yup from "yup";

/**
 * Validation schema for Forgot Password
 */
const forgotPassValidation = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

export default forgotPassValidation;

