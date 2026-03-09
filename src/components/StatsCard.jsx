import React, { useMemo, useState, useEffect } from 'react';
import { calculateReadinessScore } from '../services/engine';
import mockWardsData from '../data/mockWards.json';
import { AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

const StatsCard = ({ rainfallIntensity }) => {
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
    <div className="absolute top-6 right-6 flex gap-4 z-10 pointer-events-none">
      <div className={`bg-gray-900/90 backdrop-blur-md p-5 rounded-2xl border pointer-events-auto backdrop-filter min-w-[320px] transition-all duration-500 ${
        stats.critical > 0 
          ? 'border-red-900/50 shadow-[0_0_25px_rgba(239,68,68,0.3)]' 
          : 'border-gray-700 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Info size={18} className="text-blue-400" />
            City Overview
          </h3>
          <span className="text-xs text-gray-500 flex items-center gap-1 font-medium bg-gray-800 px-2 py-1 rounded-md">
            <Clock size={12} className={stats.critical > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
            {lastUpdated}
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
              {stats.critical}
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
