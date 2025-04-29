import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Alert,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperNavButton from "../../Layout/SwiperNavButton";
import "swiper/css";
import "swiper/css/navigation";
import TextFieldInput from "../../Common/UiComps/TextField";
import DropDownField from "../../Common/UiComps/DropDownField";
import Datepicker from "../../Common/UiComps/DatePicker";
import dayjs from "dayjs";
import ButtonField from "../../Common/UiComps/ButtonField";
import FullScreenLoader from "../../Common/UiComps/FullScreenLoader";
import "../../custom.css";
import "../../responsive.css";
import "../../dark.css";
import "../../developer.css";
import "../../global.css";
import { useRegister } from "./useRegister";

const Register = () => {
  const { registerFormik, isPending, errorMessage } = useRegister();
  console.log(registerFormik.initialValues.username); // Check if it's set to a default value
  
  const genderOptions = [
    { value: "Male", title: "Male" },
    { value: "Female", title: "Female" },
    { value: "Others", title: "Others" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert the birthday to the format YYYY-MM-DD for backend compatibility
    const formattedBirthday = dayjs(registerFormik.values.birthday).format("YYYY-MM-DD");
    registerFormik.setFieldValue("birthday", formattedBirthday, false);

    try {
      await registerFormik.handleSubmit();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Container maxWidth={false} className="auth-wraper">
      <Grid container spacing={0} className="auth-wraper-inn">
        {/* Left Section with Swiper */}
        <Grid item xs={12} sm={12} md={7}>
          <Box className="auth-slider-wrap">
            <Swiper slidesPerView={1} loop modules={[Navigation]} className="authSwiper">
              <SwiperSlide>
                <Box className="auth-slider-img-holder">
                  <img src="/images/signup-slider-img1.jpg" alt="" />
                  <Box className="auth-slider-info">
                    <Box className="auth-slider-info-inner">
                      <Box className="auth-slider-info-inner-top">
                        <h1>
                          Start Your <br />
                          Journey With Us.
                        </h1>
                        <SwiperNavButton />
                      </Box>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Integer vel sed
                        enim aliquet volutpat adipiscing ante amet.
                      </p>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>

              <SwiperSlide>
                <Box className="auth-slider-img-holder">
                  <img src="/images/signup-slider-img2.jpg" alt="" />
                  <Box className="auth-slider-info">
                    <Box className="auth-slider-info-inner">
                      <Box className="auth-slider-info-inner-top">
                        <h1>
                          Welcome to <br />
                          Our Community.
                        </h1>
                        <SwiperNavButton />
                      </Box>
                      <p>
                        Join a community of passionate individuals. Explore
                        opportunities, connect, and grow with us.
                      </p>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            </Swiper>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} sm={12} md={5} className="auth-form-outer signup-form-wrap">
          <Box className="auth-form-wrap">
            <Box className="auth-form-top">
              <h2>
                Create Free Account{" "}
                <img width={32} height={32} src="/images/signup-hand-icon.svg" alt="Signup Icon" />
              </h2>
              <p>Let’s get started</p>
            </Box>

            {/* Display General API Error */}
            {errorMessage && (
              <Alert severity="error" className="error-alert">
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box className="auth-input-wrap">
                {/* First Name and Last Name */}
                <Box className="input-each-wrap">
                <TextFieldInput
  name="firstName"
  id="firstName"
  label="First Name *"
  placeholder="Enter first name"
  autoComplete="off"
  onChange={registerFormik.handleChange}
  onBlur={registerFormik.handleBlur}
  error={registerFormik.touched.firstName && !!registerFormik.errors.firstName}
  helperText={registerFormik.touched.firstName ? registerFormik.errors.firstName : ""}
/>

                  <TextFieldInput
                    name="lastName"
                    id="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    autoComplete="off"
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    error={registerFormik.touched.lastName && !!registerFormik.errors.lastName}
                    helperText={registerFormik.touched.lastName ? registerFormik.errors.lastName : ""}
                  />
                </Box>

                {/* Username */}
                <TextFieldInput
                  name="username"
                  id="username"
                  label="User Name"
                  placeholder="Enter user name"
                  autoComplete="off"
                  onChange={registerFormik.handleChange}
                  onBlur={registerFormik.handleBlur}
                  error={registerFormik.touched.username && !!registerFormik.errors.username}
                  helperText={registerFormik.touched.username ? registerFormik.errors.username : ""}
                />
 
               {/* Display backend error messages for the email field */}
               <TextFieldInput
                name="email"
                label="Email"
                value={registerFormik.values.email}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                error={registerFormik.touched.email && !!registerFormik.errors.email}
                helperText={registerFormik.touched.email ? registerFormik.errors.email : ""}
              />


                {/* Birthday and Gender */}
                <Box className="input-each-wrap">
                  <Datepicker
                    id="birthday"
                    name="birthday"
                    onChange={(newValue) => {
                      registerFormik.setFieldValue("birthday", newValue);
                    }}
                    value={dayjs(registerFormik.values.birthday)}
                    label="Birthday"
                  />
                  <DropDownField
                    id="gender"
                    name="gender"
                    options={genderOptions}
                    title="Gender"
                    onChange={registerFormik.handleChange}
                    error={registerFormik.touched.gender && !!registerFormik.errors.gender}
                    value={registerFormik.values.gender}
                    clsDrop="input-field"
                    placeholder="Select gender"
                  />
                </Box>

                {/* Password and Confirm Password */}
                <Box className="input-each-wrap">
                  <TextFieldInput
                    name="password"
                    type="password"
                    id="password"
                    label="Password"
                    placeholder="Enter Password"
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    error={registerFormik.touched.password && !!registerFormik.errors.password}
                    helperText={registerFormik.touched.password ? registerFormik.errors.password : ""}
                  />

                  <TextFieldInput
                    name="confirmPassword"
                    type="password"
                    id="confirmPassword"
                    label="Confirm password"
                    placeholder="Enter Confirm password"
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    error={registerFormik.touched.confirmPassword && !!registerFormik.errors.confirmPassword}
                    helperText={registerFormik.touched.confirmPassword ? registerFormik.errors.confirmPassword : ""}
                  />
                </Box>
              </Box>

              {/* Terms and Conditions */}
              <FormGroup className="auth-agree">
                <FormControlLabel
                  control={<Checkbox name="termsAccepted" checked={registerFormik.values.termsAccepted} onChange={registerFormik.handleChange} />}
                  label={<div><span>I accept </span><Link to="/terms">Terms and Conditions.</Link></div>}
                />
              </FormGroup>

              {/* Submit Button */}
              <ButtonField type="submit" fullWidth label="Sign Up" mainCls="p-btn" />
            </form>

            <p className="text-center auth-btm-info">
              <span>Already have an account?</span> <Link to="/login">Sign In</Link>
            </p>
          </Box>
        </Grid>
      </Grid>
      <FullScreenLoader open={isPending} />
    </Container>
  );
};

export default Register;