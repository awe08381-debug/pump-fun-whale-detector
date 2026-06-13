const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  tokenAddress: String,
  tokenName: String,
  alertType: String,
  severity: String,
  message: String,
  data: Object,
  userId: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }
});

module.exports = mongoose.model('Alert', alertSchema);
