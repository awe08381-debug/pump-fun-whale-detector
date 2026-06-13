import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [severity]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/alerts?severity=${severity}&limit=50`);
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-red-400">⚠️ هشدارها</h1>
      
      <div className="flex gap-4 mb-6">
        {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverity(sev)}
            className={`px-4 py-2 rounded ${
              severity === sev ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            {sev === 'all' ? 'همه' : sev}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-2xl">در حال بارگیری...</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-4 border-l-4" style={{borderColor: alert.severity === 'CRITICAL' ? '#ef4444' : alert.severity === 'HIGH' ? '#f97316' : '#eab308'}}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{alert.tokenName}</h3>
                  <p className="text-slate-400 mb-2">{alert.message}</p>
                  <div className="flex gap-4 text-sm">
                    <span>💰 {alert.data?.currentPrice}</span>
                    <span>📊 {alert.data?.volume24h}</span>
                    <span>🐋 {alert.data?.whaleCount}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-white font-bold ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
