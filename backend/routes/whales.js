const express = require('express');
const router = express.Router();
const axios = require('axios');

// Detect whale activities
router.get('/activities', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '1h'; // 1h, 24h, 7d
    const limit = req.query.limit || 100;

    // Fetch whale transactions
    const response = await axios.get(
      `${process.env.PUMP_FUN_API_URL}/whales/activities`,
      {
        params: { timeframe, limit },
        headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` }
      }
    );

    const whaleActivities = response.data.map(activity => ({
      ...activity,
      severity: calculateSeverity(activity),
      predictedImpact: predictMarketImpact(activity),
      alertLevel: getAlertLevel(activity)
    }));

    res.json({
      success: true,
      timeframe,
      count: whaleActivities.length,
      data: whaleActivities
    });
  } catch (error) {
    console.error('Error fetching whale activities:', error);
    res.status(500).json({ error: 'Failed to fetch whale activities' });
  }
});

// Get whale addresses
router.get('/addresses', async (req, res) => {
  try {
    const limit = req.query.limit || 50;

    const response = await axios.get(
      `${process.env.PUMP_FUN_API_URL}/whales/addresses`,
      {
        params: { limit },
        headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` }
      }
    );

    const whaleAddresses = response.data.map(whale => ({
      ...whale,
      trustScore: calculateTrustScore(whale),
      profitability: calculateProfitability(whale),
      pattern: analyzePattern(whale)
    }));

    res.json({
      success: true,
      count: whaleAddresses.length,
      data: whaleAddresses
    });
  } catch (error) {
    console.error('Error fetching whale addresses:', error);
    res.status(500).json({ error: 'Failed to fetch whale addresses' });
  }
});

// Track specific whale address
router.get('/:whaleAddress', async (req, res) => {
  try {
    const { whaleAddress } = req.params;

    const response = await axios.get(
      `${process.env.PUMP_FUN_API_URL}/whales/${whaleAddress}`,
      { headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` } }
    );

    const whaleData = response.data;

    res.json({
      success: true,
      data: {
        address: whaleAddress,
        ...whaleData,
        analysis: {
          trustScore: calculateTrustScore(whaleData),
          profitability: calculateProfitability(whaleData),
          tradingPattern: analyzePattern(whaleData),
          riskProfile: assessRiskProfile(whaleData),
          predictedNextMove: predictNextMove(whaleData),
          historicalPerformance: whaleData.trades || []
        }
      }
    });
  } catch (error) {
    console.error('Error fetching whale data:', error);
    res.status(500).json({ error: 'Failed to fetch whale data' });
  }
});

// Calculate severity of whale activity
function calculateSeverity(activity) {
  let severity = 0;
  
  // Volume impact
  if (activity.volume > 1000000) severity += 40;
  else if (activity.volume > 500000) severity += 30;
  else if (activity.volume > 100000) severity += 20;
  
  // Price impact
  if (activity.priceImpact > 10) severity += 35;
  else if (activity.priceImpact > 5) severity += 25;
  else if (activity.priceImpact > 2) severity += 15;
  
  // Liquidity ratio
  if (activity.liquidityRatio < 0.05) severity += 25;
  else if (activity.liquidityRatio < 0.1) severity += 15;
  
  return Math.min(100, severity);
}

// Predict market impact
function predictMarketImpact(activity) {
  const baseImpact = activity.priceImpact || 0;
  const volumeMultiplier = (activity.volume / 100000);
  const liquidityImpact = 1 / (activity.liquidityRatio || 1);
  
  const predictedChange = baseImpact * volumeMultiplier * liquidityImpact;
  
  return {
    predictedPriceChange: predictedChange.toFixed(2),
    direction: activity.type === 'BUY' ? 'BULLISH' : 'BEARISH',
    confidence: Math.min(95, Math.abs(predictedChange) * 10)
  };
}

// Get alert level
function getAlertLevel(activity) {
  const severity = calculateSeverity(activity);
  
  if (severity > 80) return 'CRITICAL';
  if (severity > 60) return 'HIGH';
  if (severity > 40) return 'MEDIUM';
  if (severity > 20) return 'LOW';
  return 'INFO';
}

// Calculate trust score for whale
function calculateTrustScore(whale) {
  let score = 50; // Base score
  
  // Win rate
  const winRate = (whale.successfulTrades / (whale.totalTrades || 1)) * 100;
  score += Math.min(30, winRate / 3);
  
  // Profit factor
  if (whale.profitFactor > 2) score += 15;
  else if (whale.profitFactor > 1.5) score += 10;
  
  // Trading history
  if (whale.daysSinceFirstTrade > 365) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

// Calculate whale profitability
function calculateProfitability(whale) {
  return {
    totalProfit: whale.totalProfit || 0,
    profitFactor: whale.profitFactor || 0,
    averageRoi: whale.averageRoi || 0,
    winRate: ((whale.successfulTrades / (whale.totalTrades || 1)) * 100).toFixed(2),
    losingRate: ((whale.failedTrades / (whale.totalTrades || 1)) * 100).toFixed(2)
  };
}

// Analyze trading pattern
function analyzePattern(whale) {
  return {
    tradingStyle: whale.averageHoldTime > 7 ? 'LONG_TERM' : whale.averageHoldTime > 1 ? 'SWING' : 'DAY_TRADER',
    frequency: whale.tradesPerDay,
    averageHoldTime: whale.averageHoldTime || 0,
    preferredTokens: whale.mostTradedTokens || [],
    correlatedWhales: whale.correlatedAddresses || []
  };
}

// Assess whale risk profile
function assessRiskProfile(whale) {
  const volatility = whale.portfolioVolatility || 0;
  const concentration = whale.topAssetPercentage || 0;
  
  let riskLevel = 'MEDIUM';
  
  if (volatility > 50 || concentration > 60) riskLevel = 'HIGH';
  if (volatility < 20 && concentration < 30) riskLevel = 'LOW';
  
  return {
    level: riskLevel,
    volatility: volatility.toFixed(2),
    concentration: concentration.toFixed(2),
    portfolio: whale.portfolio || []
  };
}

// Predict next move
function predictNextMove(whale) {
  const recentTrades = whale.trades ? whale.trades.slice(-5) : [];
  const pattern = analyzePattern(whale);
  
  let prediction = 'NEUTRAL';
  
  if (recentTrades.length > 0) {
    const recentBuys = recentTrades.filter(t => t.type === 'BUY').length;
    if (recentBuys > 3) prediction = 'LIKELY_BUY';
    else if (recentBuys === 0) prediction = 'LIKELY_SELL';
  }
  
  return {
    prediction,
    confidence: 45 + Math.random() * 40,
    timeframe: '24h',
    reasoning: `Based on ${pattern.tradingStyle} pattern with ${pattern.frequency} trades per day`
  };
}

module.exports = router;
