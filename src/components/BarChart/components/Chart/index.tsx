import { JSX, useState } from "react";
import { ChartProps } from "src/types";

const PERCENTAGE_MARKERS = [100, 80, 60, 40, 20, 0];

export const Chart = ({ dataToDisplay }: ChartProps): JSX.Element => {
  const [tooltip, setTooltip] = useState<{
    percentage: number;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseEnter = (x: number, y: number, percentage: number) => {
    setTooltip({
      percentage,
      x,
      y,
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center me-0 mb-5 lg:mb-0 lg:me-3 overflow-x-auto overflow-y-hidden">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col justify-between h-[calc(100%-40px)] pr-2 text-sm text-gray-600 shrink-0">
          {PERCENTAGE_MARKERS.map((percentage) => (
            <div key={`percentage-${percentage}`} className="text-right">
              {percentage}%
            </div>
          ))}
        </div>

        <div className="flex-1 relative h-full">
          <div className="h-full relative">
            <div className="absolute top-0 left-[3px] inset-0 flex flex-col justify-between h-[calc(100%-40px)] w-full">
              {PERCENTAGE_MARKERS.map((percentage) => (
                <div
                  key={`grid-line-${percentage}`}
                  className="w-full border-t border-gray-300 z-10"
                />
              ))}
            </div>

            <div className="flex flex-row h-[calc(100%-40px)] gap-2 sm:gap-3 md:gap-4 items-end border-s-3 z-20 border-zinc-400 px-2 sm:px-3 min-w-max">
              {dataToDisplay.map((item, index) => (
                <div
                  key={`bar-chart-item-${item.label}-${index}`}
                  style={{
                    backgroundColor: item.color,
                    height: `${item.percentage}%`,
                  }}
                  className="min-w-[20px] sm:min-w-[22px] md:min-w-[25px] z-10 cursor-pointer transition-opacity hover:opacity-90"
                  onMouseEnter={({ clientX, clientY }) =>
                    handleMouseEnter(clientX, clientY, item.percentage)
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>

            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 mt-2 ms-1 h-10">
              {dataToDisplay.map((item, index) => (
                <div
                  key={`label-${item.label}-${index}`}
                  className="h-[16px] w-[20px] rotate-45 sm:min-w-[22px] sm:max-w-[22px] md:min-w-[25px] md:max-w-[25px] text-center text-[10px] text-gray-600 truncate"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-10 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-md opacity-100 pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 40}px`,
          }}
        >
          {tooltip.percentage}%
        </div>
      )}
    </div>
  );
};
