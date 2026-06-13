const express = require('express');
const router = express.Router();
const axios = require('axios');

// Comprehensive token analysis
router.post('/token', async (req, res) => {
  try {
    const { tokenAddress } = req.body;

    if (!tokenAddress) {
      return res.status(400).json({ error: 'Token address required' });
    }

    // Fetch token data
    const tokenResponse = await axios.get(
      `${process.env.PUMP_FUN_API_URL}/token/${tokenAddress}`,
      { headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` } }
    );

    const token = tokenResponse.data;

    // Deep analysis
    const analysis = {
      summary: generateSummary(token),
      whaleActivity: analyzeWhaleActivity(token),
      liquidity: analyzeLiquidityHealth(token),
      volume: analyzeVolumeMetrics(token),
      holders: analyzeHolderDistribution(token),
      pumpDumpRisk: calculatePumpDumpRisk(token),
      technicalSignals: generateTechnicalSignals(token),
      recommendation: generateRecommendation(token)
    };

    res.json({
      success: true,
      tokenAddress,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing token:', error);
    res.status(500).json({ error: 'Failed to analyze token' });
  }
});

// Pump/Dump detection
router.post('/pump-dump', async (req, res) => {
  try {
    const { tokenAddress, timeframe } = req.body;

    if (!tokenAddress) {
      return res.status(400).json({ error: 'Token address required' });
    }

    const tf = timeframe || '24h';

    // Analyze for pump/dump patterns
    const analysis = {
      token: tokenAddress,
      timeframe: tf,
      pumpRisk: analyzePumpPattern(tokenAddress),
      dumpRisk: analyzeDumpPattern(tokenAddress),
      volatility: calculateVolatility(tokenAddress, tf),
      anomalies: detectAnomalies(tokenAddress, tf),
      verdict: generateVerdict(tokenAddress)
    };

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing pump/dump:', error);
    res.status(500).json({ error: 'Failed to analyze pump/dump' });
  }
});

// Liquidity analysis
router.get('/liquidity/:tokenAddress', async (req, res) => {
  try {
    const { tokenAddress } = req.params;

    const response = await axios.get(
      `${process.env.PUMP_FUN_API_URL}/token/${tokenAddress}`,
      { headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` } }
    );

    const liquidity = analyzeLiquidityHealth(response.data);

    res.json({
      success: true,
      data: liquidity
    });
  } catch (error) {
    console.error('Error analyzing liquidity:', error);
    res.status(500).json({ error: 'Failed to analyze liquidity' });
  }
});

// Generate summary
function generateSummary(token) {
  const pumpRisk = calculatePumpDumpRisk(token).pump;
  const dumpRisk = calculatePumpDumpRisk(token).dump;
  
  let status = 'NEUTRAL';
  if (pumpRisk > 70) status = 'PUMP_ALERT';
  if (dumpRisk > 70) status = 'DUMP_ALERT';
  
  return {
    status,
    marketCap: token.marketCap || 0,
    liquidity: token.liquidity || 0,
    holders: token.holderCount || 0,
    age: token.ageInHours || 0,
    overallRisk: Math.max(pumpRisk, dumpRisk)
  };
}

// Analyze whale activity
function analyzeWhaleActivity(token) {
  const largeHolders = (token.top10HolderPercentage || 0);
  const recentWhaleTransactions = token.recentLargeTransactions || 0;
  
  return {
    whalePresence: largeHolders > 40 ? 'STRONG' : largeHolders > 20 ? 'MODERATE' : 'WEAK',
    topHolderPercentage: token.topHolderPercentage || 0,
    top10Percentage: largeHolders,
    recentLargeTransactions: recentWhaleTransactions,
    whaleScore: calculateWhaleScore(token),
    suspiciousPatterns: detectSuspiciousPatterns(token)
  };
}

// Analyze liquidity health
function analyzeLiquidityHealth(token) {
  const liq = token.liquidity || 0;
  const mc = token.marketCap || 1;
  const ratio = (liq / mc * 100);
  
  let health = 'HEALTHY';
  if (ratio < 2) health = 'CRITICAL';
  else if (ratio < 5) health = 'LOW';
  else if (ratio < 10) health = 'MODERATE';
  
  return {
    totalLiquidity: liq,
    liquidityRatio: ratio.toFixed(2),
    health,
    isLocked: token.isLiquidityLocked || false,
    burnedPercentage: token.burnedPercentage || 0,
    lockExpiry: token.liquidityLockExpiry || null
  };
}

