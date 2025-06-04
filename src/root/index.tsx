import { JSX, useMemo, useState } from "react";
import { DropdownMenu } from "src/components/DropdownMenu";
import { PieChart } from "src/components/PieChart";
import { BarChart } from "src/components/BarChart";
import { Category } from "src/types";
import { useGetUsersQuery } from "src/api/users";
import { Loader } from "src/components/Loader";
import { isDate } from "src/utils/guards";
import { generateRandomColor } from "src/utils/generateRandomColor";

export const App = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("age");
  const { data: users, isLoading } = useGetUsersQuery();

  const dataToDisplay = useMemo(() => {
    if (!users) return [];

    const totalUsers = users.length;

    const countMap = users.reduce((acc: Record<string, number>, user) => {
      const key = isDate(user[selectedCategory])
        ? new Date(user[selectedCategory]).getFullYear().toString()
        : user[selectedCategory].toString();

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(countMap).map(([key, count]) => ({
      label: key,
      percentage: Number(((count / totalUsers) * 100).toFixed(1)),
      color: generateRandomColor(),
    }));
  }, [users, selectedCategory]);

  return (
    <div className="flex flex-col bg-gray-200 w-screen min-h-screen items-center lg:items-start lg:h-screen p-8 relative">
      <DropdownMenu
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex flex-col mt-12 lg:mt-0 lg:flex-row items-center justify-between w-full h-full gap-12">
        <PieChart dataToDisplay={dataToDisplay} />
        <BarChart />
      </div>
      {isLoading && <Loader />}
    </div>
  );
};
