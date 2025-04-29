import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import TextFieldInput from "../../Common/UiComps/TextField";
import ButtonField from "../../Common/UiComps/ButtonField";
import FullScreenLoader from "../../Common/UiComps/FullScreenLoader";
import LeftSection from "../../Common/LeftSection";
import "../../custom.css";
import "../../responsive.css";
import "../../dark.css";
import "../../developer.css";
import "../../global.css";
import { useLogin } from "./useLogin";
const LoginIndex = () => {
  const { loginFormik, googleLogin, isPending, loginMessage, isError } = useLogin();
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isError && loginMessage) {
      setOpenErrorDialog(true);
    }
  }, [isError, loginMessage]);

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };
 return (
    <Container maxWidth={false} className="auth-wrapper">
      <Grid container spacing={0} className="auth-wrapper-inn">
        <Grid item lg={7} md={7} sm={12} xs={12} className="auth-wrapper-left">
          <LeftSection />
        </Grid>

        <Grid item lg={5} md={5} sm={12} xs={12} className="auth-form-outer">
          <Box className="auth-form-wrap">
            <Box className="auth-form-top">
              <h2>Welcome back</h2>
              <p>Nice to see you again, Please enter your details.</p>
            </Box>

            <ul className="auth-social-login">
              <li>
                <ButtonField
                  onClick={googleLogin}
                  img="/images/gmail-icon.svg"
                  alt="Gmail Icon"
                  imgHeight={24}
                  imgWidth={24}
                  label="Log In with Gmail"
                />
              </li>
              <li>
                <ButtonField
                  img="/images/facebook-icon.svg"
                  alt="Facebook Icon"
                  imgHeight={24}
                  imgWidth={24}
                  label="Log In with Facebook"
                />
              </li>
            </ul>
            <p className="other-auth-option">
              <span>or do it via E-mail</span>
            </p>

            <form onSubmit={loginFormik.handleSubmit}>
              <Box className="auth-input-wrap">
                <TextFieldInput
                  name="email"
                  id="email"
                  label="Enter Email"
                  placeholder="Enter your email address"
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  error={loginFormik.touched.email && !!loginFormik.errors.email}
                  helperText={loginFormik.touched.email ? loginFormik.errors.email : ""}
                />

                <TextFieldInput
                  name="password"
                  type="password"
                  id="password"
                  label="Enter Password"
                  placeholder="Enter your password"
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  error={loginFormik.touched.password && !!loginFormik.errors.password}
                  helperText={loginFormik.touched.password ? loginFormik.errors.password : ""}
                />
              </Box>

              <FormGroup className="auth-agree">
                <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                <Link to="/forgot_password">Forgot password?</Link>
              </FormGroup>

              <FormGroup>
                <ButtonField type="submit" mainCls="p-btn" label="Log In" />
              </FormGroup>
            </form>

            <p className="text-center auth-btm-info">
              Don't have an account? <Link to="/">Sign Up for Free</Link>
            </p>
          </Box>
        </Grid>
      </Grid>

      <FullScreenLoader open={isPending} />

      {/* Error Dialog */}
      <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <p>{loginMessage || "An error occurred. Please try again."}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginIndex;