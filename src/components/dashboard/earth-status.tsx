import { useEffect, useState } from 'react';
import { EarthData, fetchEarthData } from '@/services/earth-monitoring';
import { Line } from 'react-chartjs-2';
import { EarthGlobe } from './earth-globe';

export function EarthStatus() {
  const [earthData, setEarthData] = useState<EarthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateEarthData = async () => {
      try {
        const data = await fetchEarthData();
        setEarthData(data);
      } catch (error) {
        console.error('Error fetching Earth data:', error);
      } finally {
        setLoading(false);
      }
    };

    updateEarthData();
    const interval = setInterval(updateEarthData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  if (!earthData) {
    return <div className="alert alert-error">Unable to connect to Earth&apos;s monitoring systems</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Earth Monitoring Network</h2>
          <EarthGlobe data={earthData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Schumann Resonance</h2>
            <p>{earthData.schumann.frequency.toFixed(2)} Hz</p>
            <div className="h-48">
              <Line 
                data={{
                  labels: ['00:00', '06:00', '12:00', '18:00'],
                  datasets: [{
                    label: 'Frequency',
                    data: [7.83, earthData.schumann.frequency, earthData.schumann.frequency, earthData.schumann.frequency],
                    borderColor: 'rgb(75, 192, 192)',
                  }]
                }}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Solar Activity</h2>
            <p>Kp Index: {earthData.solarActivity.kpIndex}</p>
            <p>Solar Wind: {earthData.solarActivity.solarWindSpeed} km/s</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Geomagnetic Activity</h2>
            <p>Global Index: {earthData.geomagneticActivity.globalIndex}</p>
            <p>Local Strength: {earthData.geomagneticActivity.localStrength} nT</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Global Coherence</h2>
            <p>Coherence Level: {earthData.coherenceData.globalCoherence}</p>
            <p>Active Monitoring Nodes: {earthData.coherenceData.activeNodes}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 