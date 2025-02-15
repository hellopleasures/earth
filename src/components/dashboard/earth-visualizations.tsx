import { useEffect, useState } from 'react';
import { Line, Radar, Doughnut } from 'react-chartjs-2';
import { EarthData } from '@/services/earth-monitoring';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function EarthVisualizations({ data }: { data: EarthData }) {
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<{
    schumann: number[];
    coherence: number[];
    geomagneticStrength: number[];
  }>({
    schumann: [],
    coherence: [],
    geomagneticStrength: [],
  });

  useEffect(() => {
    // Update time labels every minute
    const updateTimeLabels = () => {
      const now = new Date();
      const labels = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getTime() - (11 - i) * 5 * 60000);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
      setTimeLabels(labels);
    };

    updateTimeLabels();
    const interval = setInterval(updateTimeLabels, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update historical data
    setHistoricalData(prev => ({
      schumann: [...prev.schumann.slice(-11), data.schumann.frequency],
      coherence: [...prev.coherence.slice(-11), data.coherenceData.globalCoherence],
      geomagneticStrength: [...prev.geomagneticStrength.slice(-11), data.geomagneticActivity.localStrength],
    }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Schumann Resonance Trends</h2>
          <div className="h-64">
            <Line
              data={{
                labels: timeLabels,
                datasets: [{
                  label: 'Frequency (Hz)',
                  data: historicalData.schumann,
                  borderColor: 'rgb(75, 192, 192)',
                  fill: true,
                  backgroundColor: 'rgba(75, 192, 192, 0.1)',
                }]
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: false,
                    suggestedMin: 7.5,
                    suggestedMax: 8.2,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Global Coherence Pattern</h2>
          <div className="h-64">
            <Radar
              data={{
                labels: ['Schumann', 'Solar', 'Geomagnetic', 'Coherence', 'Nodes'],
                datasets: [{
                  label: 'Current State',
                  data: [
                    data.schumann.amplitude,
                    data.solarActivity.kpIndex,
                    data.geomagneticActivity.globalIndex,
                    data.coherenceData.globalCoherence,
                    data.coherenceData.activeNodes / 100,
                  ],
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgb(75, 192, 192)',
                  pointBackgroundColor: 'rgb(75, 192, 192)',
                }]
              }}
              options={{
                responsive: true,
                scales: {
                  r: {
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 