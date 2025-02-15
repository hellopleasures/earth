import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the components to enable the "category" and other scales.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useEffect, useState } from 'react';
import { EarthData, fetchEarthData } from '@/services/earth-monitoring';
import { Line } from 'react-chartjs-2';
import { EarthGlobe } from './earth-globe';

interface EarthStatusProps {
  conversation: { role: 'user' | 'earth', content: string }[];
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function EarthStatus({ conversation, message, setMessage, handleSubmit }: EarthStatusProps) {
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Mobile Layout - Stack everything */}
      <div className="md:hidden flex flex-col flex-1">
        {/* Status Bars */}
        <div className="p-2">
          <div className="card bg-base-200 shadow-xl mb-2">
            <div className="card-body p-2">
              <h2 className="card-title text-xs">System Status</h2>
              <div className="space-y-2">
                {/* Status bars content... */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Schumann Resonance</span>
                    <span className="text-xs">{earthData.schumann.frequency.toFixed(2)} Hz</span>
                  </div>
                  <progress 
                    className="progress progress-primary" 
                    value={earthData.schumann.frequency} 
                    max="10"
                  ></progress>
                </div>
                
                {/* Solar Activity Status */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Solar Activity</span>
                    <span className="text-xs">Kp {earthData.solarActivity.kpIndex}</span>
                  </div>
                  <progress 
                    className="progress progress-secondary" 
                    value={earthData.solarActivity.kpIndex} 
                    max="9"
                  ></progress>
                </div>

                {/* Geomagnetic Activity */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Geomagnetic Activity</span>
                    <span className="text-xs">{earthData.geomagneticActivity.globalIndex.toFixed(1)}</span>
                  </div>
                  <progress 
                    className="progress progress-accent" 
                    value={earthData.geomagneticActivity.globalIndex} 
                    max="7"
                  ></progress>
                </div>

                {/* Global Coherence */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Global Coherence</span>
                    <span className="text-xs">{earthData.coherenceData.globalCoherence.toFixed(2)}</span>
                  </div>
                  <progress 
                    className="progress progress-info" 
                    value={earthData.coherenceData.globalCoherence} 
                    max="1"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Menu */}
        <div className="p-2">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-2">
              <div className="space-y-2">
                {/* Existing accordion items... */}
                <div className="collapse collapse-arrow bg-base-100">
                  <input type="radio" name="earth-accordion" defaultChecked /> 
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
                <div className="collapse collapse-arrow bg-base-100">
                  <input type="radio" name="earth-accordion" />
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
                <div className="collapse collapse-arrow bg-base-100">
                  <input type="radio" name="earth-accordion" />
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
                <div className="collapse collapse-arrow bg-base-100">
                  <input type="radio" name="earth-accordion" />
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
        </div>

        {/* Chat Section */}
        <div className="p-2 flex-1">
          <div className="card bg-base-200 shadow-xl h-full flex flex-col">
            <div className="card-body p-2 flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}
                  >
                    <div className={`chat-bubble ${
                      msg.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="mt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask Earth anything..."
                    className="input input-bordered input-sm flex-1"
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Quadrants */}
      <div className="hidden md:flex flex-col h-full">
        {/* Top Row */}
        <div className="flex flex-1">
          {/* Top Left Quadrant - Earth Globe */}
          <div className="w-1/2 p-2">
            <div className="card bg-base-200 shadow-xl h-full">
              <div className="card-body p-1">
                <h2 className="card-title text-xs">Earth Monitoring Network</h2>
                <div className="h-full">
                  <EarthGlobe data={earthData} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Right Quadrant - Accordion Menu */}
          <div className="w-1/2 p-2">
            <div className="card bg-base-200 shadow-xl h-full overflow-y-auto">
              <div className="card-body p-2">
                <div className="space-y-2">
                  {/* Schumann Resonance Accordion */}
                  <div className="collapse collapse-arrow bg-base-100">
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
                  <div className="collapse collapse-arrow bg-base-100">
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
                  <div className="collapse collapse-arrow bg-base-100">
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
                  <div className="collapse collapse-arrow bg-base-100">
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
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-1">
          {/* Bottom Left Quadrant - Status Bars */}
          <div className="w-1/2 p-2">
            <div className="card bg-base-200 shadow-xl h-full">
              <div className="card-body p-2">
                <h2 className="card-title text-xs">System Status</h2>
                <div className="space-y-2">
                  {/* Status bars content... */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Schumann Resonance</span>
                      <span className="text-xs">{earthData.schumann.frequency.toFixed(2)} Hz</span>
                    </div>
                    <progress 
                      className="progress progress-primary" 
                      value={earthData.schumann.frequency} 
                      max="10"
                    ></progress>
                  </div>
                  
                  {/* Solar Activity Status */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Solar Activity</span>
                      <span className="text-xs">Kp {earthData.solarActivity.kpIndex}</span>
                    </div>
                    <progress 
                      className="progress progress-secondary" 
                      value={earthData.solarActivity.kpIndex} 
                      max="9"
                    ></progress>
                  </div>

                  {/* Geomagnetic Activity */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Geomagnetic Activity</span>
                      <span className="text-xs">{earthData.geomagneticActivity.globalIndex.toFixed(1)}</span>
                    </div>
                    <progress 
                      className="progress progress-accent" 
                      value={earthData.geomagneticActivity.globalIndex} 
                      max="7"
                    ></progress>
                  </div>

                  {/* Global Coherence */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Global Coherence</span>
                      <span className="text-xs">{earthData.coherenceData.globalCoherence.toFixed(2)}</span>
                    </div>
                    <progress 
                      className="progress progress-info" 
                      value={earthData.coherenceData.globalCoherence} 
                      max="1"
                    ></progress>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Quadrant - Chat */}
          <div className="w-1/2 p-2">
            <div className="card bg-base-200 shadow-xl h-full flex flex-col">
              <div className="card-body p-2 flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}
                    >
                      <div className={`chat-bubble ${
                        msg.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask Earth anything..."
                      className="input input-bordered input-sm flex-1"
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 