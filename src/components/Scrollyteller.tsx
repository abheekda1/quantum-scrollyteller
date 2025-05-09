import { useEffect, useRef, useState } from "react";
import scrollama from "scrollama";
import { motion } from "framer-motion";
import DotPlot from "./DotPlot/DotPlot";
import ParticlesBackground from "./ParticlesBackground";

type Point = {
    year: number;
    type: string;
    err: number;
    connectivity: number;
    qubits: number;
    info?: string;
};

const introParagraphs = [
  "Quantum computers today are in their infancy—bulky, expensive, and error-prone—much like classical computers were in the 1950s.",
  "Despite current limitations, researchers and companies around the world are rapidly advancing hardware, software, and theory to scale up quantum computing power.",
  "We are now entering a pivotal era where small quantum devices are capable of real computation, unlocking new possibilities in simulation, optimization, and beyond."
];

export default function Scrollyteller() {
    const [data, setData] = useState<Point[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const outroRef = useRef<HTMLDivElement | null>(null);
    const scrollerRef = useRef<ReturnType<typeof scrollama> | null>(null);

    useEffect(() => {
        fetch("/data.json")
            .then(res => res.json())
            .then(json => setData(json.points));
    }, []);

    useEffect(() => {
        if (data.length > 0 && outroRef.current) {
            stepRefs.current[data.length + introParagraphs.length + 1] = outroRef.current;
        }
    }, [data]);

    useEffect(() => {
        if (data.length === 0) return;

        const steps = stepRefs.current.filter(Boolean);
        const scroller = scrollama();
        scrollerRef.current = scroller;

        scroller
        // @ts-ignore
            .setup({ step: steps, offset: 0.5 })
            .onStepEnter(response => setCurrentIndex(response.index));

        return () => {
            scrollerRef.current?.destroy();
            scrollerRef.current = null;
        };
    }, [data]);

    const visibleData =
        currentIndex > introParagraphs.length &&
            currentIndex <= data.length + introParagraphs.length
            ? data.slice(0, currentIndex - introParagraphs.length)
            : [];

    // const isInNonGraphSection = currentIndex <= introParagraphs.length || currentIndex === data.length + introParagraphs.length + 1;

    return (
        <>
        {/* {isInNonGraphSection && <ParticlesBackground />} */}
        <ParticlesBackground />
            {/* === DotPlot === */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: currentIndex <= data.length + introParagraphs.length ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ pointerEvents: "none", zIndex: 0 }}
            >
                {currentIndex > introParagraphs.length && (
                    <DotPlot
                        points={visibleData}
                        currentIdx={currentIndex - introParagraphs.length}
                        allYears={data.map(p => p.year)}
                    />
                )}
            </motion.div>

            {/* === Intro Title === */}
            <motion.div
                className="step"
                // @ts-ignore
                ref={el => (stepRefs.current[0] = el)}
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{
                        opacity: currentIndex === 0 ? 1 : 0,
                        scale: currentIndex === 0 ? 1 : 1.05,
                        y: currentIndex === 0 ? 0 : -40,
                    }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: "center" }}
                >
                    <div style={{ fontSize: "3rem", fontWeight: "bold" }}>Quantum Computing</div>
                    <div style={{ fontSize: "1.5rem", marginTop: "0.5rem", color: "#666" }}>
                        From Theory to Hardware
                    </div>
                </motion.div>
            </motion.div>

            {/* === Fading Paragraphs === */}
            {introParagraphs.map((text, i) => (
                <motion.div
                    className="step"
                    key={`para-${i}`}
                    // @ts-ignore
                    ref={el => (stepRefs.current[i + 1] = el)}
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        color: "#444",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: currentIndex === i + 1 ? 1 : 0,
                            y: currentIndex === i + 1 ? 0 : -20,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ maxWidth: "60ch" }}
                    >
                        {text}
                    </motion.div>
                </motion.div>
            ))}

            {/* === Year Steps === */}
            {data.map((point, i) => (
                <div
                    className="step"
                    key={i + introParagraphs.length + 1}
                    // @ts-ignore
                    ref={el => (stepRefs.current[i + introParagraphs.length + 1] = el)}
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: i % 2 === 0 ? "right" : "left",
                        fontSize: "2rem",
                        // borderBottom: "1px solid #eee",
                        padding: "1rem",
                    }}
                >
                    <div>
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{point.year}</div>
                        {point.info && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    marginTop: "0.5rem",
                                    fontSize: "1.2rem",
                                    maxWidth: "30ch",
                                    color: "#444",
                                    background: "#f4f4f4",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                }}
                            >
                                {point.info}
                            </motion.div>
                        )}
                    </div>
                </div>
            ))}

            {/* === Outro Step === */}
            <motion.div
                className="step"
                ref={outroRef}
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{
                        opacity: currentIndex === data.length + introParagraphs.length + 1 ? 1 : 0,
                        scale: currentIndex === data.length + introParagraphs.length + 1 ? 1 : 1.02,
                        y: currentIndex === data.length + introParagraphs.length + 1 ? 0 : -20,
                    }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: "center" }}
                >
                    <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Looking Ahead</div>
                    <div style={{ fontSize: "1.3rem", marginTop: "0.5rem", color: "#666" }}>
                        Shor's Algo, Grover's Algo, Quantum Simulation, Quantum Optimizations
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
