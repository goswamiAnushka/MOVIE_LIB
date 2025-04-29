// src/routes/v1/auth.route.js
const express = require('express');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

// Register route
router.post('/register', validate(authValidation.register), authController.register);

// Login route
router.post('/login', validate(authValidation.login), authController.login);

// Logout route
router.post('/logout', validate(authValidation.logout), authController.logout);

// Refresh tokens route
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);

router.post(
    "/reset-password",
    validate(authValidation.resetPassword),
    authController.resetPassword
  );
  
// Send verification email route
//router.post('/send-verification-email', auth(), authController.sendVerificationEmail);

// Verify email route
//router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;