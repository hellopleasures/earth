import { EarthData, WindPatternData } from './earth-monitoring';

export function generateMockEarthData(): EarthData {
  // Base Schumann frequency with realistic variations
  const schumannData = {
    frequency: 7.83,
    amplitude: 1.0,
    timestamp: new Date().toISOString(),
    location: "Global"
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

  // Generate mock earthquake data
  const earthquakeData = {
    recentQuakes: [
      {
        magnitude: 3.5 + Math.random() * 2,
        location: "Pacific Ring of Fire",
        depth: 10 + Math.random() * 30,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      },
      {
        magnitude: 2.5 + Math.random() * 1.5,
        location: "Mid-Atlantic Ridge",
        depth: 5 + Math.random() * 15,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }
    ],
    dailyCount: Math.floor(10 + Math.random() * 20),
    highestMagnitude: 4.5 + Math.random() * 2
  };

  // Generate mock geomagnetic storm data
  const geomagneticStormData = {
    stormLevel: Math.min(5, Math.floor(kpIndex / 2)),
    expectedDuration: `${Math.floor(6 + Math.random() * 18)} hours`,
    intensity: Math.floor(kpIndex * 10 + Math.random() * 20),
    polarActivity: kpIndex > 4
  };

  // Generate mock wind pattern data
  const windPatternData: WindPatternData = {
    globalJetStreams: [
      {
        speed: 100 + Math.random() * 150,
        direction: ["NW", "NE", "SW", "SE"][Math.floor(Math.random() * 4)],
        altitude: 9 + Math.random() * 3
      },
      {
        speed: 80 + Math.random() * 120,
        direction: ["NW", "NE", "SW", "SE"][Math.floor(Math.random() * 4)],
        altitude: 8 + Math.random() * 4
      }
    ],
    tradeWindStrength: 15 + Math.random() * 25,
    pressureSystems: [
      {
        type: Math.random() > 0.5 ? 'high' : 'low' as const,
        location: "North Pacific",
        pressure: 1000 + Math.random() * 30
      },
      {
        type: Math.random() > 0.5 ? 'high' : 'low' as const,
        location: "South Atlantic",
        pressure: 990 + Math.random() * 40
      }
    ]
  };

  return {
    schumann: {
      ...schumannData,
      timestamp: Date.now().toString(),
      location: 'Global'
    },
    solarActivity: {
      ...solarData,
      solarFlares: Math.random() > 0.8 ? ['X-class flare detected'] : []
    },
    geomagneticActivity: {
      ...geomagneticData,
      anomalies: Math.random() > 0.8 ? ['Magnetic reversal detected'] : []
    },
    coherenceData: {
      ...coherenceData,
      dominantFrequency: 7.83 + Math.random() * 0.5
    },
    earthquakes: earthquakeData,
    geomagneticStorms: geomagneticStormData,
    windPatterns: windPatternData
  };
} 