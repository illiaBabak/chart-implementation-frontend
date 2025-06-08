import { JSX } from "react";
import { ChartProps } from "src/types";

export const Legend = ({ dataToDisplay }: ChartProps): JSX.Element => (
  <div className="h-[100px] xl:h-full flex flex-col xl:items-start items-center w-full xl:w-auto xl:mt-0 mt-4">
    <p className="font-semibold">Legend</p>
    <div className="flex flex-row xl:flex-col gap-2 overflow-x-auto h-[40px] xl:h-full mt-2 w-full">
      {dataToDisplay.map((item, index) => (
        <div
          key={`pie-chart-legend-${item.label}-${index}`}
          className="flex items-center gap-2 text-sm w-full h-[40px]"
        >
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          ></div>
          <p className="truncate">{item.label}</p>
        </div>
      ))}
    </div>
  </div>
);
