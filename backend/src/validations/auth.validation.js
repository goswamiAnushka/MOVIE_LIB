const Joi = require('joi');

const register = {
  body: Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    username: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    birthday: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/) // Pattern for YYYY-MM-DD
      .required()
      .label("Birthday"),
    gender: Joi.string().valid("Male", "Female", "Other").required().label("Gender"),
    password: Joi.string().min(6).required().label("Password"),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().label("Confirm Password"), 
    termsAccepted: Joi.boolean().valid(true).required().label("Terms Accepted"), 
  }),
};
const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};  

const logout = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
const resetPassword = {
  body: Joi.object({
    token: Joi.string().required().label("Token"),
    newPassword: Joi.string().min(6).required().label("New Password"),
    confirmPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .label("Confirm Password"),
  }),
};

const verifyEmail = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};