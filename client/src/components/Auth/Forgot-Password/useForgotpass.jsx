import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../../actions/auth.actions";
import forgotPassValidation from "../../../Validations/Auth/forgot.validation";

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  // Function to handle the forgot password submission
  const handleSubmitForgotPass = async (email) => {
    try {
      const response = await forgotPasswordApi({ email }); // API call to send the password reset link
      if (response.status) {
        toast.success(response.message); // Show success toast
        navigate("/login"); // Redirect to login after successful password reset request
      } else {
        toast.error(response.message || "Failed to send reset link."); // Show error toast
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred."); // Show general error toast
    }
  };

  // Use Formik to handle the form submission
  const forgotPassFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPassValidation, // Use the validation schema for the email
    onSubmit: (values) => {
      startTransition(() => {
        handleSubmitForgotPass(values.email); // Call the function to submit the form
      });
    },
  });

  return {
    forgotPassFormik,
    isPending, // Return the pending state to control loading UI
  };
};
