const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { tokenTypes } = require('../config/tokens');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios');

/**
 * Verify callback for Passport JWT strategy.
 * @param {Object} req - The request object.
 * @param {Function} resolve - Resolve function for the Promise.
 * @param {Function} reject - Reject function for the Promise.
 * @param {Array} requiredRights - Required rights for the route.
 * @returns {Function} - The verify callback function.
 */
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    console.error("Authentication Error:", err || info?.message || "No user found.");
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token or session expired.'));
  }

  req.user = user;

  // Check if the user has the required rights
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role) || [];
    const hasRequiredRights = requiredRights.every((right) => userRights.includes(right));

    if (!hasRequiredRights && req.params.userId !== String(user.id || user._id)) {
      console.warn("⚠️ Access Denied - Insufficient Permissions:", { userRole: user.role, requiredRights });
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden - Insufficient permissions.'));
    }
  }

  resolve();
};

/**
 * Middleware to authenticate requests using JWT.
 * @param {...string} requiredRights - Required rights for the route.
 * @returns {Function} - The middleware function.
 */
const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => {
      console.log("Authentication Successful - User:", req.user);
      next();
    })
    .catch((err) => {
      console.error("Authentication Middleware Error:", err.message);

      // Handle token expiration
      if (err.message === 'Invalid token or session expired.') {
        const refreshToken = req.cookies?.refresh_token || req.headers['x-refresh-token'];
        if (!refreshToken) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'No refresh token available.'));
        }
      
        // Prevent infinite loops by limiting retry attempts
        if (req._retry) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token failed.'));
        }
      
        req._retry = true;  // Mark as retried
      
        axios.post(`${config.serverUrl}/v1/auth/refresh-tokens`, { refreshToken })
          .then((response) => {
            const { accessToken } = response.data;
            req.headers.authorization = `Bearer ${accessToken}`;
            return auth(...requiredRights)(req, res, next);  // Retry with new token
          })
          .catch((refreshError) => {
            console.error("Refresh Token Error:", refreshError.message);
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Failed to refresh token.'));
          });
      }
      
    });
};

module.exports = auth;