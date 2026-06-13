import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhaleTracker = () => {
  const [whales, setWhales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhales();
  }, []);

  const fetchWhales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/whales/addresses?limit=20');
      setWhales(response.data.data);
    } catch (error) {
      console.error('Error fetching whales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">🐋 ردیابی نهنگ‌ها</h1>
      
      {loading ? (
        <div className="text-center text-2xl">در حال بارگیری...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-right">آدرس نهنگ</th>
                <th className="px-6 py-4 text-right">تعداد معاملات</th>
                <th className="px-6 py-4 text-right">نرخ برد</th>
                <th className="px-6 py-4 text-right">سود کل</th>
                <th className="px-6 py-4 text-right">Trust Score</th>
              </tr>
            </thead>
            <tbody>
              {whales.map((whale, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700 cursor-pointer transition">
                  <td className="px-6 py-4 font-mono text-sm">{whale.address?.substring(0, 10)}...</td>
                  <td className="px-6 py-4">{whale.totalTrades || 0}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-500 font-bold">
                      {((whale.successfulTrades / (whale.totalTrades || 1)) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={whale.totalProfit > 0 ? 'text-green-500' : 'text-red-500'}>
                      ${whale.totalProfit?.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-bold">{whale.trustScore?.toFixed(0)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WhaleTracker;
