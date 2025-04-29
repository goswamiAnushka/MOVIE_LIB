import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";

import LeftSection from "../../Common/LeftSection";
import TextFieldInput from "../../Common/UiComps/TextField";
import ButtonField from "../../Common/UiComps/ButtonField";
import FullScreenLoader from "../../Common/UiComps/FullScreenLoader";

import { useResetPassword } from "./useResetpass";

const ResetPassword = () => {
  const { resetPassFormik, openConfirmModal, gotoLogin, isPending } = useResetPassword();

  // Debugging log to see if the dialog state is updating
  useEffect(() => {
    console.log("openConfirmModal state: ", openConfirmModal); // Check if it's updating
  }, [openConfirmModal]);

  return (
    <Container
      maxWidth={false}
      className="auth-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Grid container spacing={0} className="auth-wrapper-inner">
        {/* Left Section */}
        <Grid
          item
          md={7}
          sm={12}
          xs={12}
          style={{
            height: "100vh", // Ensures it takes the full height of the viewport
          }}
        >
          <LeftSection /> {/* Using LeftSection here */}
        </Grid>

        {/* Right Section */}
        <Grid
          item
          md={5}
          sm={12}
          xs={12}
          className="auth-form-outer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box className="auth-form-wrap">
            <Box className="auth-form-top">
              <a href="/login">Back to Login</a>
              <h2>Create New Password</h2>
              <p>Your new password must be different from previous passwords.</p>
            </Box>

            <form onSubmit={resetPassFormik.handleSubmit}>
              <Box className="auth-input-wrap">
                <TextFieldInput
                  name="password"
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  onChange={resetPassFormik.handleChange}
                  onBlur={resetPassFormik.handleBlur}
                  error={
                    resetPassFormik.touched.password &&
                    !!resetPassFormik.errors.password
                  }
                  helperText={
                    resetPassFormik.touched.password
                      ? resetPassFormik.errors.password
                      : ""
                  }
                />

                <TextFieldInput
                  name="confirm_password"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  onChange={resetPassFormik.handleChange}
                  onBlur={resetPassFormik.handleBlur}
                  error={
                    resetPassFormik.touched.confirm_password &&
                    !!resetPassFormik.errors.confirm_password
                  }
                  helperText={
                    resetPassFormik.touched.confirm_password
                      ? resetPassFormik.errors.confirm_password
                      : ""
                  }
                />
                <ButtonField
                  type="submit"
                  fullWidth
                  label="Reset Password"
                  mainCls="p-btn"
                />
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
<Dialog open={openConfirmModal} onClose={gotoLogin}>
  <DialogContent>
    <h3>Password Reset Successfully</h3>
    <p>Your password has been successfully reset</p>
    <p>You can now log in.</p>
    <Button onClick={gotoLogin} className="p-btn">
      Log In
    </Button>
  </DialogContent>
</Dialog>
    <FullScreenLoader open={isPending} />
    </Container>
  );
};
export default ResetPassword;
