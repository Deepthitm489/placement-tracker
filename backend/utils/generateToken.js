const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_placement_tracker_secret_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
