import { JSX, useMemo, useState } from "react";
import { PieChart } from "src/components/PieChart";
import { BarChart } from "src/components/BarChart";
import { useGetUsersQuery } from "src/api/users";
import { Loader } from "src/components/Loader";
import { isCategory, isDate } from "src/utils/guards";
import { generateRandomColor } from "src/utils/generateRandomColor";
import { PDFButton } from "src/components/PDFButton";
import { DocumentsList } from "src/components/DocumentsList";
import { createCSV } from "src/utils/createCSV";
import { ArchiveModal } from "src/components/ArchiveModal";
import { Dropdown } from "src/components/Dropdown";
import { CATEGORIES } from "src/utils/constants";
import { GlobalProvider } from "src/contexts/GlobalContext/provider";
import { Routes, Route } from "react-router-dom";
import { Category } from "src/types";
import { capitalize } from "src/utils/capitalize";
import { removeUnderlines } from "src/utils/removeUnderlines";
import { useSearchParams } from "react-router-dom";
import { fillUpSpaces } from "src/utils/fillUpSpaces";

const DEFAULT_CATEGORY = "age";

export const App = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("chartType") ?? DEFAULT_CATEGORY;

  const [shouldShowDocumentsList, setShouldShowDocumentsList] = useState(false);
  const [shouldShowArchiveModal, setShouldShowArchiveModal] = useState(false);

  const { data: users, isLoading } = useGetUsersQuery();

  const dataToDisplayInChart = useMemo(() => {
    if (!users) return [];

    const totalUsers = users.length;

    const usersCountByCategory = users.reduce(
      (acc: Record<string, number>, user) => {
        const category = isCategory(selectedCategory)
          ? selectedCategory
          : DEFAULT_CATEGORY;

        const userField = user[category];

        const isUserFieldDate = isDate(userField);

        const yearFromDate = new Date(userField).getFullYear().toString();

        const key = isUserFieldDate ? yearFromDate : userField.toString();

        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

    const maxPercentage = Math.max(...Object.values(usersCountByCategory));

    return Object.entries(usersCountByCategory).map(([key, count]) => ({
      label: key,
      percentage: Number(((count / totalUsers) * 100).toFixed(1)),
      color: generateRandomColor(),
      step: (maxPercentage * 2) / 5,
    }));
  }, [users, selectedCategory]);

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
    <Routes>
      <Route
        path="/"
        element={
          <GlobalProvider value={{ setShouldShowDocumentsList }}>
            <div className="flex flex-col bg-gray-200 w-screen min-h-screen items-center xl:items-start xl:h-screen p-8 relative">
              <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
                <Dropdown
                  options={CATEGORIES.map((category) =>
                    capitalize(removeUnderlines(category))
                  )}
                  selectedOption={capitalize(
                    removeUnderlines(selectedCategory)
                  )}
                  onOptionSelect={(category) => {
                    setShouldShowDocumentsList(false);
                    setSearchParams((prev) => {
                      prev.set(
                        "chartType",
                        fillUpSpaces((category as Category).toLocaleLowerCase())
                      );
                      return prev;
                    });
                  }}
                />
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={handleDownloadCSV}
                    className="bg-white text-black font-bold hover:outline-3 hover:outline-blue-500 px-4 py-2 rounded-md cursor-pointer"
                  >
                    Export to CSV
                  </button>

                  <PDFButton
                    selectedCategory={
                      isCategory(selectedCategory)
                        ? selectedCategory
                        : DEFAULT_CATEGORY
                    }
                  />
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
                  selectedCategory={
                    isCategory(selectedCategory)
                      ? selectedCategory
                      : DEFAULT_CATEGORY
                  }
                />
              )}
              {shouldShowArchiveModal && (
                <ArchiveModal
                  onClose={() => setShouldShowArchiveModal(false)}
                />
              )}
              {isLoading && <Loader />}
            </div>
          </GlobalProvider>
        }
      />
    </Routes>
  );
};
