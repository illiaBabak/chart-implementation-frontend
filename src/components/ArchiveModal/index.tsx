import { JSX, useState } from "react";
import { useGenerateArchive } from "src/api/pdf";
import { Category, ChartType } from "src/types";
import { capitalize } from "src/utils/capitalize";
import { CATEGORIES } from "src/utils/constants";
import { removeUnderlines } from "src/utils/removeUnderlines";

const options: { label: string; value: ChartType }[] = [
  { label: "Bar chart", value: "bar" },
  { label: "Pie chart", value: "pie" },
  { label: "Both", value: "both" },
];

export const ArchiveModal = ({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element | null => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("both");

  const { mutateAsync: generateArchive, isPending } = useGenerateArchive();

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClick = async () =>
    await generateArchive({
      categories: selectedCategories,
      chartType: selectedChartType,
    }).then(() => onClose());

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Export archive</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <h3 className="text-sm font-medium mb-4">Categories</h3>
            <div className="max-h-80 overflow-auto pr-2">
              <ul className="space-y-3">
                {CATEGORIES.map((category) => (
                  <li key={`category-${category}-el`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4"
                      />
                      <span className="text-base">
                        {capitalize(removeUnderlines(category))}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Chart type</h3>
            <div className="space-y-4">
              {options.map((option) => (
                <label
                  key={`chart-type-${option.value}-el`}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="chartType"
                    value={option.value}
                    checked={selectedChartType === option.value}
                    onChange={() => setSelectedChartType(option.value)}
                    className="h-5 w-5"
                  />
                  <span className="text-base">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-end">
          <button
            className="bg-black text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClick}
            disabled={
              isPending || !selectedCategories.length || !selectedChartType
            }
          >
            {isPending ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>
    </div>
  );
};
