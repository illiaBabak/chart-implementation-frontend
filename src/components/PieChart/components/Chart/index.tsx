import { JSX, useState, useRef } from "react";
import { ChartProps } from "src/types";

const RADIUS = 80;
const STROKE_WIDTH = 40;
const CX = 100;
const CY = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Chart = ({ dataToDisplay }: ChartProps): JSX.Element => {
  const [tooltip, setTooltip] = useState<{
    percentage: number;
    x: number;
    y: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  let offset = 0;

  const handleMouseEnter = (x: number, y: number, percentage: number) => {
    const svgRect = svgRef.current?.getBoundingClientRect();

    if (svgRect)
      setTooltip({
        percentage,
        x: x - svgRect.left,
        y: y - svgRect.top,
      });
  };

  return (
    <div className="relative">
      <svg ref={svgRef} width={250} height={250}>
        {dataToDisplay.map((segment, index) => {
          const dash = (segment.percentage / 100) * CIRCUMFERENCE;
          const dashOffset = offset;
          offset += dash;

          return (
            <circle
              key={`circle-${index}-${segment.label}`}
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-dashOffset}
              transform="rotate(-90, 130, 100)"
              className="cursor-pointer transition-opacity hover:opacity-90"
              onMouseEnter={({ clientX, clientY }) =>
                handleMouseEnter(clientX, clientY, segment.percentage)
              }
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-md opacity-100 pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
          }}
        >
          {tooltip.percentage}%
        </div>
      )}
    </div>
  );
};
