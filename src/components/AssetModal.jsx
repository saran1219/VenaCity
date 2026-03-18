import React from 'react';
import { X, AlertCircle, TrendingDown, Hospital, Zap, ChevronRight } from 'lucide-react';
import { CRITICAL_ASSETS } from '../data/assets';

const AssetModal = ({ isOpen, onClose, riskAssets, onAssetSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingDown size={20} className="text-blue-400" />
              </div>
              Critical Infrastructure: Digital Twin Analysis
            </h2>
            <p className="text-gray-400 text-sm mt-1">Real-time simulation of ward-level flooding impacts</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {CRITICAL_ASSETS.map((asset) => {
            const riskData = riskAssets.find(ra => ra.id === asset.id);
            const isAtRisk = !!riskData;

            return (
              <div 
                key={asset.id}
                onClick={() => onAssetSelect(asset.id)}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                  isAtRisk 
                    ? 'bg-red-950/20 border-red-900/50 hover:border-red-500 shadow-inner' 
                    : 'bg-gray-800/40 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/60'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  isAtRisk ? 'bg-red-500/20' : 'bg-gray-700/50'
                }`}>
                  {asset.type === 'hospital' 
                    ? <Hospital size={24} className={isAtRisk ? 'text-red-400' : 'text-blue-400'} />
                    : <Zap size={24} className={isAtRisk ? 'text-red-400' : 'text-yellow-400'} />
                  }
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{asset.name}</h3>
                    {isAtRisk && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                        Critical
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-tighter">
                      {asset.type}
                    </span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      {isAtRisk ? (
                        <>
                          <AlertCircle size={12} className="text-red-400" />
                          <span className="text-red-400 font-medium">Inundation Zone: {riskData.wardName}</span>
                        </>
                      ) : (
                        "Status: Operational"
                      )}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 font-medium ${isAtRisk ? 'text-red-300/80' : 'text-gray-500'}`}>
                    {asset.impact}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-gray-900/50 text-gray-500 group-hover:text-blue-400 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-gray-900/80 border-t border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${riskAssets.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            {riskAssets.length} of {CRITICAL_ASSETS.length} Critical Assets at Risk
          </div>
          <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em]">VenaCity Digital Twin v1.2</p>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
