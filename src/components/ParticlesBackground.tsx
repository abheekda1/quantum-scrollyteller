import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={init}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "peachpuff" },
        particles: {
          number: { value: 80, density: { enable: true, area: 800 } },
          color: { value: "#ffffff" },
          opacity: {
            value: 0.8,
            animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
          },
          size: {
            value: { min: 1, max: 2 },
            animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false }
          },
          move: { enable: true, speed: 0.5 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "bubble" } },
          modes: {
            bubble: {
              distance: 150,
              duration: 2,
              opacity: 0.6,
              size: 4,
            }
          }
        }
      }}
    />
  );
}
