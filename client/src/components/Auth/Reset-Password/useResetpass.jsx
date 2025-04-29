import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordApi } from "../../../actions/auth.actions";

export const useResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleResetPass = async (values) => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      toast.error("Token is missing or invalid");
      console.log("No token found in the URL");
      return;
    }
  
    const payload = {
      newPassword: values.password,
      confirmPassword: values.confirm_password,
    };
  
    try {
      setIsPending(true); // Show loader
      console.log("Sending request to reset password with token:", token);
  
      const response = await resetPasswordApi({ token, ...payload });
  
      console.log("API Response:", response); // Log the response
  
      setIsPending(false); // Hide loader
  
      if (response.message === "Password reset successful") {
        toast.success("Password reset successful!");
        setOpenConfirmModal(true); // This should trigger the dialog to open
        console.log("openConfirmModal state:", true); // Log when modal state is updated
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      setIsPending(false); // Hide loader
      toast.error("An error occurred during the reset process");
      console.error("Error during password reset:", error);
    }
  };
  

  const resetPassFormik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      handleResetPass(values);
    },
  });

  const gotoLogin = () => {
    console.log("Navigating to login page");
    navigate("/login");
  };

  return {
    resetPassFormik,
    openConfirmModal,
    gotoLogin,
    isPending,
  };
};
