import { useEffect, useRef, useMemo } from 'react';
import Globe from 'globe.gl';
import { EarthData } from '@/services/earth-monitoring';
import * as THREE from 'three';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  value: number;
}

interface MagneticFieldLine {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  strength: number;
  isAnomaly?: boolean;
}

// Monitoring station coordinates
const MONITORING_STATIONS = [
  { lat: 37.8044, lng: -122.2712, name: 'California Station' },
  { lat: 51.5074, lng: -0.1278, name: 'London Station' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney Station' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo Station' },
  { lat: 25.2048, lng: 55.2708, name: 'Dubai Station' },
  { lat: -1.2921, lng: 36.8219, name: 'Nairobi Station' },
  { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires Station' },
  { lat: 60.1699, lng: 24.9384, name: 'Helsinki Station' },
];

const MAGNETIC_FIELD_POINTS = Array.from({ length: 100 }, (_, i) => {
  const lat = (Math.random() - 0.5) * 180;
  const lng = (Math.random() - 0.5) * 360;
  return { lat, lng };
});

const generateMagneticFieldLine = (startLat: number, startLng: number, endLat: number, endLng: number) => {
  const points = [];
  const segments = 50;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = startLat + (endLat - startLat) * t;
    const lng = startLng + (endLng - startLng) * t;
    const height = Math.sin(t * Math.PI) * 0.3; // Arc height
    
    points.push([lng, lat, height]);
  }
  
  return points;
};

const MAGNETIC_FIELD_LINES = [
  // Main dipole field lines
  ...Array.from({ length: 8 }, (_, i) => {
    const lng = (i * 45) % 360;
    return { 
      start: { lat: 85, lng }, 
      end: { lat: -85, lng: (lng + 180) % 360 },
      strength: 1.0 
    };
  }),
  // Secondary field lines
  ...Array.from({ length: 12 }, (_, i) => {
    const lng = (i * 30) % 360;
    const lat = 60;
    return {
      start: { lat, lng },
      end: { lat: -lat, lng: (lng + 150) % 360 },
      strength: 0.7
    };
  }),
  // Anomaly field lines (based on known magnetic anomalies)
  { 
    start: { lat: -20, lng: -60 }, // South Atlantic Anomaly
    end: { lat: 20, lng: -30 },
    strength: 0.4,
    isAnomaly: true
  }
];

const getFieldLineColor = (strength: number, isAnomaly: boolean) => {
  if (isAnomaly) {
    return new THREE.Color(0xff3366);
  }
  return new THREE.Color(0x3366ff).lerp(new THREE.Color(0x00ff99), 1 - strength);
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="card bg-error text-error-content p-4">
      <h2 className="font-bold">Error loading Earth visualization</h2>
      <pre className="text-sm mt-2">{error.message}</pre>
    </div>
  );
}

