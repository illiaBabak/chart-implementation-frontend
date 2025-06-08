import { JSX } from "react";
import { ChartProps } from "src/types";
import { Chart } from "./components/Chart";
import { Legend } from "../Legend";

export const PieChart = ({ dataToDisplay }: ChartProps): JSX.Element => {
  return (
    <div className="xl:w-[35%] w-full h-[500px] bg-white rounded-sm border-3 border-zinc-400 p-4 text-center">
      <h1 className="text-xl font-semibold">Users stats on pie</h1>

      <div className="relative w-full h-[80%] flex xl:justify-around justify-center xl:items-start items-center my-8 flex-col xl:flex-row">
        <Chart dataToDisplay={dataToDisplay} />
        <Legend dataToDisplay={dataToDisplay} />
      </div>
    </div>
  );
};
