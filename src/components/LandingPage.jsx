import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Activity, ShieldAlert, Map, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative font-sans selection:bg-blue-500/30">
      
      {/* Dynamic Background with Floating Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-red-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating Geometric Particles */}
        <div className="absolute top-[15%] left-[10%] w-16 h-16 border border-white/5 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute top-[60%] right-[15%] w-24 h-24 border border-blue-500/10 rounded-full backdrop-blur-md animate-float-delayed"></div>
        <div className="absolute bottom-[40%] left-[25%] w-12 h-12 bg-emerald-500/5 rounded-full blur-md animate-float-slow"></div>
        <div className="absolute top-[25%] right-[30%] w-8 h-8 bg-blue-400/20 rounded-full blur-sm animate-float-fast shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <div className="absolute bottom-[20%] right-[40%] w-10 h-10 border border-emerald-500/20 rounded-xl rotate-45 backdrop-blur-sm animate-float"></div>

        {/* Dense Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTM5IDB2NDBNMCAzOWg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-50 z-0 mix-blend-overlay pointer-events-none transition-transform duration-1000 hover:scale-105"></div>
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5 opacity-0 animate-fade-in-up">
        <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse-fast">
            <Droplets size={24} className="text-blue-400" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight cursor-default">VenaCity</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">Login</Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-24 pb-40 flex flex-col items-center justify-center text-center">
        
        <div className="opacity-0 animate-fade-in-up-delay-1 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent blur-2xl rounded-full"></div>
          <h1 className="relative text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight max-w-5xl transition-transform duration-500 hover:scale-[1.01]">
            <span className="block drop-shadow-2xl text-white/95">Jal-Drishti:</span>
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">Hydrology Engine</span>
          </h1>
        </div>
        
        <p className="opacity-0 animate-fade-in-up-delay-2 text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl leading-relaxed font-medium drop-shadow-lg border-l-4 border-blue-500/50 pl-6 text-left">
          Predictive Ward-Level Flood Intelligence for India's 2,500+ Hotspots. Calculate real-time readiness scores and protect infrastructure <span className="text-emerald-400 font-semibold border-b border-emerald-400/30">before the monsoon hits</span>.
        </p>

        <div className="opacity-0 animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-2xl relative z-20">
          <Link to="/login" className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 flex-1 to-emerald-600 text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.03] shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <Activity size={22} className="relative z-10 animate-pulse-fast" />
            <span className="relative z-10">Command Center</span>
          </Link>
          <Link to="/dashboard" className="group w-full sm:w-auto flex items-center flex-1 justify-center gap-3 px-8 py-4 bg-gray-900/80 hover:bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-blue-500/50 text-white rounded-2xl font-bold text-lg transition-all shadow-inner hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:-translate-y-1">
            <Map size={22} className="text-blue-400 group-hover:scale-110 transition-transform group-hover:rotate-12" />
            View Public Map
            <ArrowRight size={20} className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Animated Water Waves (Absolute to Hero) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none opacity-30 z-0 pointer-events-none">
          <div className="relative h-32 w-full animate-wave overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMGMyNTAgMTAwIDUwMC0xMDAgMTAwMCAwdjEwMEgwWkwiIGZpbGw9IiMzQjgyRjYiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] bg-repeat-x"></div>
          <div className="absolute bottom-0 h-32 w-full animate-wave-slow overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMGMzNTAgMTAwIDYwMC0xMDAgMTAwMCAwdjEwMEgwWkwiIGZpbGw9IiMxMEI5ODEiIG9wYWNpdHk9IjAuMDUiLz4=')] bg-repeat-x pointer-events-none mix-blend-screen"></div>
        </div>

        {/* Feature Highlights */}
        <div className="opacity-0 animate-fade-in-up-delay-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 max-w-6xl w-full text-left relative z-10">
          <div className="opacity-0 animate-fade-in-up-delay-1 bg-gradient-to-b from-gray-900/60 to-gray-900/20 backdrop-blur-xl border border-gray-800 hover:border-blue-500/30 p-8 rounded-3xl shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
              <Map size={28} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">GIS Heatmaps</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">Real-time Mapbox integration rendering ward-level polygons prioritizing drainage maintenance needs based on geospatial infrastructure data.</p>
          </div>
          <div className="opacity-0 animate-fade-in-up-delay-2 bg-gradient-to-b from-gray-900/60 to-gray-900/20 backdrop-blur-xl border border-gray-800 hover:border-emerald-500/30 p-8 rounded-3xl shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
              <Activity size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">Readiness Engine</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">Dynamically calculates a 0-100 metric weighting complex topography, active infrastructure health, and local impervious surfaces.</p>
          </div>
          <div className="opacity-0 animate-fade-in-up-delay-3 bg-gradient-to-b from-gray-900/60 to-gray-900/20 backdrop-blur-xl border border-gray-800 hover:border-red-500/30 p-8 rounded-3xl shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
              <ShieldAlert size={28} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">What-If Models</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">Adjust rainfall intensity mathematically using the interactive simulator to actively visualize critical infrastructure failure points in real-time.</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;
