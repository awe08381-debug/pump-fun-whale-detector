const axios = require('axios');

class PumpFunAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = process.env.PUMP_FUN_API_URL || 'https://api.pump.fun';
  }

  async getTrendingTokens(limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/trending`, {
        params: { limit },
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw error;
    }
  }

  async getTokenData(tokenAddress) {
    try {
      const response = await axios.get(`${this.baseURL}/token/${tokenAddress}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching token data:', error);
      throw error;
    }
  }

  async getWhaleActivities(timeframe = '1h', limit = 100) {
    try {
      const response = await axios.get(`${this.baseURL}/whales/activities`, {
        params: { timeframe, limit },
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching whale activities:', error);
      throw error;
    }
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }
}

module.exports = PumpFunAPI;
