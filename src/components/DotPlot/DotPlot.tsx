import { Group } from "@visx/group";
import { scaleLog } from "@visx/scale";
import { motion, AnimatePresence } from "framer-motion";
import { min, max } from "d3-array";
import Legend from "./Legend";
import AnimatedAxis from "./AnimatedAxis";
import VerticalTimeline from "../VerticalTimeline";
import AnimatedYAxis from "./AnimatedYAxis";
import AnimatedXAxis from "./AnimatedXAxis";

type Point = {
    year: number;
    type: string;
    err: number;
    connectivity: number;
    qubits: number;
};

export default function DotPlot({ points, currentIdx }: { points: Point[], currentIdx: number }) {
    const width = 600;
    const height = 600;
    // const margin = 100;
    const xmargin = 75;
    const ymargin = 75;

    // Determine min/max for log scales, clamp to safe log range (>= 1 or > 0)
    const minQubits = Math.max(1, min(points, p => p.qubits) ?? 1);
    const maxQubits = Math.max(minQubits * 1.1, max(points, p => p.qubits) ?? 10);

    const minErr = Math.max(1e-6, min(points, p => p.err) ?? 1e-3);
    const maxErr = Math.min(1, max(points, p => p.err) ?? 1);

    const xScale = scaleLog({
        domain: [1, Math.pow(10, Math.ceil(Math.log10(maxQubits)))],
        // domain: [1, maxQubits],
        range: [xmargin, width - xmargin],
        base: 10,
        clamp: true,
    });

    const yScale = scaleLog({
        domain: [1, Math.pow(10, Math.floor(Math.log10(minErr)))],
        range: [height - ymargin, ymargin],
        base: 10,
        clamp: true,
    });

    return (
        <svg width={width} height={height} style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'white', zIndex: 10, boxShadow: '0 0 8px rgba(0,0,0,0.2)'
        }}>
            <text
                x={width / 2}
                y={30}
                textAnchor="middle"
                fontSize={18}
                fontWeight="bold"
            >
                {/* Quantum Hardware Performance Over Time */}
                Bridging the Gap
            </text>
            <text
                x={width / 2}
                y={50}
                textAnchor="middle"
                fontSize={14}
                fill="#666"
            >
                Qubits vs Error Rate by Technology Type
            </text>
            <Group>
                <AnimatedXAxis
                    scale={xScale}
                    y={height - ymargin}
                    width={width}
                    label="Number of physical qubits"
                    tickFormat={(d) => Number.isInteger(Math.log10(d)) ? `10^${Math.log10(d)}` : ''}
                />

                <AnimatedYAxis
                    scale={yScale}
                    x={xmargin}
                    height={height}
                    label="Average two-qubit gate error rate"
                    tickFormat={(d) => Number.isInteger(Math.log10(d)) ? `10^${Math.log10(d)}` : ''}
                />

                <Legend x={xmargin} y={ymargin} />

                <AnimatePresence>
                    {points.map((p) => {
                        const size = p.connectivity * 4;
                        const color = p.type === "trapped ion" ? "orange" : "blue";
                        const cx = xScale(p.qubits);
                        const cy = yScale(p.err);
                        return <motion.g
                            key={p.year}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {p.type === "trapped ion" ? (
                                <motion.circle
                                    animate={{
                                        cx: cx,
                                        cy: cy,
                                    }}
                                    transition={{ duration: 0.6 }}
                                    cx={cx}
                                    cy={cy}
                                    r={size}
                                    fill={color}
                                    fillOpacity={0.5}
                                    stroke={color}
                                    strokeWidth={p.connectivity}
                                    strokeOpacity={0.9}
                                />
                            ) : (
                                <motion.rect
                                    initial={{ x: cx - size, y: cy - size }}
                                    animate={{ x: cx - size, y: cy - size }}
                                    transition={{ duration: 0.6 }}
                                    width={size * 2}
                                    height={size * 2}
                                    fill={color}
                                    fillOpacity={0.5}
                                    stroke={color}
                                    strokeWidth={p.connectivity}
                                    strokeOpacity={0.9}
                                />
                            )}
                            <motion.text
                                initial={{ x: cx, y: cy - size - 5 }}
                                animate={{ x: cx, y: cy - size - 5 }}
                                transition={{ duration: 0.6 }}
                                textAnchor="middle"
                                fontSize={12}
                            >
                                {p.year}
                            </motion.text>


                        </motion.g>
                    })}

                    <VerticalTimeline
                        years={points.map(p => p.year)}
                        currentIndex={currentIdx}
                        height={height}
                        graphRight={width - xmargin}
                    />
                </AnimatePresence>
            </Group>
        </svg >
    );
}
