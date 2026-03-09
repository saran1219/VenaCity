import React, { useState } from 'react';
import MapContainer from './MapContainer';
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import { AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [rainfallIntensity, setRainfallIntensity] = useState(20);

  return (
    <div className="flex h-screen w-screen bg-gray-950 overflow-hidden font-sans text-gray-100">
      <Sidebar 
        rainfallIntensity={rainfallIntensity} 
        setRainfallIntensity={setRainfallIntensity} 
      />
      <main className="flex-1 relative p-4 flex flex-col">
        {/* Critical Flood Warning Banner */}
        {rainfallIntensity >= 150 && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-600/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-400 flex items-center gap-3 animate-pulse">
            <AlertTriangle size={24} className="text-white" />
            <span className="font-black tracking-wider uppercase text-sm md:text-base">Critical Flood Warning: Max Capacity Exceeded</span>
          </div>
        )}
        
        {/* Header/Banner space if needed, else map takes full */}
        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-gray-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-gray-800">
          <MapContainer rainfallIntensity={rainfallIntensity} />
          <StatsCard rainfallIntensity={rainfallIntensity} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