// Custom error boundary to catch errors in this component.
class CustomErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('CustomErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

export function EarthGlobe({ data }: { data: EarthData }) {
  const globeEl = useRef<HTMLDivElement>(null);
  const globe = useRef<InstanceType<typeof Globe> | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);

  const generateParticles = () => {
    const particles = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 1.5 + Math.random() * 0.3;
      
      positions[i] = r * Math.sin(theta) * Math.cos(phi);
      positions[i + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i + 2] = r * Math.cos(theta);

      // Add velocity components
      velocities[i] = (Math.random() - 0.5) * 0.002;
      velocities[i + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i + 2] = (Math.random() - 0.5) * 0.002;

      // Add color components
      const intensity = Math.random();
      colors[i] = 0.5 + intensity * 0.5;     // R
      colors[i + 1] = 0.7 + intensity * 0.3;  // G
      colors[i + 2] = 1.0;                    // B
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return particles;
  };

  useEffect(() => {
    if (!globeEl.current) return;

    let mounted = true;
    let animationId: number;
    const init = async () => {
      try {
        const element = globeEl.current as HTMLElement;
        
        globe.current = new Globe(element)
          .backgroundColor('rgba(0,0,0,0)')
          .width(600)         // Set fixed width
          .height(600)        // Set fixed height
          .globeImageUrl('/earth-blue-marble.jpg')
          .bumpImageUrl('/earth-topology.png')
          .showAtmosphere(true)
          .atmosphereColor('lightskyblue')
          .atmosphereAltitude(0.1)
          .pointsData(generateGlobePoints(data))
          .pointColor('color')
          .pointAltitude(0)
          .pointRadius('size')
          .pointLabel('label');

        if (!globe.current) return;

        const magneticFieldLines = MAGNETIC_FIELD_LINES.map(d => {
          if (!globe.current) return null;

          const curve = new THREE.CatmullRomCurve3(
            generateMagneticFieldLine(d.start.lat, d.start.lng, d.end.lat, d.end.lng)
              .map(([lng, lat, alt]) => {
                if (!globe.current) return new THREE.Vector3(0, 0, 0);
                const coord = globe.current.getCoords(lat, lng, alt);
                return new THREE.Vector3(coord.x, coord.y, coord.z);
              })
          );
          
          const geometry = new THREE.TubeGeometry(curve, 64, 0.003 * d.strength, 8, false);
          const material = new THREE.MeshPhongMaterial({
            color: getFieldLineColor(d.strength, (d as MagneticFieldLine).isAnomaly ?? false),
            transparent: true,
            opacity: 0.4 + ((d as MagneticFieldLine).isAnomaly ? 0.2 : 0),
            blending: THREE.AdditiveBlending,
            emissive: (d as MagneticFieldLine).isAnomaly ? 0x331111 : 0x112233,
            emissiveIntensity: (d as MagneticFieldLine).isAnomaly ? 0.5 : 0.2
          });
          
          return new THREE.Mesh(geometry, material);
        }).filter(Boolean);

        if (globe.current && globe.current.scene()) {
          magneticFieldLines.forEach(line => {
            if (line && globe.current && globe.current.scene()) {
              globe.current.scene().add(line);
            }
          });
        }

        // Add solar wind particles
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.01,
          color: 0xffffff,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        });

        particlesRef.current = new THREE.Points(generateParticles(), particlesMaterial);
        globe.current.scene().add(particlesRef.current);

        // Enhanced aurora shader
        const auroraGeometry = new THREE.SphereGeometry(1.02, 128, 128);
        const auroraMaterial = new THREE.ShaderMaterial({
          transparent: true,
          uniforms: {
            time: { value: 0 },
            intensity: { value: data.geomagneticActivity.globalIndex / 9 },
            solarActivity: { value: data.solarActivity.kpIndex / 9 },
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec2 vUv;
            void main() {
              vNormal = normal;
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float intensity;
            uniform float solarActivity;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            float randNoise(vec2 p) {
              return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            void main() {
              float aurora = pow(abs(vNormal.y), 8.0) * intensity;
              float wave = sin(time * 0.5 + vUv.x * 10.0 + vUv.y * 5.0);
              float noiseVal = randNoise(vUv * 10.0 + time);
              
              vec3 baseColor = mix(
                vec3(0.1, 0.5, 0.2),
                vec3(0.2, 0.8, 0.4),
                wave
              );
              
              vec3 activeColor = mix(
                baseColor,
                vec3(0.5, 0.8, 1.0),
                solarActivity * noiseVal
              );
              
              float alpha = aurora * (0.5 + 0.5 * wave) * (0.8 + 0.2 * noiseVal);
              gl_FragColor = vec4(activeColor, alpha * intensity);
            }
          `,
        });

        const auroraMesh = new THREE.Mesh(auroraGeometry, auroraMaterial);
        globe.current.scene().add(auroraMesh);

        // Add cloud layer
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = 'anonymous';

        const loadCloudTexture = () => {
          return new Promise((resolve, reject) => {
            textureLoader.load(
              '//unpkg.com/three-globe/example/img/clouds.png',
              resolve,
              undefined,
              reject
            );
          });
        };

        try {
          const cloudTexture = await loadCloudTexture();
          if (!mounted) return;
          
          const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
          const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudTexture as THREE.Texture,
            transparent: true,
            opacity: 0.4,
          });
          cloudRef.current = new THREE.Mesh(cloudGeometry, cloudMaterial);
          globe.current?.scene().add(cloudRef.current);
        } catch (error) {
          console.warn('Failed to load cloud texture:', error);
        }

        // Enhanced animation loop
        let time = 0;
        const animate = () => {
          if (!mounted) return;
          
          time += 0.01;
          
          if (particlesRef.current) {
            const geometry = particlesRef.current.geometry;
            const positions = geometry.attributes.position.array as Float32Array;
            const velocities = geometry.attributes.velocity.array as Float32Array;
            const colors = geometry.attributes.color.array as Float32Array;
            
            // Declare temporary vectors to avoid allocating new objects in each iteration
            const pos = new THREE.Vector3();
            const fieldDirection = new THREE.Vector3();
            
            for (let i = 0; i < positions.length; i += 3) {
              // Reuse the temporary vector for current position
              pos.set(positions[i], positions[i + 1], positions[i + 2]);
              const distance = pos.length();
              const magneticFieldStrength = (data.geomagneticActivity.globalIndex / 9) * 0.001;
              
              // Calculate magnetic field direction (simplified dipole field) by reusing another temporary vector
              fieldDirection.copy(pos).normalize();

              // Apply magnetic force to velocity
              velocities[i]     += fieldDirection.x * magneticFieldStrength;
              velocities[i + 1] += fieldDirection.y * magneticFieldStrength;
              velocities[i + 2] += fieldDirection.z * magneticFieldStrength;
              
              // Update position
              positions[i]     += velocities[i];
              positions[i + 1] += velocities[i + 1];
              positions[i + 2] += velocities[i + 2];
              
              // Reset particles that go too far
              if (distance > 2) {
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                const r = 1.5;
                
                positions[i]     = r * Math.sin(theta) * Math.cos(phi);
                positions[i + 1] = r * Math.sin(theta) * Math.sin(phi);
                positions[i + 2] = r * Math.cos(theta);
                
                // Reset velocity
                velocities[i]     = (Math.random() - 0.5) * 0.002;
                velocities[i + 1] = (Math.random() - 0.5) * 0.002;
                velocities[i + 2] = (Math.random() - 0.5) * 0.002;
              }
    
              // Update particle color based on field strength
              const fieldStrength = Math.min(1, distance * magneticFieldStrength * 1000);
              colors[i]     = 0.5 + fieldStrength * 0.5;     // R
              colors[i + 1] = 0.7 + fieldStrength * 0.3;     // G
              colors[i + 2] = 1.0 - fieldStrength * 0.2;     // B
            }
            
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
          }
    
          if (cloudRef.current) {
            cloudRef.current.rotation.y += 0.0002;
          }
    
          // Update aurora uniforms
          const auroraMaterial = auroraMesh.material as THREE.ShaderMaterial;
          auroraMaterial.uniforms.time.value = time;
          
          animationId = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.error('Error initializing globe:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (globe.current) {
        if (particlesRef.current) {
          globe.current.scene().remove(particlesRef.current);
          particlesRef.current.geometry.dispose();
          (particlesRef.current.material as THREE.Material).dispose();
        }
        if (cloudRef.current) {
          globe.current.scene().remove(cloudRef.current);
          cloudRef.current.geometry.dispose();
          (cloudRef.current.material as THREE.Material).dispose();
        }
        globe.current._destructor();
      }
    };
  }, [data]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className=" w-full h-full flex justify-center items-center">
        <div 
          ref={globeEl} 
          className=" inset-0"
        />
      </div>
    </ErrorBoundary>
  );
}

function generateGlobePoints(data: EarthData): GlobePoint[] {
  return MONITORING_STATIONS.map(station => ({
    lat: station.lat,
    lng: station.lng,
    size: 0.5 + (data.geomagneticActivity.localStrength / 50000),
    color: `rgba(75, 192, 192, ${data.coherenceData.globalCoherence})`,
    label: station.name,
    value: data.geomagneticActivity.localStrength
  }));
} 