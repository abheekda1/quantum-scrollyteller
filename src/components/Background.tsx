import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export default function ParticlesBackground() {
    const init = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={init}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -50,
            }}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1,
                },
                background: {
                    color: "#ffffff",
                },
                particles: {
                    number: {
                        value: 40,
                        density: { enable: true, area: 800 },
                    },
                    color: { value: "#999" },
                    shape: {
                        type: "circle",
                    },
                    opacity: {
                        value: 0.2,
                        random: true,
                    },
                    size: {
                        value: { min: 1, max: 2 },
                        random: true,
                    },
                    move: {
                        enable: true,
                        speed: 0.2,
                        direction: "none",
                        straight: false,
                        outModes: { default: "out" },
                    },
                    links: {
                        enable: false
                    }
                },
                interactivity: {
                    events: {
                        onHover: { enable: false },
                        onClick: { enable: false },
                    }
                }
            }}
        />
    );
}
