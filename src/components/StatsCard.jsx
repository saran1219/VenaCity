import React, { useMemo, useState, useEffect } from 'react';
import { calculateReadinessScore } from '../services/engine';
import mockWardsData from '../data/mockWards.json';
import { AlertTriangle, CheckCircle, Info, Clock, AlertCircle, Loader2 } from 'lucide-react';

const StatsCard = ({ rainfallIntensity, riskAssets = [], onOpenAssets }) => {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Simulate real-time data polling update
    const updateTime = () => setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    let critical = 0;
    let warning = 0;
    let safe = 0;
    let totalScore = 0;

    mockWardsData.features.forEach(feature => {
      const score = calculateReadinessScore(feature.properties, rainfallIntensity);
      totalScore += score;
      if (score < 40) critical++;
      else if (score <= 70) warning++;
      else safe++;
    });

    const averageScore = Math.round(totalScore / mockWardsData.features.length) || 0;

    return { critical, warning, safe, averageScore };
  }, [rainfallIntensity]);

  return (
    <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-50 pointer-events-none">
      {/* High-Visibility Asset Button */}
      <button 
        onClick={(e) => onOpenAssets && onOpenAssets(e)}
        className={`pointer-events-auto group flex items-center gap-3 px-6 py-3 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl hover:border-blue-500/50 hover:bg-gray-900 transition-all duration-300 ${
          riskAssets.length > 0 ? 'animate-pulse ring-2 ring-blue-500/20' : ''
        }`}
      >
        <div className="relative">
          <AlertCircle size={20} className={riskAssets.length > 0 ? "text-red-400 animate-pulse" : "text-blue-400"} />
          {riskAssets.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
        <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
          View Critical Assets <span className="ml-1 px-2 py-0.5 bg-gray-800 rounded-lg text-xs font-black">{riskAssets.length}</span>
        </span>
      </button>

      <div className={`backdrop-blur-md p-5 rounded-2xl border pointer-events-auto backdrop-filter min-w-[320px] transition-all duration-500 glass-panel ${
        stats.critical > 0 
          ? 'border-red-900/50 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-neon-pulse-red' 
          : 'border-gray-700 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Info size={18} className="text-blue-400" />
            City Overview
          </h3>
          <span className="text-xs text-gray-400 flex items-center gap-2 font-medium bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/30">
            <Loader2 size={12} className="text-blue-400 animate-spin-slow" />
            <span className="text-gray-500">{lastUpdated}</span>
          </span>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-gray-800 rounded-xl p-3 border border-gray-700 flex flex-col items-center justify-center shadow-inner">
            <span className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Avg Score</span>
            <span className={`text-3xl font-black ${
              stats.averageScore >= 70 ? 'text-brand-green' : 
              stats.averageScore >= 40 ? 'text-brand-yellow' : 'text-brand-red'
            }`}>
              {stats.averageScore}
            </span>
          </div>
          
          <div className="flex-1 bg-red-900/20 rounded-xl p-3 border border-red-900/50 flex flex-col items-center justify-center shadow-inner">
            <span className="text-red-400/80 text-xs font-semibold mb-1 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle size={12} /> Critical
            </span>
            <span className="text-3xl font-black text-red-500">
              {riskAssets.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Total Wards</span>
            <span className="text-white font-medium">{mockWardsData.features.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Wards at Risk</span>
            <span className="text-brand-yellow font-medium">{stats.warning}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Safe Wards</span>
            <span className="text-brand-green font-medium flex items-center gap-1">
              {stats.safe} <CheckCircle size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
