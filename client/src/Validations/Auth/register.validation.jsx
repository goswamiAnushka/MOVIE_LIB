import * as Yup from 'yup';

export const registrationFormValidation = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  birthday: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  termsAccepted: Yup.bool().oneOf([true], "You must accept the terms and conditions")
});
