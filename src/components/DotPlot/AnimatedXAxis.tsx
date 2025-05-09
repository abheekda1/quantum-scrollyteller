import { Group } from "@visx/group";
// import { ScaleLogarithmic } from "@visx/scale";
import { motion } from "framer-motion";

type Props = {
//   scale: ScaleLogarithmic<number, number>;
scale: any;
  y: number;
  width: number;
  label?: string;
  tickFormat?: (tick: number) => string;
  tickSize?: number;
};

export default function AnimatedXAxis({
  scale,
  y,
  width,
  label,
  tickFormat = (d) => `${d}`,
  tickSize = 6,
}: Props) {
  const ticks = scale.ticks().filter(t => Number.isFinite(t));

  return (
    <Group top={y}>
      <motion.line
        x1={scale.range()[0]}
        x2={scale.range()[1]}
        y1={0}
        y2={0}
        stroke="#333"
      />
      {ticks.map((tick, i) => {
        const pos = scale(tick);
        return (
          <motion.g key={i} animate={{ x: pos }} initial={false} transition={{ duration: 0.6 }}>
            <line y2={tickSize} stroke="#333" />
            <text y={tickSize + 12} textAnchor="middle" fontSize={10} fill="#333">
              {tickFormat(tick)}
            </text>
          </motion.g>
        );
      })}
      {label && (
        <text
          x={(scale.range()[0] + scale.range()[1]) / 2}
          y={tickSize + 28}
          fontSize={12}
          fontWeight="bold"
          fill="#333"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </Group>
  );
}
