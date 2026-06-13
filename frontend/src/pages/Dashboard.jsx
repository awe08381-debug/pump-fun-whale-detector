import React, { useState, useEffect } from 'react';
import TokenCard from '../components/TokenCard';
import axios from 'axios';

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTrendingTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tokens/trending?limit=20');
      setTokens(response.data.data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token => {
    if (filter === 'high-risk') return (token.analysis?.pumpRisk || 0) > 70;
    if (filter === 'low-risk') return (token.analysis?.pumpRisk || 0) < 30;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-emerald-400">📊 داشبورد تحلیل رمزارز</h1>
      
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-emerald-500' : 'bg-slate-700'}`}
        >
          همه
        </button>
        <button
          onClick={() => setFilter('high-risk')}
          className={`px-4 py-2 rounded ${filter === 'high-risk' ? 'bg-red-500' : 'bg-slate-700'}`}
        >
          خطر بالا
        </button>
        <button
          onClick={() => setFilter('low-risk')}
          className={`px-4 py-2 rounded ${filter === 'low-risk' ? 'bg-green-500' : 'bg-slate-700'}`}
        >
          خطر پایین
        </button>
      </div>

      {/* Tokens Grid */}
      {loading ? (
        <div className="text-center text-2xl">در حال بارگیری...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token, index) => (
            <TokenCard key={index} token={token} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
