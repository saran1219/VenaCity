import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudRain, ShieldAlert, Waves, 
  Settings, LogOut, ChevronRight, 
  ToggleLeft, ToggleRight, Radio,
  CloudLightning, Activity, Globe,
  MapPin, Loader2, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { calculateReadinessScore, getRecommendedAction } from '../services/engine';
import mockWardsData from '../data/mockWards.json';
import { fetchLiveWeather, fetchChennaiForecast } from '../services/weatherService';

const Sidebar = ({ 
  rainfallIntensity, 
  setRainfallIntensity,
  weatherMode,
  setWeatherMode,
  isSyncing,
  setIsSyncing
}) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState('');

  const handleModeChange = async (newMode) => {
    if (newMode === weatherMode) return;
    
    setWeatherMode(newMode);
    
    if (newMode !== 'simulate') {
      setIsSyncing(true);
      // Immediate fetch on mode switch for better UX
      setTimeout(async () => {
        try {
          if (newMode === 'live') {
            const data = await fetchLiveWeather();
            setRainfallIntensity(Math.round(data.rain));
          } else if (newMode === 'forecast') {
            const data = await fetchChennaiForecast();
            setRainfallIntensity(Math.round(data.peakPop * 100));
          }
        } catch (err) {
          setNotification('Satellite Feed Interrupted');
        } finally {
          setIsSyncing(false);
        }
      }, 2000);
    } else {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDeploy = () => {
    window.alert(`CRITICAL ALERT: Environmental parameters exceed safe limits.\n\nEmergency dispatch protocol initiated for high-risk zones.`);
  };

  return (
    <div className="w-80 h-screen bg-gray-900 border-r border-gray-800 flex flex-col shadow-2xl z-20 overflow-hidden relative">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
      
      {/* Header Section */}
      <header className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-lg group">
            <Waves className="text-blue-400 group-hover:rotate-12 transition-transform" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">VenaCity</h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Admin Command</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors border border-transparent hover:border-gray-700"
        >
          <Settings size={18} />
        </button>
      </header>

      {/* Mode Controller Segmented Control */}
      <div className="px-6 pt-6">
        <div className="bg-gray-950/80 p-1 rounded-xl border border-gray-800 flex gap-1 shadow-inner relative overflow-hidden">
          <div 
            className="absolute h-[calc(100%-8px)] bg-blue-600 rounded-lg transition-all duration-300 ease-out"
            style={{ 
              width: 'calc(33.333% - 4px)',
              left: weatherMode === 'live' ? '4px' : weatherMode === 'forecast' ? 'calc(33.333% + 2px)' : 'calc(66.666% + 2px)'
            }}
          />
          {['live', 'forecast', 'simulate'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`flex-1 py-1.5 z-10 text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                weatherMode === mode ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Syncing Overlay */}
        {isSyncing && (
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 animate-pulse">
            <Loader2 className="text-blue-400 animate-spin" size={32} />
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] text-center">
              Syncing with Satellite...<br/>
              <span className="text-[8px] opacity-50">Fetching Atmospheric Data</span>
            </p>
          </div>
        )}

        {!isSyncing && (
          <>
            {/* Engine Status Card */}
            <div className={`p-4 rounded-2xl border transition-all duration-500 ${
              weatherMode === 'simulate' 
                ? 'bg-yellow-500/5 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]' 
                : 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  {weatherMode === 'simulate' ? (
                    <AlertTriangle size={18} className="text-yellow-400" />
                  ) : (
                    <Globe size={18} className="text-emerald-400" />
                  )}
                  {weatherMode === 'live' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-[10px] font-black uppercase tracking-widest ${
                    weatherMode === 'simulate' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {weatherMode === 'live' && 'Satellite Feed Active'}
                    {weatherMode === 'forecast' && 'Predictive Engine Locked'}
                    {weatherMode === 'simulate' && 'Manual Simulator Mode'}
                  </h3>
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">
                    {weatherMode === 'simulate' ? 'User-Defined Parameters' : 'Connected to OpenWeather: Chennai'}
                  </p>
                </div>
              </div>
              
              {weatherMode === 'simulate' && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manual Override</span>
                    <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-black border border-red-500/20">Simulation Only</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={rainfallIntensity}
                    onChange={(e) => {
                      if (weatherMode === 'simulate') {
                        setRainfallIntensity(parseInt(e.target.value));
                      }
                    }}
                    disabled={weatherMode !== 'simulate'}
                    className={`w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-not-allowed ${
                      weatherMode === 'simulate' ? 'cursor-pointer accent-yellow-500' : 'opacity-50'
                    }`}
                  />
                  <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    <span>0 mm</span>
                    <span>200 mm</span>
                  </div>
                </div>
              )}
            </div>

            {/* Environmental Metadata */}
            <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-800 shadow-inner group transition-all hover:bg-gray-800/60">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CloudRain size={18} className="text-blue-400 group-hover:animate-bounce" />
                  Env. Input
                </h2>
                <div className="flex flex-col items-end">
                  <span className="text-blue-400 font-black text-2xl tracking-tighter">{rainfallIntensity}mm</span>
                  <span className="text-[9px] text-gray-600 font-bold uppercase">Volume / Hr</span>
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    rainfallIntensity > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239, 68, 68, 0.5)]' : 
                    rainfallIntensity > 40 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (rainfallIntensity / 200) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Dynamic Risk Legend */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 text-center">Readiness Legend</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { label: 'Optimized', color: 'bg-emerald-500', range: '> 70', desc: 'Drainage healthy' },
                  { label: 'At Risk', color: 'bg-yellow-500', range: '40 - 70', desc: 'Localized flooding' },
                  { label: 'Critical', color: 'bg-red-500', range: '< 40', desc: 'Severe inundation' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 bg-gray-800/30 p-3 rounded-xl border border-gray-800/50 hover:bg-gray-800/50 transition-colors group">
                    <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg group-hover:scale-125 transition-transform`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-black text-white uppercase tracking-tight">{item.label}</span>
                        <span className="text-[10px] font-bold text-gray-500">{item.range}</span>
                      </div>
                      <p className="text-[10px] text-gray-600 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Dispatch Recommendations */}
            {rainfallIntensity > 0 && (
              <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-5 animate-scale-in">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <ShieldAlert size={16} />
                  Recommended Dispatch
                </h3>
                <ul className="space-y-2.5">
                  {getRecommendedAction(100 - (rainfallIntensity * 0.4)).map((gear, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-blue-100 font-bold transition-all hover:translate-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      {gear}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar Footer */}
      <footer className="p-6 border-t border-gray-800 bg-gray-900/50 flex-none bg-gray-900/80 backdrop-blur-md">
        {showSettings ? (
          <button 
            onClick={handleLogout}
            className="w-full py-4 flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/30 transition-all font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
          >
            <LogOut size={16} />
            Terminate Session
          </button>
        ) : (
          <button 
            onClick={handleDeploy}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.98]"
          >
            <MapPin size={18} />
            Deploy Resources
          </button>
        )}
      </footer>

      {/* Floating Notifications */}
      {notification && (
        <div className="absolute top-24 left-6 right-6 z-50 animate-fade-in-up">
          <div className="bg-gray-900/90 backdrop-blur-md border border-red-500/30 p-3 rounded-xl flex items-center gap-3 shadow-2xl">
            <ShieldAlert size={16} className="text-red-500" />
            <p className="text-[10px] font-black text-white uppercase tracking-wider">{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
