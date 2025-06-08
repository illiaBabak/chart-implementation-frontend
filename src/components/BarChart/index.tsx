import { JSX } from "react";
import { Chart } from "./components/Chart";
import { ChartProps } from "src/types";
import { Legend } from "../Legend";

export const BarChart = ({ dataToDisplay }: ChartProps): JSX.Element => {
  return (
    <div className="w-full xl:w-[65%] h-[500px] bg-white rounded-sm border-3 border-zinc-400 p-4 text-center flex flex-col">
      <h1 className="text-xl font-semibold">Users stats on bar</h1>

      <div className="relative w-full h-[80%] flex xl:justify-around justify-center xl:items-start items-center my-8 flex-col xl:flex-row">
        <Chart dataToDisplay={dataToDisplay} />
        <Legend dataToDisplay={dataToDisplay} />
      </div>
    </div>
  );
};
