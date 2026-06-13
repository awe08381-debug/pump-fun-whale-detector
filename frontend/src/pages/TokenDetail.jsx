import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const TokenDetail = () => {
  const { address } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenDetail();
  }, [address]);

  const fetchTokenDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tokens/${address}`);
      setToken(response.data.data);
    } catch (error) {
      console.error('Error fetching token detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">در حال بارگیری...</div>;
  if (!token) return <div className="text-center p-6">توکن یافت نشد</div>;

  const analysis = token.analysis || {};

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{token.name} ({token.symbol})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Basic Info */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-400">اطلاعات پایه</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>قیمت:</span>
              <span className="font-bold">${token.price?.toFixed(8)}</span>
            </div>
            <div className="flex justify-between">
              <span>Market Cap:</span>
              <span className="font-bold">${(token.marketCap / 1e6).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span>نقدینگی:</span>
              <span className="font-bold">${(token.liquidity / 1e6).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span>حجم 24h:</span>
              <span className="font-bold">${(token.volume24h / 1e6).toFixed(2)}M</span>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-400">تحلیل ریسک</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span>Pump Risk:</span>
                <span className="font-bold text-red-500">{analysis.pumpRisk}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded h-2">
                <div className="bg-red-500 h-2 rounded" style={{width: `${analysis.pumpRisk}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Dump Risk:</span>
                <span className="font-bold text-orange-500">{analysis.dumpRisk}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded h-2">
                <div className="bg-orange-500 h-2 rounded" style={{width: `${analysis.dumpRisk}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Whale Score:</span>
                <span className="font-bold text-yellow-500">{analysis.whaleScore}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded h-2">
                <div className="bg-yellow-500 h-2 rounded" style={{width: `${analysis.whaleScore}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holder Distribution */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-emerald-400">توزیع نگه‌دارندگان</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded p-4 text-center">
            <div className="text-sm text-slate-400">کل نگه‌دارندگان</div>
            <div className="text-2xl font-bold">{analysis.holderAnalysis?.totalHolders || 0}</div>
          </div>
          <div className="bg-slate-700 rounded p-4 text-center">
            <div className="text-sm text-slate-400">صاحب اول</div>
            <div className="text-2xl font-bold">{analysis.holderAnalysis?.distribution?.top1?.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-700 rounded p-4 text-center">
            <div className="text-sm text-slate-400">10 صاحب اول</div>
            <div className="text-2xl font-bold">{analysis.holderAnalysis?.distribution?.top10?.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-700 rounded p-4 text-center">
            <div className="text-sm text-slate-400">ریسک تمرکز</div>
            <div className="text-2xl font-bold" style={{color: analysis.holderAnalysis?.isHighRiskConcentration ? '#ef4444' : '#10b981'}}>
              {analysis.holderAnalysis?.isHighRiskConcentration ? 'بالا' : 'پایین'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
