type VerticalTimelineProps = {
  years: number[];
  currentIndex: number;
  height: number;
  graphRight: number;
};

export default function VerticalTimeline({
  years,
  currentIndex,
  height,
  graphRight
}: VerticalTimelineProps) {
  const lineX = graphRight + 40;
  const stepHeight = (height - 150) / years.length;

  return (
    <g>
      {/* Vertical line */}
      <line
        x1={lineX}
        x2={lineX}
        y1={75}
        y2={height - 75}
        stroke="peachpuff"
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
              r={4}
              fill={isCurrent ? "white" : "peachpuff"}
              stroke="peachpuff"
              strokeWidth={2}
            />
            {isCurrent && (
              <text
                x={lineX + 8}
                y={y + 2}
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
