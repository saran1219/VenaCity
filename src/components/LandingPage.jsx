import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Activity, ShieldAlert, Map, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative font-sans selection:bg-blue-500/30">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-red-600/10 rounded-full blur-[100px]"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTM5IDB2NDBNMCAzOWg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-50 z-0 mix-blend-overlay pointer-events-none"></div>
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Droplets size={24} className="text-blue-400" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">VenaCity</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Officer Portal</Link>
          <Link to="/register" className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all shadow-inner">Sign Up</Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-24 pb-32 flex flex-col items-center justify-center text-center">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-5xl">
          <span className="block">Jal-Drishti:</span>
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">Urban Hydrology Engine</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl leading-relaxed font-medium">
          Predictive Ward-Level Flood Intelligence for India's 2,500+ Hotspots. Calculate real-time readiness scores and protect infrastructure before the monsoon hits.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-2xl">
          <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:-translate-y-1">
            <Activity size={20} />
            Launch Administrator Portal
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-md border border-gray-700 text-white rounded-xl font-bold text-lg transition-all shadow-inner hover:-translate-y-1">
            <Map size={20} className="text-blue-400" />
            View Public Map
            <ArrowRight size={18} className="text-gray-400" />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl w-full text-left">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-6 rounded-2xl shadow-xl hover:bg-gray-800/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
              <Map size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">GIS Heatmaps</h3>
            <p className="text-gray-400 leading-relaxed text-sm">Real-time Mapbox integration rendering ward-level polygons prioritizing drainage maintenance needs.</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-6 rounded-2xl shadow-xl hover:bg-gray-800/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
              <Activity size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Readiness Score</h3>
            <p className="text-gray-400 leading-relaxed text-sm">Dynamic 0-100 metric weighting topography, infrastructure health, and impervious surfaces.</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-6 rounded-2xl shadow-xl hover:bg-gray-800/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4 border border-red-500/30">
              <ShieldAlert size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">What-If Simulations</h3>
            <p className="text-gray-400 leading-relaxed text-sm">Adjust rainfall intensity using our simulator to instantly visualize infrastructure failure points.</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;
