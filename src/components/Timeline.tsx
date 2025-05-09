import { useEffect, useRef, useState } from "react";
import scrollama from "scrollama";
import { motion, AnimatePresence } from "framer-motion";
import DotPlot from "./DotPlot";

type Point = {
    year: number;
    type: string;
    err: number;
    connectivity: number;
    qubits: number;
};

export default function Timeline() {
    const [data, setData] = useState<Point[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollerRef = useRef<ReturnType<typeof scrollama> | null>(null);

    // Load data.json
    useEffect(() => {
        fetch("/data.json")
            .then(res => res.json())
            .then(json => setData(json.points));
    }, []);

    // Set up Scrollama once data is loaded
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

    // Determine visible graph data
    const visibleData =
        currentIndex > 0 && currentIndex <= data.length
            ? data.slice(0, currentIndex)
            : [];

    return (
        <>
            {/* === DOT PLOT === */}
            {visibleData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <DotPlot points={visibleData} />
                </motion.div>
            )}
            {/* <DotPlot points={visibleData} /> */}

            {/* === INTRO STEP === */}
            <motion.div
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
                    key={i + 1}
                    ref={el => (stepRefs.current[i + 1] = el)}
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: i & 1 ? "left" : "right",
                        fontSize: "2rem",
                        borderBottom: "1px solid #eee",
                        padding: "1rem"
                    }}
                >
                    {point.year}
                </div>
            ))}

            {/* === OUTRO STEP === */}
            <motion.div
                ref={el => (stepRefs.current[data.length + 1] = el)}
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
                        The future of quantum hardware is just beginning.
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
