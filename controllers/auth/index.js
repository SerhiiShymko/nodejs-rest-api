const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const current = require('./current');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

module.exports = {
  register,
  login,
  logout,
  current,
  forgotPassword,
  resetPassword,
};
