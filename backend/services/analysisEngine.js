class AnalysisEngine {
  constructor() {
    this.pumpThreshold = parseInt(process.env.PUMP_THRESHOLD || 50);
    this.dumpThreshold = parseInt(process.env.DUMP_THRESHOLD || -30);
    this.whaleThreshold = parseInt(process.env.WHALE_THRESHOLD || 1000000);
  }

  analyzePumpRisk(tokenData) {
    let risk = 0;
    const { volume24hChange, priceChange24h, liquidity, marketCap } = tokenData;

    // Volume surge indicator
    if (volume24hChange > 300) risk += 30;
    else if (volume24hChange > 150) risk += 20;
    else if (volume24hChange > 75) risk += 10;

    // Price surge indicator
    if (priceChange24h > 100) risk += 30;
    else if (priceChange24h > 50) risk += 20;
    else if (priceChange24h > 25) risk += 10;

    // Liquidity risk
    const liquidityRatio = liquidity / marketCap;
    if (liquidityRatio < 0.02) risk += 25;
    else if (liquidityRatio < 0.05) risk += 15;
    else if (liquidityRatio < 0.1) risk += 5;

    return Math.min(100, risk);
  }

  analyzeDumpRisk(tokenData) {
    let risk = 0;
    const { topHolderPercentage, priceChange24h, sellVolume, totalVolume } = tokenData;

    // Whale concentration
    if (topHolderPercentage > 50) risk += 35;
    else if (topHolderPercentage > 40) risk += 25;
    else if (topHolderPercentage > 30) risk += 15;

    // Recent pump (dump indicator)
    if (priceChange24h > 200) risk += 30;
    else if (priceChange24h > 100) risk += 20;

    // Sell pressure
    const sellRatio = sellVolume / totalVolume * 100;
    if (sellRatio > 60) risk += 35;
    else if (sellRatio > 50) risk += 20;

    return Math.min(100, risk);
  }

  analyzeWhaleActivity(tokenData) {
    let score = 0;
    const { top10HolderPercentage, largeTransactions, topHolderPercentage } = tokenData;

    // Holder concentration
    score += Math.min(50, (top10HolderPercentage / 100) * 50);

    // Large transactions
    score += Math.min(30, (largeTransactions || 0) * 5);

    // Single whale dominance
    if (topHolderPercentage > 40) score += 20;

    return Math.min(100, score);
  }

  detectPatternsAndAnomalies(historicalData) {
    const patterns = [];
    const anomalies = [];

    // Pattern detection logic
    if (historicalData.length > 5) {
      const recentVolumes = historicalData.slice(-5).map(d => d.volume);
      const avgVolume = recentVolumes.reduce((a, b) => a + b) / recentVolumes.length;

      // Volume spike detection
      if (recentVolumes[recentVolumes.length - 1] > avgVolume * 3) {
        anomalies.push({
          type: 'VOLUME_SPIKE',
          severity: 'HIGH',
          value: recentVolumes[recentVolumes.length - 1] / avgVolume
        });
      }
    }

    return { patterns, anomalies };
  }
}

module.exports = AnalysisEngine;
