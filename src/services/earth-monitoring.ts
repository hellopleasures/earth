import axios from 'axios';
import { generateMockEarthData } from './mock-earth-data';

export interface SolarData {
  kpIndex: number;
  solarWindSpeed: number;
  solarFlares: string[];
}

export interface EarthData {
  schumann: SchumannData;
  solarActivity: SolarData;
  geomagneticActivity: GeomagneticData;
  coherenceData: CoherenceData;
  earthquakes: EarthquakeData;
  geomagneticStorms: GeomagneticStormData;
  windPatterns: WindPatternData;
}

interface SchumannData {
  frequency: number;
  amplitude: number;
  timestamp: string;
  location: string;
}

interface SolarActivity {
  kpIndex: number;
  solarFlares: string[];
  solarWindSpeed: number;
}

interface GeomagneticData {
  localStrength: number;
  globalIndex: number;
  anomalies: string[];
}

interface CoherenceData {
  globalCoherence: number;
  activeNodes: number;
  dominantFrequency: number;
}

interface EarthquakeData {
  recentQuakes: Array<{
    magnitude: number;
    location: string;
    depth: number;
    timestamp: string;
  }>;
  dailyCount: number;
  highestMagnitude: number;
}

interface GeomagneticStormData {
  stormLevel: number;
  expectedDuration: string;
  intensity: number;
  polarActivity: boolean;
}

export interface WindPatternData {
  globalJetStreams: Array<{
    speed: number;
    direction: string;
    altitude: number;
  }>;
  tradeWindStrength: number;
  pressureSystems: Array<{
    type: 'high' | 'low';
    location: string;
    pressure: number;
  }>;
}

export async function fetchEarthData(): Promise<EarthData> {
  try {
    // For development, use mock data
    return generateMockEarthData();
    
    // When ready for production, uncomment this:
    /*
    const [schumann, solar, geomagnetic, coherence] = await Promise.all([
      fetchSchumannData(),
      fetchSolarData(),
      fetchGeomagneticData(),
      fetchCoherenceData(),
    ]);

    return {
      schumann,
      solarActivity: solar,
      geomagneticActivity: geomagnetic,
      coherenceData: coherence,
    };
    */
  } catch (error) {
    console.error('Error fetching Earth data:', error);
    throw error;
  }
}

async function fetchSchumannData(): Promise<SchumannData> {
  // HeartMath Institute API endpoint
  const response = await axios.get('https://api.heartmath.org/gci/schumann');
  return response.data;
}

async function fetchSolarData(): Promise<SolarData> {
  // NOAA Space Weather Prediction Center API
  const response = await axios.get('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
  return response.data;
}

async function fetchGeomagneticData(): Promise<GeomagneticData> {
  // Local magnetometer network aggregation
  const response = await axios.get('https://api.intermagnet.org/data');
  return response.data;
}

async function fetchCoherenceData(): Promise<CoherenceData> {
  // Global Coherence Initiative real-time data
  const response = await axios.get('https://api.heartmath.org/gci/coherence');
  return response.data;
} 