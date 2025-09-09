import { createContext, JSX, useEffect, useMemo, useState } from "react";
import { PieChart } from "src/components/PieChart";
import { BarChart } from "src/components/BarChart";
import { Category } from "src/types";
import { useGetUsersQuery } from "src/api/users";
import { Loader } from "src/components/Loader";
import { isDate } from "src/utils/guards";
import { generateRandomColor } from "src/utils/generateRandomColor";
import { PDFButton } from "src/components/PDFButton";
import { DocumentsList } from "src/components/DocumentsList";
import { createCSV } from "src/utils/createCSV";
import { ArchiveModal } from "src/components/ArchiveModal";
import { Dropdown } from "src/components/Dropdown";
import { CATEGORIES } from "src/utils/constants";
import { removeUnderlines } from "src/utils/removeUnderlines";
import { capitalize } from "src/utils/capitalize";

const DEFAULT_CATEGORY = "age";

export const GlobalContext = createContext<{
  setShouldShowDocumentsList: (shouldShowDocumentsList: boolean) => void;
}>({
  setShouldShowDocumentsList: () => {
    throw new Error("GlobalContext is not initialized");
  },
});

export const App = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(DEFAULT_CATEGORY);

  const [shouldShowDocumentsList, setShouldShowDocumentsList] = useState(false);
  const [shouldShowArchiveModal, setShouldShowArchiveModal] = useState(false);

  const { data: users, isLoading } = useGetUsersQuery();

  const dataToDisplayInChart = useMemo(() => {
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
    setShouldShowDocumentsList(false);
  }, [selectedCategory]);

  const handleDownloadCSV = () => {
    const csv = createCSV(dataToDisplayInChart);

    const url = URL.createObjectURL(csv);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <GlobalContext.Provider value={{ setShouldShowDocumentsList }}>
      <div className="flex flex-col bg-gray-200 w-screen min-h-screen items-center xl:items-start xl:h-screen p-8 relative">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
          <Dropdown
            options={CATEGORIES}
            selectedOption={selectedCategory}
            setSelectedOption={setSelectedCategory}
            optionsDisplay={CATEGORIES.reduce(
              (acc: Record<string, string>, category) => {
                acc[category] = capitalize(removeUnderlines(category));
                return acc;
              },
              {}
            )}
          />
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={handleDownloadCSV}
              className="bg-white text-black font-bold hover:outline-3 hover:outline-blue-500 px-4 py-2 rounded-md cursor-pointer"
            >
              Export to CSV
            </button>

            <PDFButton selectedCategory={selectedCategory} />
            <button
              onClick={() => setShouldShowArchiveModal(true)}
              className="bg-white text-black font-bold hover:outline-3 hover:outline-blue-500 px-4 py-2 rounded-md cursor-pointer"
            >
              Export to archive
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-12 xl:mt-0 xl:flex-row items-center justify-between w-full h-full gap-12">
          <PieChart dataToDisplay={dataToDisplayInChart} />
          <BarChart dataToDisplay={dataToDisplayInChart} />
        </div>
        {shouldShowDocumentsList && (
          <DocumentsList
            onClose={() => setShouldShowDocumentsList(false)}
            selectedCategory={selectedCategory}
          />
        )}
        {shouldShowArchiveModal && (
          <ArchiveModal onClose={() => setShouldShowArchiveModal(false)} />
        )}
        {isLoading && <Loader />}
      </div>
    </GlobalContext.Provider>
  );
};
