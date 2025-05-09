import { useEffect, useRef, useState } from "react";
import scrollama from "scrollama";
import { motion } from "framer-motion";
import DotPlot from "./DotPlot/DotPlot";

type Point = {
    year: number;
    type: string;
    err: number;
    connectivity: number;
    qubits: number;
    info?: string;
};

export default function Scrollyteller() {
    const [data, setData] = useState<Point[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const outroRef = useRef<HTMLDivElement | null>(null);
    const scrollerRef = useRef<ReturnType<typeof scrollama> | null>(null);

    // Load data
    useEffect(() => {
        fetch("/data.json")
            .then(res => res.json())
            .then(json => setData(json.points));
    }, []);

    // Assign outro ref
    useEffect(() => {
        if (data.length > 0 && outroRef.current) {
            stepRefs.current[data.length + 1] = outroRef.current;
        }
    }, [data]);

    // Setup scrollama
    useEffect(() => {
        if (data.length === 0) return;

        const steps = stepRefs.current.filter(Boolean);
        const scroller = scrollama();
        scrollerRef.current = scroller;

        scroller
            .setup({
                step: steps,
                offset: 0.5,
            })
            .onStepEnter(response => {
                setCurrentIndex(response.index);
            });

        return () => {
            scrollerRef.current?.destroy();
            scrollerRef.current = null;
        };
    }, [data]);

    const visibleData =
        currentIndex > 0 && currentIndex <= data.length
            ? data.slice(0, currentIndex)
            : [];

    return (
        <>
            {/* === DotPlot Fade Container === */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: currentIndex <= data.length ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ pointerEvents: "none", zIndex: 0 }}
            >
                {currentIndex > 0 && (
                    <DotPlot
                        points={visibleData}
                        currentIdx={currentIndex}
                        allYears={data.map(p => p.year)}
                    />
                )}
            </motion.div>

            {/* === INTRO STEP === */}
            <motion.div
                className="step"
                ref={el => (stepRefs.current[0] = el)}
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    overflow: "hidden",
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

            {/* === YEAR STEPS === */}
            {data.map((point, i) => (
                <div
                    className="step"
                    key={i + 1}
                    ref={el => (stepRefs.current[i + 1] = el)}
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: i % 2 === 0 ? "right" : "left",
                        fontSize: "2rem",
                        borderBottom: "1px solid #eee",
                        padding: "1rem"
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
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                                }}
                            >
                                {point.info}
                            </motion.div>
                        )}
                    </div>
                </div>
            ))}

            {/* === OUTRO STEP === */}
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
                        opacity: currentIndex === data.length + 1 ? 1 : 0,
                        scale: currentIndex === data.length + 1 ? 1 : 1.02,
                        y: currentIndex === data.length + 1 ? 0 : -20,
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
