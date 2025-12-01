import { JSX } from "react";
import { Tooltip } from "src/components/Tooltip";
import { ChartProps } from "src/types";

export const Chart = ({ dataToDisplay }: ChartProps): JSX.Element => {
  const percentageMarkers = dataToDisplay.length
    ? Array.from({ length: 6 }, (_, index) =>
        (dataToDisplay[0].step * index).toFixed(1)
      ).reverse()
    : [];

  const getBarHeight = (percentage: number) => {
    return `${
      percentage *
      (50 / Math.max(...dataToDisplay.map((item) => item.percentage)))
    }%`;
  };

  return (
    <div
      data-testid="bar-chart-container"
      className="w-full h-full flex flex-col items-center justify-center me-0 mb-5 lg:mb-0 lg:me-3 overflow-x-auto overflow-y-hidden"
    >
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col justify-between h-[calc(100%-40px)] pr-2 text-sm text-gray-600 shrink-0">
          {percentageMarkers.map((percentage) => (
            <div
              data-testid={`percentage-marker-${percentage}`}
              key={`percentage-${percentage}`}
              className="text-right"
            >
              {percentage}%
            </div>
          ))}
        </div>

        <div className="flex-1 relative h-full">
          <div className="h-full relative">
            <div className="absolute top-0 left-[3px] inset-0 flex flex-col justify-between h-[calc(100%-40px)] w-full">
              {percentageMarkers.map((percentage) => (
                <div
                  key={`grid-line-${percentage}`}
                  className="w-full border-t border-gray-300 z-10"
                />
              ))}
            </div>

            <div className="flex flex-row h-[calc(100%-40px)] gap-2 sm:gap-3 md:gap-4 items-end border-s-3 z-20 border-zinc-400 px-2 sm:px-3 min-w-max">
              {dataToDisplay.map((item, index) => (
                <Tooltip
                  data-testid={`bar-column-${item.label}`}
                  key={`bar-chart-item-${item.label}-${index}`}
                  content={item.label}
                  style={{
                    height: getBarHeight(item.percentage),
                  }}
                >
                  <div
                    style={{
                      backgroundColor: item.color,
                    }}
                    className="min-w-[20px] h-full sm:min-w-[22px] md:min-w-[25px] z-10 cursor-pointer transition-opacity hover:opacity-90"
                  />
                </Tooltip>
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
    </div>
  );
};
