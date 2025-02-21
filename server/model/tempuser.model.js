// models/tempUser.model.js
const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uniqueId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '5m' }, // Auto-delete after 5 minutes
});

module.exports = mongoose.model('TempUser', tempUserSchema);