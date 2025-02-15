import { EarthData } from './earth-monitoring';

export function generateMockEarthData(): EarthData {
  // Base Schumann frequency with realistic variations
  const schumannData = {
    frequency: 7.83 + (Math.random() - 0.5) * 0.2, // More constrained variation
    amplitude: 0.3 + Math.sin(Date.now() * 0.0001) * 0.2 + Math.random() * 0.2
  };

  // Solar activity with correlated Kp index and wind speed
  const kpIndex = Math.min(9, Math.floor(Math.random() * 4) + Math.floor(Math.random() * 3));
  const solarData = {
    kpIndex,
    solarWindSpeed: 350 + kpIndex * 50 + Math.random() * 100 // Correlate with Kp index
  };

  // Geomagnetic activity correlated with solar activity
  const geomagneticData = {
    globalIndex: Math.min(7, kpIndex * 0.8 + Math.random() * 2),
    localStrength: 25000 + (kpIndex * 1000) + Math.random() * 5000
  };

  // Global coherence data with time-based patterns
  const timeOfDay = (Date.now() % (24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000);
  const baseCoherence = 0.3 + Math.sin(timeOfDay * Math.PI * 2) * 0.2;
  
  const coherenceData = {
    globalCoherence: Math.max(0.1, Math.min(1, baseCoherence + Math.random() * 0.3)),
    activeNodes: Math.floor(40 + Math.sin(timeOfDay * Math.PI * 2) * 20 + Math.random() * 20)
  };

  return {
    schumann: schumannData,
    solarActivity: solarData,
    geomagneticActivity: geomagneticData,
    coherenceData: coherenceData
  };
} 