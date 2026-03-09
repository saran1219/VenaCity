import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { calculateReadinessScore } from '../services/engine';
import mockWardsData from '../data/mockWards.json';

// User provided Mapbox token from env
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapContainer = ({ rainfallIntensity }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Initialize map only once
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark style for dynamic highlighting
      center: [80.2707, 13.0827], // Centered around Chennai
      zoom: 13,
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);

      // Add source for wards
      mapRef.current.addSource('wards', {
        type: 'geojson',
        data: getProcessedWardsData(0) // Start with 0mm rainfall
      });

      // Add layer for ward polygons
      mapRef.current.addLayer({
        id: 'ward-polygons',
        type: 'fill',
        source: 'wards',
        paint: {
          'fill-color': [
            'step',
            ['get', 'readinessScore'],
            '#ef4444', // Red for < 40
            40, '#facc15', // Yellow for 40-70
            70, '#22c55e'  // Green for >= 70
          ],
          'fill-opacity': 0.7,
        }
      });

      // Add layer for ward borders
      mapRef.current.addLayer({
        id: 'ward-borders',
        type: 'line',
        source: 'wards',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.5
        }
      });
      
      // Add Popup functionality on click
      mapRef.current.on('click', 'ward-polygons', (e) => {
        const props = e.features[0].properties;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2 text-black">
              <h3 class="font-bold text-lg mb-1">${props.name} (${props.wardId})</h3>
              <p>Elevation: ${props.elevation}</p>
              <p>Drainage Health: ${props.drainageHealth}</p>
              <p>Green Cover: ${props.greenCover}</p>
              <p class="font-bold mt-2">Readiness Score: <span class="text-xl">${props.readinessScore}/100</span></p>
            </div>
          `)
          .addTo(mapRef.current);
      });

      // Change cursor to pointer for interactivity
      mapRef.current.on('mouseenter', 'ward-polygons', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });
      mapRef.current.on('mouseleave', 'ward-polygons', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      mapRef.current.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper function to process the geojson with the current rainfall intensity
  const getProcessedWardsData = (intensity) => {
    const newFeatures = mockWardsData.features.map(feature => {
      const score = calculateReadinessScore(feature.properties, intensity);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          readinessScore: score
        }
      };
    });

    return {
      type: 'FeatureCollection',
      features: newFeatures
    };
  };

  // Update map source when rainfallIntensity changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const source = mapRef.current.getSource('wards');
    if (source) {
      source.setData(getProcessedWardsData(rainfallIntensity));
    }
  }, [rainfallIntensity, mapLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full rounded-2xl shadow-xl border border-gray-800"
      />
    </div>
  );
};

export default MapContainer;
