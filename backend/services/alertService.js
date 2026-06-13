class AlertService {
  constructor(db) {
    this.db = db;
  }

  async createAlert(alertData) {
    return this.db.Alert.create(alertData);
  }

  async getAlerts(query = {}) {
    return this.db.Alert.find(query).sort({ createdAt: -1 }).limit(100);
  }

  async markAsRead(alertId) {
    return this.db.Alert.findByIdAndUpdate(alertId, { read: true });
  }

  async deleteAlert(alertId) {
    return this.db.Alert.findByIdAndDelete(alertId);
  }

  async checkAndCreateAlerts(tokenData) {
    const alerts = [];

    // Check for pump signal
    if (tokenData.pumpRisk > 70) {
      alerts.push({
        tokenAddress: tokenData.address,
        tokenName: tokenData.name,
        alertType: 'PUMP_DETECTED',
        severity: 'CRITICAL',
        message: `⚠️ Pump signal detected for ${tokenData.name}!`,
        data: tokenData
      });
    }

    // Check for dump signal
    if (tokenData.dumpRisk > 70) {
      alerts.push({
        tokenAddress: tokenData.address,
        tokenName: tokenData.name,
        alertType: 'DUMP_DETECTED',
        severity: 'CRITICAL',
        message: `⚠️ Dump signal detected for ${tokenData.name}!`,
        data: tokenData
      });
    }

    // Check for whale activity
    if (tokenData.whaleScore > 80) {
      alerts.push({
        tokenAddress: tokenData.address,
        tokenName: tokenData.name,
        alertType: 'WHALE_ACTIVITY',
        severity: 'HIGH',
        message: `🐋 High whale activity for ${tokenData.name}`,
        data: tokenData
      });
    }

    return alerts;
  }
}

module.exports = AlertService;
