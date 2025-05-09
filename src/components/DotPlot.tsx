import { Group } from "@visx/group";
import { scaleLog } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { motion, AnimatePresence } from "framer-motion";
import { min, max } from "d3-array";
import Legend from "./Legend";

type Point = {
    year: number;
    type: string;
    err: number;
    connectivity: number;
    qubits: number;
};

function toSuperscript(n: number): string {
    const superscripts = {
        "-": "⁻",
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
    };
    return String(n).split("").map(c => superscripts[c as keyof typeof superscripts] || "").join("");
}

export default function DotPlot({ points }: { points: Point[] }) {
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
                <AxisBottom
                    top={height - ymargin}
                    scale={xScale}
                    label="Number of physical qubits"
                    labelOffset={20}
                    tickFormat={(d) => Number.isInteger(Math.log10(d)) ? `10^${Math.log10(d)}` : ''}
                />

                <AxisLeft
                    left={xmargin}
                    scale={yScale}
                    label="Average two-qubit gate error rate"
                    labelOffset={40}
                    tickFormat={(d) => Number.isInteger(Math.log10(d)) ? `10^${Math.log10(d)}` : ''}
                />

                <Legend x={width - 160} y={ymargin} />

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
                                <circle
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
                                <rect
                                    x={cx - size}
                                    y={cy - size}
                                    width={size * 2}
                                    height={size * 2}
                                    fill={color}
                                    fillOpacity={0.5}
                                    stroke={color}
                                    strokeWidth={p.connectivity}
                                    strokeOpacity={0.9}
                                />
                            )}
                            <text
                                x={xScale(p.qubits)}
                                y={yScale(p.err) - 15}
                                textAnchor="middle"
                                fontSize={12}
                            >
                                {p.year}
                            </text>
                        </motion.g>
                    })}
                </AnimatePresence>
            </Group>
        </svg>
    );
}
