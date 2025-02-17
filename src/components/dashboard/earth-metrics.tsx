import { EarthData } from '@/services/earth-monitoring';
import { Line } from 'react-chartjs-2';

interface EarthMetricsProps {
  earthData: EarthData;
}

export function EarthMetrics({ earthData }: EarthMetricsProps) {
  return (
    <div className="">
      <div className="card-body p-2">
        <h2 className="card-title text-xs">Earth Metrics</h2>
        <div className="space-y-2">
          {/* Schumann Resonance Accordion */}
          <div className="collapse collapse-arrow border border-zinc-800">
            <input type="radio" name="earth-accordion-desktop" defaultChecked />
            <div className="collapse-title text-sm font-medium">
              Schumann Resonance
            </div>
            <div className="collapse-content">
              <p className="text-2xl font-bold mb-2">{earthData.schumann.frequency.toFixed(2)} Hz</p>
              <div className="h-24">
                <Line 
                  data={{
                    labels: ['00:00', '06:00', '12:00', '18:00'],
                    datasets: [{
                      label: 'Frequency',
                      data: [7.83, earthData.schumann.frequency, earthData.schumann.frequency, earthData.schumann.frequency],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.4
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { display: false }, x: { display: false } }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Solar Activity Accordion */}
          <div className="collapse collapse-arrow border  border-zinc-800">
            <input type="radio" name="earth-accordion-desktop" />
            <div className="collapse-title text-sm font-medium">
              Solar Activity
            </div>
            <div className="collapse-content">
              <div className="space-y-2">
                <p>Kp Index: <span className="font-bold">{earthData.solarActivity.kpIndex}</span></p>
                <p>Solar Wind: <span className="font-bold">{Math.round(earthData.solarActivity.solarWindSpeed)} km/s</span></p>
                {earthData.solarActivity.solarFlares.length > 0 && (
                  <div className="text-warning text-sm">
                    {earthData.solarActivity.solarFlares[0]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Geomagnetic Activity Accordion */}
          <div className="collapse collapse-arrow border border-zinc-800">
            <input type="radio" name="earth-accordion-desktop" />
            <div className="collapse-title text-sm font-medium">
              Geomagnetic Activity
            </div>
            <div className="collapse-content">
              <div className="space-y-2">
                <p>Global Index: <span className="font-bold">{earthData.geomagneticActivity.globalIndex.toFixed(2)}</span></p>
                <p>Local Strength: <span className="font-bold">{Math.round(earthData.geomagneticActivity.localStrength)} nT</span></p>
                {earthData.geomagneticActivity.anomalies.length > 0 && (
                  <div className="text-warning text-sm">
                    {earthData.geomagneticActivity.anomalies[0]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Global Coherence Accordion */}
          <div className="collapse collapse-arrow border border-zinc-800">
            <input type="radio" name="earth-accordion-desktop" />
            <div className="collapse-title text-sm font-medium">
              Global Coherence
            </div>
            <div className="collapse-content">
              <div className="space-y-2">
                <p>Coherence: <span className="font-bold">{earthData.coherenceData.globalCoherence.toFixed(3)}</span></p>
                <p>Active Nodes: <span className="font-bold">{earthData.coherenceData.activeNodes}</span></p>
                <p>Frequency: <span className="font-bold">{earthData.coherenceData.dominantFrequency.toFixed(2)} Hz</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 