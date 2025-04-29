import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { registerUserApi } from "../../../actions/auth.actions";
import { registrationFormValidation } from "../../../Validations/Auth/register.validation";

export const useRegister = () => {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // General error message
  const navigate = useNavigate();

  const registerFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      birthday: "",
      gender: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
    validationSchema: registrationFormValidation,

    onSubmit: async (values, { setErrors }) => {
      console.log("📤 Form submitted with values:", values);
      setIsPending(true);
      setErrorMessage(""); // Clear previous errors
    
      try {
        const fullResponse = await registerUserApi(values);
        console.log("✅ Full API Response:", fullResponse);
    
        if (fullResponse?.user) {
          console.log("🎉 Registration successful!");
          setIsPending(false);
          navigate("/login"); // Redirect on success
          return;
        }
    
        throw new Error("Registration failed.");
      } catch (error) {
        console.error("❌ Error occurred during registration:", error);
        setIsPending(false);
    
        if (error.response) {
          const apiErrors = error.response.data;
    
          if (apiErrors?.errors) {
            // API returns field-specific errors (e.g., { email: "Email already exists" })
            setErrors(apiErrors.errors);
          } else if (apiErrors?.message) {
            // API returns a general error message
            setErrorMessage(apiErrors.message);
          } else {
            // Fallback error message if no specific errors provided
            setErrorMessage("Registration failed. Please check your details.");
          }
        } else if (error.request) {
          // No response received from the server
          setErrorMessage("No response from the server. Please try again later.");
        } else {
          // Other unexpected errors
          setErrorMessage(error.message || "An unexpected error occurred.");
        }
      }
    },
    
  });

  return { registerFormik, isPending, errorMessage };
};