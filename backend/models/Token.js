const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  liquidity: Number,
  volume24h: Number,
  holderCount: Number,
  topHolderPercentage: Number,
  top10HolderPercentage: Number,
  priceChange24h: Number,
  volume24hChange: Number,
  analysis: {
    whaleScore: Number,
    pumpRisk: Number,
    dumpRisk: Number
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);
