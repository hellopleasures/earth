import { EarthData } from '@/services/earth-monitoring';

interface StatusBarsProps {
  earthData: EarthData;
}

export function StatusBars({ earthData }: StatusBarsProps) {
  return (
    <div className="">
      <div className="card-body p-2">
        <h2 className="card-title text-xs">System Status</h2>
        <div className="space-y-2">
          {/* Schumann Resonance */}
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
          
          {/* Solar Activity */}
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
  );
} 