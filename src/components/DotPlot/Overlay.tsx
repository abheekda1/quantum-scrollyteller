import { LinePath } from "@visx/shape";

type OverlayProps = {
  xScale: (v: number) => number;
  yScale: (v: number) => number;
  width: number;
  height: number;
};

export default function Overlay({ xScale, yScale }: OverlayProps) {
  return (
    <>
      {/* RCS (NISQ) Boundary */}
      <LinePath
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.y)}
        data={[
          { x: 10, y: 0.01 },
          { x: 100, y: 0.003 },
          { x: 1000, y: 0.001 },
        ]}
        stroke="#003f88"
        strokeDasharray="6,4"
        strokeWidth={2}
      />
      <text x={xScale(200)} y={yScale(0.0012)} fontSize={12} fill="#333">RCS (NISQ)</text>

      {/* QEC (FT) Boundary */}
      <LinePath
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.y)}
        data={[
          { x: 50, y: 0.005 },
          { x: 500, y: 0.0015 },
          { x: 5000, y: 0.0005 },
        ]}
        stroke="#003f88"
        strokeDasharray="6,4"
        strokeWidth={2}
      />
      <text x={xScale(600)} y={yScale(0.001)} fontSize={12} fill="#333">QEC (FT)</text>

      {/* Beyond Classical */}
      <LinePath
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.y)}
        data={[
          { x: 100, y: 0.01 },
          { x: 1000, y: 0.003 },
          { x: 10000, y: 0.001 },
        ]}
        stroke="#1f77b4"
        strokeDasharray="4,3"
        strokeWidth={1.5}
      />
      <text x={xScale(3000)} y={yScale(0.001)} fontSize={12} fill="#1f77b4">Beyond classical</text>
    </>
  );
}
