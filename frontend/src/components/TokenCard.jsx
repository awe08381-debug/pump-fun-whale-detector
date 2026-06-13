import React from 'react';
import { Link } from 'react-router-dom';

const TokenCard = ({ token }) => {
  const pumpRisk = token.analysis?.pumpRisk || 0;
  const dumpRisk = token.analysis?.dumpRisk || 0;
  const whaleScore = token.analysis?.whaleScore || 0;

  const getRiskColor = (risk) => {
    if (risk > 70) return 'text-red-500';
    if (risk > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Link to={`/token/${token.address}`}>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 cursor-pointer transition">
        <h3 className="text-xl font-bold mb-2">{token.name} ({token.symbol})</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">قیمت:</span>
            <span className="font-bold">${token.price?.toFixed(6)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">تغییر 24h:</span>
            <span className={token.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}>
              {token.priceChange24h?.toFixed(2)}%
            </span>
          </div>

          <div className="border-t border-slate-700 pt-3 mt-3">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">ریسک Pump:</span>
              <span className={getRiskColor(pumpRisk)}>{pumpRisk}%</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">ریسک Dump:</span>
              <span className={getRiskColor(dumpRisk)}>{dumpRisk}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">نهنگ Score:</span>
              <span className="text-emerald-400">{whaleScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TokenCard;
