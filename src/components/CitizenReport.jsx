import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, Mic, CheckCircle, ChevronLeft, ShieldCheck, Waves } from 'lucide-react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CitizenReport = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [severity, setSeverity] = useState('knee-deep');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  // 1. Unique User Fingerprinting (Spam Shield)
  useEffect(() => {
    let storedId = localStorage.getItem('v_user_id');
    if (!storedId) {
      storedId = Math.random().toString(36).substring(7);
      localStorage.setItem('v_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  const handleGetLocation = () => {
    setGettingLocation(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable GPS.");
        setGettingLocation(false);
      }
    );
  };

  const handleVoiceSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setDescription(prev => prev + (prev ? " " : "") + "[Voice Intel: Water logging noticed near the main intersection, approximately 2 feet high.]");
      setIsRecording(false);
    }, 2000);
  };

  const resetForm = () => {
    setLocation(null);
    setSeverity('knee-deep');
    setDescription('');
    setSubmissionComplete(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError("Please capture your location first.");
      return;
    }

    const lastReportTime = localStorage.getItem('venacity_last_report');
    const now = Date.now();
    if (lastReportTime && (now - parseInt(lastReportTime)) < 15 * 60 * 1000) {
      const remaining = Math.ceil((15 * 60 * 1000 - (now - parseInt(lastReportTime))) / 60000);
      setError(`Rate Limit: Please wait ${remaining} minutes before sending another report.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, "citizen_reports"), {
        latitude: location.lat,
        longitude: location.lng,
        severity: severity,
        description: description,
        timestamp: serverTimestamp(),
        reputation: 85, 
        wardId: "W02", 
        wardName: "T. Nagar (Near Me)",
        userId: userId // Unique fingerprint included
      });
      
      localStorage.setItem('venacity_last_report', Date.now().toString());
      setSubmissionComplete(true); // Triggers Bright Green & Success Text
      
      // Delay before showing the success overlay and resetting
      setTimeout(() => {
        setIsSuccess(true);
        setTimeout(() => {
          resetForm();
          setIsSuccess(false);
          navigate('/');
        }, 3000);
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-emerald-500/50 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-scale-in">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Report Secured</h2>
          <p className="text-gray-400 mb-6 leading-relaxed text-sm">
            Intel transmitted to the digital twin command center. Thank you for protecting Chennai.
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-500/5 py-3 rounded-xl border border-emerald-500/10">
            <ShieldCheck size={18} />
            +15 Reputation Points
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1/2 bg-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="max-w-lg mx-auto p-6 md:pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors mb-8 bg-gray-900/40 px-4 py-2 rounded-full border border-gray-800"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-lg">
              <Waves className="text-blue-400" size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Jal-Sahayak</h1>
          </div>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Citizen Emergency Intelligence</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-3xl border border-gray-800 shadow-xl group transition-all hover:border-blue-500/30">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <MapPin size={12} className="text-blue-400" />
              Incident Geolocation
            </h3>
            
            {!location ? (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="w-full py-5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black flex items-center justify-center gap-3 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] relative overflow-hidden"
              >
                {gettingLocation ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Triangulating...</span>
                  </div>
                ) : (
                  <>
                    <Navigation size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Lock My Location
                  </>
                )}
              </button>
            ) : (
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tight">GPS Locked</p>
                    <p className="text-[10px] text-gray-500 font-medium">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setLocation(null)}
                  className="text-[10px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
            )}
            {error && <p className="mt-3 text-[10px] text-red-400 font-bold flex items-center gap-1 uppercase tracking-wider"><AlertTriangle size={12} /> {error}</p>}
          </div>

          <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800 shadow-xl">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Depth Severity</h3>
            <div className="grid grid-cols-1 gap-2">
              {['knee-deep', 'waist-deep', 'road-blocked'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`py-4 px-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    severity === level 
                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                    : 'border-gray-800 bg-gray-900/30 text-gray-500 hover:border-gray-700'
                  }`}
                >
                  <span className="text-sm font-bold capitalize">{level.replace('-', ' ')}</span>
                  {severity === level && <CheckCircle size={16} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Contextual Intel</h3>
              <button
                type="button"
                onClick={handleVoiceSimulation}
                disabled={isRecording}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                <Mic size={14} />
                {isRecording ? 'Listening...' : 'Record Voice'}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. 'Drainage overflow at 4th street'..."
              className="w-full bg-gray-800/30 border border-gray-800 rounded-2xl p-5 text-gray-200 text-sm focus:border-blue-500/50 outline-none transition-all h-28 resize-none shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || submissionComplete}
            className={`w-full py-6 rounded-3xl text-white font-black text-lg tracking-tight transition-all shadow-2xl disabled:shadow-none relative overflow-hidden ${
              submissionComplete 
                ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-900 disabled:to-gray-900'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="uppercase tracking-widest text-sm">Transmitting...</span>
              </div>
            ) : submissionComplete ? (
              <div className="flex items-center justify-center gap-2 scale-110">
                <CheckCircle size={22} className="animate-bounce" />
                Report Logged Successfully ✓
              </div>
            ) : (
              "Submit Critical Intel"
            )}
          </button>
        </form>

        <footer className="mt-12 text-center pb-8 border-t border-gray-900/50 pt-8">
          <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.4em]">
            Digital Twin Core • Chennai 2026
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CitizenReport;
