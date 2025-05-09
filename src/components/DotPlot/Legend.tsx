type LegendProps = {
  x: number;
  y: number;
};

export default function Legend({ x, y }: LegendProps) {
  const squareSize = 12;
  const circleRadius = 6;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* <rect width="130" height="50" fill="white" stroke="#ccc" rx="6" ry="6" /> */}

      {/* Superconducting */}
      <rect
        x={10}
        y={10}
        width={squareSize}
        height={squareSize}
        fill="blue"
        fillOpacity={0.5}
        stroke="blue"
        strokeOpacity={0.9}
      />
      <text x={30} y={20} fontSize={12} alignmentBaseline="middle">
        Superconducting
      </text>

      {/* Trapped ion */}
      <circle
        cx={16}
        cy={35}
        r={circleRadius}
        fill="orange"
        fillOpacity={0.5}
        stroke="orange"
        strokeOpacity={0.9}
      />
      <text x={30} y={35} fontSize={12} alignmentBaseline="middle">
        Trapped ion
      </text>
    </g>
  );
}
