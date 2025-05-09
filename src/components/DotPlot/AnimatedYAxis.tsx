import { Group } from "@visx/group";
// import { ScaleLogarithmic } from "@visx/scale";
import { motion } from "framer-motion";

type Props = {
  // scale: ScaleLogarithmic<number, number>;
  scale: any;
  x: number;
  height: number;
  label?: string;
  tickFormat?: (tick: number) => string;
  tickSize?: number;
};

export default function AnimatedYAxis({
  scale,
  x,
  label,
  tickFormat = (d) => `${d}`,
  tickSize = 6,
}: Props) {
  const ticks = scale.ticks().filter((t: number) => Number.isFinite(t));

  return (
    <Group left={x}>
      <motion.line
        y1={scale.range()[0]}
        y2={scale.range()[1]}
        x1={0}
        x2={0}
        stroke="#333"
      />
      {ticks.map((tick: number, i: number) => {
        const pos = scale(tick);
        return (
          <motion.g key={i} animate={{ y: pos }} initial={false} transition={{ duration: 0.6 }}>
            <line x2={-tickSize} stroke="#333" />
            <text
              x={-tickSize - 4}
              dy="0.32em"
              textAnchor="end"
              fontSize={10}
              fill="#333"
            >
              {tickFormat(tick)}
            </text>
          </motion.g>
        );
      })}
      {label && (
        <text
          transform={`
      translate(${-50}, ${(scale.range()[0] + scale.range()[1]) / 2})
      rotate(-90)
    `}
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
