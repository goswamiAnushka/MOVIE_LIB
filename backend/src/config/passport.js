const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 * JWT verification callback.
 * @param {Object} payload - The JWT payload.
 * @param {Function} done - The done callback.
 * @returns {Promise<void>}
 */
const jwtVerify = async (payload, done) => {
  try {
    if (!payload || payload.type !== tokenTypes.ACCESS) {
      return done(null, false, { message: 'Invalid token type' });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

// Create the JWT strategy
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};