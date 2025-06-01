import { JSX, useState } from "react";
import { DropdownMenu } from "src/components/DropdownMenu";
import { PieChart } from "src/components/PieChart";
import { BarChart } from "src/components/BarChart";
import { Category } from "src/types";

export const App = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("age");

  return (
    <div className="flex flex-col bg-gray-200 w-screen h-screen p-8">
      <DropdownMenu
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex flex-row items-center justify-between w-full h-full gap-12">
        <PieChart />
        <BarChart />
      </div>
    </div>
  );
};
