const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get all trending tokens
router.get('/trending', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    
    // Fetch from Pump.fun API
    const response = await axios.get(`${process.env.PUMP_FUN_API_URL}/trending`, {
      params: { limit },
      headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` }
    });

    // Analyze tokens for whale activity
    const analyzedTokens = response.data.map(token => ({
      ...token,
      whaleScore: calculateWhaleScore(token),
      pumpRisk: calculatePumpRisk(token),
      dumpRisk: calculateDumpRisk(token)
    }));

    res.json({
      success: true,
      count: analyzedTokens.length,
      data: analyzedTokens
    });
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    res.status(500).json({ error: 'Failed to fetch trending tokens' });
  }
});

// Get token details with analysis
router.get('/:tokenAddress', async (req, res) => {
  try {
    const { tokenAddress } = req.params;
    
    const response = await axios.get(
      `${process.env.PUMP_FUN_API_URL}/token/${tokenAddress}`,
      { headers: { 'Authorization': `Bearer ${process.env.PUMP_FUN_API_KEY}` } }
    );

    const tokenData = response.data;

    res.json({
      success: true,
      data: {
        ...tokenData,
        analysis: {
          whaleScore: calculateWhaleScore(tokenData),
          pumpRisk: calculatePumpRisk(tokenData),
          dumpRisk: calculateDumpRisk(tokenData),
          liquidityAnalysis: analyzeLiquidity(tokenData),
          volumeAnalysis: analyzeVolume(tokenData),
          holderAnalysis: analyzeHolders(tokenData)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

// Calculate whale activity score (0-100)
function calculateWhaleScore(token) {
  const whaleThreshold = parseInt(process.env.WHALE_THRESHOLD || 1000000);
  const largeTransactions = token.largeTransactions || 0;
  const whaleHoldings = token.topHolderPercentage || 0;
  
  const score = Math.min(100, (largeTransactions * 5) + (whaleHoldings * 0.5));
  return Math.round(score);
}

// Calculate pump risk (0-100)
function calculatePumpRisk(token) {
  const volumeChange = (token.volume24hChange || 0);
  const priceChange = (token.priceChange24h || 0);
  const liquidityScore = (token.liquidity || 0) / 100000;
  
  let risk = 0;
  
  if (volumeChange > 300) risk += 30;
  else if (volumeChange > 100) risk += 20;
  
  if (priceChange > 100) risk += 30;
  else if (priceChange > 50) risk += 20;
  
  if (liquidityScore < 1) risk += 20;
  
  return Math.min(100, risk);
}

// Calculate dump risk (0-100)
function calculateDumpRisk(token) {
  const priceChange = (token.priceChange24h || 0);
  const holderConcentration = (token.topHolderPercentage || 0);
  const sellPressure = (token.sellVolume / token.totalVolume * 100) || 0;
  
  let risk = 0;
  
  if (priceChange > 200) risk += 30;
  if (holderConcentration > 50) risk += 35;
  if (sellPressure > 60) risk += 35;
  
  return Math.min(100, risk);
}

// Analyze liquidity metrics
function analyzeLiquidity(token) {
  return {
    totalLiquidity: token.liquidity || 0,
    liquidityRatio: (token.liquidity / token.marketCap * 100) || 0,
    isLiquidityLocked: token.isLiquidityLocked || false,
    liquidityTrend: token.liquidityChange24h || 0
  };
}

// Analyze volume metrics
function analyzeVolume(token) {
  return {
    volume24h: token.volume24h || 0,
    volumeChange: token.volume24hChange || 0,
    buyVolume: token.buyVolume || 0,
    sellVolume: token.sellVolume || 0,
    buyToSellRatio: ((token.buyVolume || 0) / (token.sellVolume || 1))
  };
}

// Analyze holder distribution
function analyzeHolders(token) {
  return {
    totalHolders: token.holderCount || 0,
    topHolderPercentage: token.topHolderPercentage || 0,
    top10Percentage: token.top10HolderPercentage || 0,
    holderConcentration: calculateConcentration(token),
    isHighRiskConcentration: (token.topHolderPercentage || 0) > 40
  };
}

// Calculate holder concentration risk
function calculateConcentration(token) {
  const top1 = token.topHolderPercentage || 0;
  const top10 = token.top10HolderPercentage || 0;
  
  return {
    score: Math.max(top1, top10),
    level: top1 > 50 ? 'CRITICAL' : top1 > 40 ? 'HIGH' : top10 > 60 ? 'MEDIUM' : 'LOW'
  };
}

module.exports = router;
