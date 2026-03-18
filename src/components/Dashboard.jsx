import React, { useState, useEffect, useRef } from 'react';
import MapContainer from './MapContainer';
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import AssetModal from './AssetModal';
import { AlertTriangle } from 'lucide-react';
import { fetchLiveWeather, fetchChennaiForecast } from '../services/weatherService';

const Dashboard = () => {
  // State Management
  const [rainfallIntensity, setRainfallIntensity] = useState(0);
  const [weatherMode, setWeatherMode] = useState('simulate'); // 'live', 'forecast', 'simulate'
  const [isSyncing, setIsSyncing] = useState(false);
  const [riskAssets, setRiskAssets] = useState([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const mapRef = useRef();
  const pollingInterval = useRef(null);

  // Verification Log for Hackathon Admin
  console.log("🛰️ Engine Diagnostic | Intensity:", rainfallIntensity, "Mode:", weatherMode);

  /**
   * CORE LOGIC: Weather Synchronization Engine
   * Connects Live API data to the Hydrology Engine
   */
  useEffect(() => {
    const syncWeather = async () => {
      setIsSyncing(true);

      try {
        if (weatherMode === 'live') {
          const data = await fetchLiveWeather();
          // OpenWeather returns 0mm if it's sunny, our service adds a demo fallback
          setRainfallIntensity(data.rain);
          console.log(`📡 Live API Sync: ${data.rain}mm | ${data.description}`);

        } else if (weatherMode === 'forecast') {
          const data = await fetchChennaiForecast();
          // Forecast intensity is derived from Probability of Precipitation (PoP)
          setRainfallIntensity(data.peakRain);
          console.log("📅 Forecast Engine: 24h Peak Risk Calculated.");
        }

      } catch (err) {
        console.error("❌ Weather Sync Engine Failed:", err);
        setNotification("Satellite Offline. Switching to Manual Mode.");
        setWeatherMode('simulate');
      } finally {
        // Visual delay for the "Syncing" state to look professional
        setTimeout(() => setIsSyncing(false), 600);
      }
    };

    if (weatherMode !== 'simulate') {
      syncWeather();
      // Auto-refresh every 5 minutes during the demo
      pollingInterval.current = setInterval(syncWeather, 5 * 60 * 1000);
    } else {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      setIsSyncing(false);
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [weatherMode]);

  /**
   * GLOBAL ALERT & DETAIL LISTENERS
   */
  useEffect(() => {
    const handleAlert = (e) => {
      const { wardName, wardId, score, elevation, drainage, coords } = e.detail;
      
      setNotification({
        name: wardName,
        id: wardId,
        score: Math.round(score),
        elevation,
        drainage
      });

      // Auto-hide after 6 seconds
      setTimeout(() => setNotification(null), 6000);
    };

    const handleDetails = (e) => {
      setSelectedWard(e.detail);
    };

    window.addEventListener('send-official-alert', handleAlert);
    window.addEventListener('ward-selected', handleDetails);
    
    return () => {
      window.removeEventListener('send-official-alert', handleAlert);
      window.removeEventListener('ward-selected', handleDetails);
    };
  }, []);

  const handleAssetSelect = (assetId) => {
    setIsAssetModalOpen(false);
    if (mapRef.current?.focusOnAsset) {
      mapRef.current.focusOnAsset(assetId);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans text-slate-100">

      {/* LEFT SIDEBAR: The Control Deck */}
      <Sidebar
        rainfallIntensity={rainfallIntensity}
        setRainfallIntensity={setRainfallIntensity}
        weatherMode={weatherMode}
        setWeatherMode={setWeatherMode}
        isSyncing={isSyncing}
      />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 relative flex flex-col h-screen p-4">

        {/* EMERGENCY OVERLAY: High-Intensity Visual Alert */}
        {rainfallIntensity >= 150 && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-[100] bg-red-600 px-8 py-4 rounded-full shadow-[0_0_60px_rgba(220,38,38,0.7)] border border-red-400/50 flex items-center gap-4 animate-bounce">
            <AlertTriangle size={28} className="text-white fill-red-800" />
            <div className="flex flex-col">
              <span className="font-black uppercase text-lg leading-tight tracking-tight">Critical Flood Level</span>
              <span className="text-[10px] opacity-90 uppercase tracking-[0.2em] font-bold">Emergency Protocols Active</span>
            </div>
          </div>
        )}

        {/* MAP STAGE: Glassmorphic Container */}
        <div 
          className="w-full h-full relative rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl border border-white/5"
          onClick={() => setSelectedWard(null)}
        >
          <MapContainer
            ref={mapRef}
            rainfallIntensity={rainfallIntensity}
            onRiskUpdate={setRiskAssets}
          />

          {/* FLOATING HUD: Real-time Stats summary */}
          <div className="absolute top-6 right-6 z-50">
            <StatsCard
              rainfallIntensity={rainfallIntensity}
              riskAssets={riskAssets}
              onOpenAssets={(e) => {
                e.stopPropagation();
                setIsAssetModalOpen(true);
              }}
            />
          </div>

          {/* RICH WARD HUD: Bottom Center Context Card */}
          {selectedWard && (
            <div 
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-[450px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-black text-white tracking-tighter uppercase text-lg">{selectedWard.wardName}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedWard.readinessScore < 40 ? 'bg-red-500 animate-pulse' :
                    selectedWard.readinessScore < 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Technical Diagnosis</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Elevation (m)</span>
                  <span className="text-xl font-black text-blue-400">{selectedWard.elevation}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Drainage Capacity (%)</span>
                  <span className="text-xl font-black text-emerald-400">{selectedWard.drainage}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Readiness Index (%)</span>
                  <span className={`text-xl font-black ${
                    selectedWard.readinessScore < 40 ? 'text-red-500' :
                    selectedWard.readinessScore < 70 ? 'text-yellow-500' : 'text-emerald-500'
                  }`}>
                    {Math.round(selectedWard.readinessScore)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TACTICAL ALERT: Sliding from bottom */}
        {notification && !selectedWard && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[200] px-6 py-4 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500 min-w-[420px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle size={18} className="text-red-500 animate-pulse" />
                </div>
                <span className="font-bold text-white uppercase tracking-tighter">Tactical Alert: {notification.name}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">WARD_{notification.id}</span>
            </div>
            
            <div className="flex justify-between gap-4">
              <div className="flex flex-col flex-1 bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-slate-500 font-bold mb-1">Readiness</span>
                <span className={`text-xl font-black ${notification.score < 40 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {notification.score}%
                </span>
              </div>
              <div className="flex flex-col flex-1 bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-slate-500 font-bold mb-1">Elevation</span>
                <span className="text-xl font-black text-blue-400">{notification.elevation}m</span>
              </div>
              <div className="flex flex-col flex-1 bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-slate-500 font-bold mb-1">Drainage</span>
                <span className="text-xl font-black text-emerald-400">{notification.drainage}%</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Detailed view of hospitals/grids at risk */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        riskAssets={riskAssets}
        onAssetSelect={handleAssetSelect}
      />
    </div>
  );
};

export default Dashboard;