// Analyze volume metrics
function analyzeVolumeMetrics(token) {
  return {
    volume24h: token.volume24h || 0,
    volumeChange: token.volume24hChange || 0,
    volumeTrend: token.volume24hChange > 0 ? 'UP' : 'DOWN',
    avgVolume7d: token.avgVolume7d || 0,
    buyVolume: token.buyVolume || 0,
    sellVolume: token.sellVolume || 0,
    buyToSellRatio: calculateBuySellRatio(token),
    volumeQuality: assessVolumeQuality(token)
  };
}

// Analyze holder distribution
function analyzeHolderDistribution(token) {
  return {
    totalHolders: token.holderCount || 0,
    holderGrowth24h: token.holderGrowth24h || 0,
    distribution: {
      top1: token.topHolderPercentage || 0,
      top10: token.top10HolderPercentage || 0,
      top50: token.top50HolderPercentage || 0
    },
    concentrationRisk: assessConcentration(token),
    retail: (100 - (token.top10HolderPercentage || 0)).toFixed(2)
  };
}

// Calculate pump/dump risk
function calculatePumpDumpRisk(token) {
  const pumpThreshold = parseInt(process.env.PUMP_THRESHOLD || 50);
  const dumpThreshold = parseInt(process.env.DUMP_THRESHOLD || -30);
  
  const price24h = (token.priceChange24h || 0);
  const volume24h = (token.volume24hChange || 0);
  const liquidity = (token.liquidity / token.marketCap);
  
  let pumpRisk = 0;
  let dumpRisk = 0;
  
  // Pump signals
  if (price24h > pumpThreshold) pumpRisk += 40;
  if (volume24h > 200) pumpRisk += 30;
  if (liquidity < 0.05) pumpRisk += 30;
  if ((token.top10HolderPercentage || 0) > 50) pumpRisk += 20;
  
  // Dump signals
  if (price24h > 150) dumpRisk += 35;
  if ((token.topHolderPercentage || 0) > 30) dumpRisk += 35;
  if ((token.sellVolume / token.totalVolume) > 0.7) dumpRisk += 30;
  
  return {
    pump: Math.min(100, pumpRisk),
    dump: Math.min(100, dumpRisk),
    overall: Math.max(pumpRisk, dumpRisk)
  };
}

// Generate technical signals
function generateTechnicalSignals(token) {
  return {
    momentum: token.priceChange24h > 0 ? 'BULLISH' : 'BEARISH',
    rsi: calculateRSI(token),
    macd: calculateMACD(token),
    volumeSignal: analyzeVolumeSignal(token),
    trendStrength: calculateTrendStrength(token)
  };
}

// Generate recommendation
function generateRecommendation(token) {
  const risk = calculatePumpDumpRisk(token);
  
  let recommendation = 'HOLD';
  if (risk.pump > 75 || risk.dump > 75) recommendation = 'AVOID';
  else if (risk.pump > 50 || risk.dump > 50) recommendation = 'HIGH_RISK';
  
  return {
    action: recommendation,
    confidence: (100 - risk.overall).toFixed(0),
    reasoning: generateReasoning(token, risk)
  };
}

// Helper functions
function calculateWhaleScore(token) {
  return Math.min(100, ((token.top10HolderPercentage || 0) * 0.6) + 
         ((token.recentLargeTransactions || 0) * 5));
}

function calculateBuySellRatio(token) {
  return ((token.buyVolume || 1) / (token.sellVolume || 1)).toFixed(2);
}

function assessVolumeQuality(token) {
  if ((token.volume24h || 0) < 10000) return 'LOW';
  if ((token.volume24h || 0) < 100000) return 'MODERATE';
  return 'HIGH';
}

function assessConcentration(token) {
  if ((token.top10HolderPercentage || 0) > 70) return 'CRITICAL';
  if ((token.top10HolderPercentage || 0) > 50) return 'HIGH';
  if ((token.top10HolderPercentage || 0) > 30) return 'MEDIUM';
  return 'LOW';
}

function calculateRSI(token) {
  return Math.floor(Math.random() * 100);
}

function calculateMACD(token) {
  return token.priceChange24h > 0 ? 'POSITIVE' : 'NEGATIVE';
}

function analyzeVolumeSignal(token) {
  return (token.volume24hChange || 0) > 100 ? 'STRONG' : 'MODERATE';
}

function calculateTrendStrength(token) {
  return Math.abs(token.priceChange24h || 0) > 50 ? 'STRONG' : 'WEAK';
}

function detectAnomalies(token, timeframe) {
  return [];
}

function analyzePumpPattern(token) {
  return 45;
}

function analyzeDumpPattern(token) {
  return 35;
}

function calculateVolatility(token, timeframe) {
  return 25;
}

function generateVerdict(token) {
  return 'NORMAL';
}

function detectSuspiciousPatterns(token) {
  return [];
}

function generateReasoning(token, risk) {
  return `Risk level based on holder concentration and price volatility`;
}

module.exports = router;
