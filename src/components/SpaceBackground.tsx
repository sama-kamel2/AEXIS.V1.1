import { useCallback, useEffect, useRef } from 'react';
import Particles from 'react-tsparticles';
import { loadStarsPreset } from 'tsparticles-preset-stars';
import type { Engine } from 'tsparticles-engine';

export default function SpaceBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadStarsPreset(engine);
  }, []);

  return (
    <>
      <div className="fixed inset-0 space-gradient -z-10" />
      <div className="fixed inset-0 nebula-gradient -z-10" />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          preset: 'stars',
          background: {
            opacity: 0,
          },
          particles: {
            number: {
              value: 150,
              density: {
                enable: true,
              },
            },
            color: {
              value: ['#ffffff', '#60a5fa', '#10b981'],
            },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: 1,
              },
            },
            size: {
              value: { min: 1, max: 3 },
            },
            move: {
              enable: true,
              speed: 0.3,
            },
          },
        }}
        className="fixed inset-0 -z-10"
      />
      <FloatingPlanets />
    </>
  );
}

function FloatingPlanets() {
  return (
    <>
      <div
        className="fixed top-20 right-1/4 w-24 h-24 rounded-full floating-planet opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #f97316, #ea580c)',
          animationDelay: '0s',
        }}
      />
      <div
        className="fixed bottom-1/4 left-1/4 w-32 h-32 rounded-full floating-planet opacity-15"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #3b82f6, #1d4ed8)',
          animationDelay: '2s',
        }}
      />
      <div
        className="fixed top-1/3 left-1/3 w-16 h-16 rounded-full floating-planet opacity-25"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #10b981, #059669)',
          animationDelay: '4s',
        }}
      />
    </>
  );
}
