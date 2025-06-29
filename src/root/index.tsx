import { createContext, JSX, useEffect, useMemo, useState } from "react";
import { DropdownMenu } from "src/components/DropdownMenu";
import { PieChart } from "src/components/PieChart";
import { BarChart } from "src/components/BarChart";
import { Category } from "src/types";
import { useGetUsersQuery } from "src/api/users";
import { Loader } from "src/components/Loader";
import { isDate } from "src/utils/guards";
import { generateRandomColor } from "src/utils/generateRandomColor";
import { CSVButton } from "src/components/CSVButton";
import { PDFButton } from "src/components/PDFButton";
import { Menu } from "src/components/Menu";

export const GlobalContext = createContext<{
  setShouldShowMenu: (shouldShowMenu: boolean) => void;
}>({
  setShouldShowMenu: () => {
    throw new Error("GlobalContext is not initialized");
  },
});

export const App = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("age");

  const [shouldShowMenu, setShouldShowMenu] = useState(false);

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

    const maxPercentage = Math.max(...Object.values(countMap));

    return Object.entries(countMap).map(([key, count]) => ({
      label: key,
      percentage: Number(((count / totalUsers) * 100).toFixed(1)),
      color: generateRandomColor(),
      step: (maxPercentage * 2) / 5,
    }));
  }, [users, selectedCategory]);

  useEffect(() => {
    setShouldShowMenu(false);
  }, [selectedCategory]);

  return (
    <GlobalContext.Provider value={{ setShouldShowMenu }}>
      <div className="flex flex-col bg-gray-200 w-screen min-h-screen items-center xl:items-start xl:h-screen p-8 relative">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
          <DropdownMenu
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <div className="flex flex-row items-center gap-4">
            <CSVButton data={dataToDisplay} />
            <PDFButton selectedCategory={selectedCategory} />
          </div>
        </div>
        <div className="flex flex-col mt-12 xl:mt-0 xl:flex-row items-center justify-between w-full h-full gap-12">
          <PieChart dataToDisplay={dataToDisplay} />
          <BarChart dataToDisplay={dataToDisplay} />
        </div>
        {shouldShowMenu && (
          <Menu
            onClose={() => setShouldShowMenu(false)}
            selectedCategory={selectedCategory}
          />
        )}
        {isLoading && <Loader />}
      </div>
    </GlobalContext.Provider>
  );
};
