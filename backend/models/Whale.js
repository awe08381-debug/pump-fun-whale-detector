const mongoose = require('mongoose');

const whaleSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  totalTrades: Number,
  successfulTrades: Number,
  failedTrades: Number,
  totalProfit: Number,
  profitFactor: Number,
  winRate: Number,
  trustScore: Number,
  averageHoldTime: Number,
  tradesPerDay: Number,
  portfolio: Array,
  trades: Array,
  pattern: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Whale', whaleSchema);
