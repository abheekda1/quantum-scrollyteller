type VerticalTimelineProps = {
  years: number[];
  currentIndex: number;
  height: number;
  graphRight: number; // x-position to anchor timeline
};

export default function VerticalTimeline({ years, currentIndex, height, graphRight }: VerticalTimelineProps) {
  const lineX = graphRight + 40;
  const stepHeight = (height - 150) / years.length;

  return (
    <g>
      <line
        x1={lineX}
        x2={lineX}
        y1={75}
        y2={height - 75}
        stroke="#ccc"
        strokeWidth={2}
      />
      {years.map((year, i) => {
        const y = 75 + i * stepHeight;
        const isCurrent = currentIndex - 1 === i;

        return (
          <g key={year}>
            <circle
              cx={lineX}
              cy={y}
              r={10}
              fill={isCurrent ? "#333" : "none"}
              stroke="#333"
              strokeWidth={2}
            />
            {isCurrent && (
              <text
                x={lineX + 20}
                y={y + 4}
                fontSize={12}
                fill="#333"
              >
                {year}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
