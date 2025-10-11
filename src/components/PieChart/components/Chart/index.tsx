import { JSX, useRef, useState } from "react";
import { Tooltip } from "src/components/Tooltip";
import { ChartProps } from "src/types";

const RADIUS = 80;
const STROKE_WIDTH = 40;
const CX = 125;
const CY = 125;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Chart = ({ dataToDisplay }: ChartProps): JSX.Element => {
  const [hoveredSectionText, setHoveredSectionText] = useState("");

  const offset = useRef(0);

  return (
    <Tooltip content={hoveredSectionText}>
      <svg
        data-testid="pie-chart-svg"
        width={250}
        height={250}
        className="flex justify-center items-center"
      >
        {dataToDisplay.map((segment, index) => {
          const dash = (segment.percentage / 100) * CIRCUMFERENCE;
          const dashOffset = offset.current;

          if (index === dataToDisplay.length - 1) offset.current = 0;
          else offset.current += dash;

          return (
            <circle
              key={`circle-${index}-${segment.label}`}
              data-testid={`pie-segment-${segment.label}`}
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-dashOffset}
              transform={`rotate(-90, ${CX}, ${CY})`}
              className="cursor-pointer transition-opacity hover:opacity-90"
              onMouseEnter={() => setHoveredSectionText(segment.label)}
              onMouseLeave={() => setHoveredSectionText("")}
            />
          );
        })}
      </svg>
    </Tooltip>
  );
};
