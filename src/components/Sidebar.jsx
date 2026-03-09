import React, { useState } from 'react';
import { CloudRain, Droplets, MapPin, Gauge, Settings, User, Moon, LogOut, CheckCircle2 } from 'lucide-react';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { calculateReadinessScore } from '../services/engine';
import mockWardsData from '../data/mockWards.json';

const Sidebar = ({ rainfallIntensity, setRainfallIntensity }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // Handle logout errors silently for production
    }
  };

  const handleDeploy = () => {
    // Calculate critical wards locally
    let criticalCount = 0;
    mockWardsData.features.forEach(feature => {
      const score = calculateReadinessScore(feature.properties, rainfallIntensity);
      if (score < 40) criticalCount++;
    });

    if (criticalCount === 0) {
      // Toast notification
      setNotification('System Stable: No emergency deployment required.');
      setTimeout(() => setNotification(''), 3000);
    } else {
      // Professional Modal / Alert
      window.alert(`CRITICAL ALERT: ${criticalCount} wards in danger.\n\nEmergency Protocol Initiated: Connecting to Ward Officers... (Demo)`);
    }
  };

  return (
    <div className="hidden md:flex w-80 bg-gray-900 border-r border-gray-800 text-white p-6 shadow-2xl flex-col h-full z-10 shrink-0 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-gray-800 border border-emerald-500/50 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 size={20} className="text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header & Settings Icon */}
      <div className="flex justify-between items-start mb-8 relative">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Droplets className="text-blue-400" />
            VenaCity
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Urban Flooding & Hydrology Engine</p>
        </div>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-700 focus:outline-none"
        >
          <Settings size={20} />
        </button>

        {/* Settings Dropdown */}
        {showSettings && (
          <div className="absolute right-0 top-12 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-700/50 mb-1">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Signed in as</p>
              <p className="text-sm text-gray-300 font-medium truncate flex items-center gap-2">
                <User size={14} className="text-blue-400 shrink-0"/>
                yuvarajyuvi0126@gmail.com
              </p>
            </div>
            
            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white flex items-center gap-3 transition-colors">
              <Moon size={16} className="text-gray-400"/>
              Dark Mode (Active)
            </button>
            
            <div className="h-px bg-gray-700/50 my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
            >
              <LogOut size={16} />
              Disconnect Session
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CloudRain size={20} className="text-blue-300" />
            Rainfall Simulator
          </h2>
          <span className="text-blue-400 font-bold text-xl">{rainfallIntensity} mm</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={rainfallIntensity}
          onChange={(e) => setRainfallIntensity(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0 mm (Normal)</span>
          <span>200 mm (Severe)</span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Gauge size={16} />
          Readiness Legend
        </h3>
        
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-brand-green shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Safe (&gt;70)</p>
              <p className="text-xs text-gray-400">Low flood risk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-brand-yellow shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Warning (40-70)</p>
              <p className="text-xs text-gray-400">Moderate risk, prepare resources</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-brand-red shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Critical (&lt;40)</p>
              <p className="text-xs text-gray-400">High vulnerability, deploy teams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <button 
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
          onClick={handleDeploy}
        >
          <MapPin size={18} />
          Deploy Resources
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
