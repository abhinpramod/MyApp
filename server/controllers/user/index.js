// controllers/index.js
const authController = require('./auth.controller');
const userController = require('./user.controller');
const contractorController = require('./contractor.controller');

module.exports = {
  ...authController,
  ...userController,
  ...contractorController
};