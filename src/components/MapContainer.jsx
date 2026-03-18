import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Hospital, Zap } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CRITICAL_ASSETS } from '../data/assets';
import { calculateReadinessScore } from '../services/engine';
import mockWardsData from '../data/mockWards.json';

const mbgl = mapboxgl || window.mapboxgl;

// Securely access the Mapbox token from Vite environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (mbgl) {
  mbgl.accessToken = MAPBOX_TOKEN;
}

const MapContainer = React.forwardRef(({ rainfallIntensity, onRiskUpdate }, ref) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [riskAssets, setRiskAssets] = useState([]);
  const [isLightning, setIsLightning] = useState(false);

  // Helper: Point-in-polygon check for ward boundaries
  const isPointInWard = (point, coordinates) => {
    if (!coordinates || !coordinates[0]) return false;
    const [lng, lat] = point;
    const polygon = coordinates[0];
    const lats = polygon.map(p => p[1]);
    const lngs = polygon.map(p => p[0]);
    return lat >= Math.min(...lats) && lat <= Math.max(...lats) &&
           lng >= Math.min(...lngs) && lng <= Math.max(...lngs);
  };

  // Hydrology Processing Logic
  const getProcessedWardsData = (intensity) => {
    const atRisk = [];
    const processedFeatures = mockWardsData.features.map(feature => {
      const score = calculateReadinessScore(feature.properties, intensity);
      if (score < 40) {
        CRITICAL_ASSETS.forEach(asset => {
          if (isPointInWard(asset.coords, feature.geometry.coordinates)) {
            if (!atRisk.find(a => a.id === asset.id)) {
              atRisk.push({ ...asset, wardName: feature.properties.name });
            }
          }
        });
      }
      return {
        ...feature,
        properties: { ...feature.properties, readinessScore: score }
      };
    });
    return { type: 'FeatureCollection', features: processedFeatures, atRiskAssets: atRisk };
  };

  // Internal implementation of imperative methods to avoid circular ref dependency
  const flashWardInternal = (wardId) => {
    if (!mapRef.current) return;
    mapRef.current.setFilter('ward-polygons', ['==', ['get', 'wardId'], wardId]);
    setTimeout(() => { if (mapRef.current) mapRef.current.setFilter('ward-polygons', null); }, 2000);
  };

  const focusOnAssetInternal = (assetId) => {
    const asset = CRITICAL_ASSETS.find(a => a.id === assetId);
    if (asset && mapRef.current) {
      mapRef.current.flyTo({ center: asset.coords, zoom: 15, duration: 2000, essential: true });
    }
  };

  // Exposed API for Dashboard interactions
  React.useImperativeHandle(ref, () => ({
    flashWard: flashWardInternal,
    focusOnAsset: focusOnAssetInternal
  }));

  // Map Mounting & Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initializeMap = () => {
      mapRef.current = new mbgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [80.2707, 13.0827],
        zoom: 12,
        pitch: 45,
        antialias: true,
        logoPosition: 'bottom-right',
        attributionControl: false
      });

      mapRef.current.on('load', () => {
        const initialData = getProcessedWardsData(rainfallIntensity);
        mapRef.current.addSource('wards', {
          type: 'geojson',
          data: initialData
        });

        mapRef.current.addLayer({
          id: 'ward-polygons',
          type: 'fill',
          source: 'wards',
          paint: {
            'fill-color': ['step', ['get', 'readinessScore'], '#ef4444', 40, '#facc15', 70, '#22c55e'],
            'fill-opacity': 0.6,
          }
        });

        mapRef.current.addLayer({
          id: 'ward-borders',
          type: 'line',
          source: 'wards',
          paint: { 'line-color': '#ffffff', 'line-width': 1, 'line-opacity': 0.2 }
        });

        setMapLoaded(true);
        // Force resize to fix container dimension issues
        mapRef.current.resize();
        
        // Interaction: Ward Clicks
        mapRef.current.on('click', 'ward-polygons', (e) => {
          const props = e.features[0].properties;
          
          // Map properties to requested technical HUD schema
          const wardDetails = {
            wardName: props.name,
            readinessScore: props.readinessScore,
            elevation: props.elevation,
            drainage: props.drainageHealth // User requested 'drainage'
          };

          // Trigger the 'flashWard' effect for visual feedback
          flashWardInternal(props.wardId);
          
          // Dispatch official alert event for system response
          window.dispatchEvent(new CustomEvent('send-official-alert', { 
            detail: { ...props, coords: e.lngLat } 
          }));

          // Dispatch technical detail event for the Rich HUD
          window.dispatchEvent(new CustomEvent('ward-selected', { 
            detail: wardDetails 
          }));
        });

        // Cursor Style
        mapRef.current.on('mouseenter', 'ward-polygons', () => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        });
        mapRef.current.on('mouseleave', 'ward-polygons', () => {
          mapRef.current.getCanvas().style.cursor = '';
        });

        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.resize();
          }
        }, 500);
      });
    };

    // Delay initialization slightly to ensure Antigravity has rendered the DOM
    const timer = setTimeout(initializeMap, 300);

    return () => {
      clearTimeout(timer);
      mapRef.current?.remove();
    };
  }, []);

  // Update GeoJSON and Paint properties when rainfall intensity changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const source = mapRef.current.getSource('wards');
    if (source) {
      const { features, atRiskAssets } = getProcessedWardsData(rainfallIntensity);
      source.setData({ type: 'FeatureCollection', features });
      
      // Update local state for markers/HUD
      setRiskAssets(atRiskAssets);
      if (onRiskUpdate) onRiskUpdate(atRiskAssets);
      
      mapRef.current.setPaintProperty('ward-polygons', 'fill-color', [
        'step', ['get', 'readinessScore'], '#ef4444', 40, '#facc15', 70, '#22c55e'
      ]);
    }
  }, [rainfallIntensity, mapLoaded]);

  // Handle Markers for Critical Assets (Hospitals/Power Grids)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    CRITICAL_ASSETS.forEach(asset => {
      const isAtRisk = riskAssets.some(ra => ra.id === asset.id);
      const el = document.createElement('div');
      el.className = `custom-marker ${isAtRisk ? 'is-at-risk' : ''}`;
      
      const iconMarkup = renderToStaticMarkup(
        asset.type === 'hospital'
          ? <Hospital size={18} color={isAtRisk ? '#ef4444' : '#60a5fa'} />
          : <Zap size={18} color={isAtRisk ? '#ef4444' : '#fbbf24'} />
      );

      el.innerHTML = `
        <div class="marker-blob ${isAtRisk ? 'animate-pulse' : ''}" 
             style="background: ${isAtRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(30, 41, 59, 0.8)'}; 
                    border: 2px solid ${isAtRisk ? '#ef4444' : '#334155'}; 
                    padding: 8px; border-radius: 99px; display: flex; align-items: center; justify-content: center;">
          ${iconMarkup}
        </div>
      `;

      const marker = new mbgl.Marker({ element: el }).setLngLat(asset.coords).addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [riskAssets, mapLoaded]);

  // Weather FX Engine (Lightning strikes during high intensity)
  useEffect(() => {
    if (rainfallIntensity > 130) {
      const interval = setInterval(() => {
        if (Math.random() > 0.85) {
          setIsLightning(true);
          setTimeout(() => setIsLightning(false), 120);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [rainfallIntensity]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-slate-800"
      style={{ height: '650px', backgroundColor: '#060b13', display: 'block', position: 'relative', padding: 0 }}
    >
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ zIndex: 0 }}
      />

      {/* Rain Particle Layer */}
      {rainfallIntensity > 5 && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(Math.min(40, Math.floor(rainfallIntensity / 4)))].map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.4 + Math.random() * 0.4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning Flash Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-20 transition-opacity duration-75 ${isLightning ? 'bg-white/10 opacity-100' : 'opacity-0'}`} />

      <style>
        {`
          .mapboxgl-canvas {
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          .rain-drop {
            position: absolute;
            top: -20px;
            width: 1px;
            height: 20px;
            background: linear-gradient(transparent, rgba(147, 197, 253, 0.4));
            animation: fall linear infinite;
          }
          @keyframes fall {
            to { transform: translateY(100vh); }
          }
          .custom-marker { cursor: pointer; transition: transform 0.2s; z-index: 30; }
          .is-at-risk div { box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
        `}
      </style>
    </div>
  );
});

export default MapContainer;