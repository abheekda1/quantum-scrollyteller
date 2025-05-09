import { Group } from "@visx/group";
import { scaleLog } from "@visx/scale";
import { Scale } from '@visx/visx';
import { motion } from "framer-motion";

type Props = {
  scale: any;
  orientation: "bottom" | "left";
  length: number;
  label?: string;
  offset?: number;
  tickFormat?: (tick: number) => string;
  tickSize?: number;
};

export default function AnimatedAxis({
  scale,
  orientation,
  length,
  label,
  offset = 30,
  tickFormat = (d) => `${d}`,
  tickSize = 6,
}: Props) {
  const ticks = scale.ticks().filter(t => Number.isFinite(t));

  return (
    <Group
      top={orientation === "bottom" ? length : 0}
      left={orientation === "left" ? 0 : undefined}
    >
      {/* Axis Line */}
      <motion.line
        x1={orientation === "bottom" ? scale.range()[0] : 0}
        x2={orientation === "bottom" ? scale.range()[1] : 0}
        y1={orientation === "left" ? scale.range()[0] : 0}
        y2={orientation === "left" ? scale.range()[1] : 0}
        stroke="#333"
      />

      {/* Ticks */}
      {ticks.map((tick, i) => {
        const pos = scale(tick);
        const isBottom = orientation === "bottom";

        return (
          <motion.g
            key={i}
            animate={isBottom ? { x: pos } : { y: pos }}
            transition={{ duration: 0.6 }}
          >
            <line
              x1={isBottom ? 0 : -tickSize}
              x2={isBottom ? 0 : 0}
              y1={isBottom ? 0 : 0}
              y2={isBottom ? tickSize : 0}
              stroke="#333"
            />
            <text
              x={isBottom ? 0 : -offset / 2}
              y={isBottom ? offset : 0}
              dy={isBottom ? "0.71em" : "0.32em"}
              textAnchor="middle"
              fontSize={10}
              fill="#333"
            >
              {tickFormat(tick)}
            </text>
          </motion.g>
        );
      })}

      {/* Axis Label */}
      {label && (
        <text
          x={orientation === "bottom" ? (scale.range()[0] + scale.range()[1]) / 2 : -offset}
          y={orientation === "bottom" ? offset * 1.8 : (scale.range()[0] + scale.range()[1]) / 2}
          textAnchor="middle"
          transform={orientation === "left" ? "rotate(-90)" : undefined}
          fontSize={12}
          fontWeight="bold"
          fill="#333"
        >
          {label}
        </text>
      )}
    </Group>
  );
}
