const express = require('express');
const router = express.Router();

// Get active alerts
router.get('/', async (req, res) => {
  try {
    const severity = req.query.severity || 'all'; // all, critical, high, medium, low
    const limit = req.query.limit || 50;

    // Mock data for now
    const alerts = generateMockAlerts(limit, severity);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Get alerts for specific token
router.get('/token/:tokenAddress', async (req, res) => {
  try {
    const { tokenAddress } = req.params;
    const limit = req.query.limit || 20;

    // Mock data
    const alerts = generateTokenAlerts(tokenAddress, limit);

    res.json({
      success: true,
      token: tokenAddress,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching token alerts:', error);
    res.status(500).json({ error: 'Failed to fetch token alerts' });
  }
});

// Create custom alert
router.post('/', async (req, res) => {
  try {
    const {
      tokenAddress,
      alertType,
      threshold,
      condition,
      notificationEmail
    } = req.body;

    if (!tokenAddress || !alertType || !condition) {
      return res.status(400).json({
        error: 'Missing required fields: tokenAddress, alertType, condition'
      });
    }

    const alert = {
      id: `alert_${Date.now()}`,
      tokenAddress,
      alertType,
      threshold,
      condition,
      notificationEmail,
      createdAt: new Date(),
      isActive: true
    };

    res.json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Update alert
router.patch('/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const updates = req.body;

    res.json({
      success: true,
      message: 'Alert updated successfully',
      data: { id: alertId, ...updates }
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Delete alert
router.delete('/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;

    res.json({
      success: true,
      message: 'Alert deleted successfully',
      deletedId: alertId
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// Mock alert generator
function generateMockAlerts(limit, severity) {
  const severities = severity === 'all' 
    ? ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    : [severity.toUpperCase()];

  const alerts = [];
  const alertTypes = ['PUMP_DETECTED', 'DUMP_DETECTED', 'WHALE_ACTIVITY', 'LIQUIDITY_DROP', 'VOLUME_SPIKE'];

  for (let i = 0; i < Math.min(limit, 20); i++) {
    alerts.push({
      id: `alert_${i}`,
      tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenName: `Token_${i}`,
      alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: `Alert message for token ${i}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      data: {
        currentPrice: (Math.random() * 1000).toFixed(2),
        priceChange: ((Math.random() - 0.5) * 100).toFixed(2),
        volume24h: (Math.random() * 10000000).toFixed(0),
        whaleCount: Math.floor(Math.random() * 10)
      }
    });
  }

  return alerts;
}

// Token-specific alerts
function generateTokenAlerts(tokenAddress, limit) {
  const alerts = [];

  for (let i = 0; i < Math.min(limit, 10); i++) {
    alerts.push({
      id: `token_alert_${i}`,
      tokenAddress,
      alertType: ['PUMP_DETECTED', 'WHALE_ACTIVITY', 'VOLUME_SPIKE'][i % 3],
      severity: ['CRITICAL', 'HIGH', 'MEDIUM'][i % 3],
      message: `Alert for ${tokenAddress}`,
      timestamp: new Date(Date.now() - i * 3600000),
      value: (Math.random() * 100).toFixed(2)
    });
  }

  return alerts;
}

module.exports = router;
