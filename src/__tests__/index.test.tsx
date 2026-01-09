import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Category, ChartItem } from "src/types";
import { Dropdown } from "src/components/Dropdown";
import { CATEGORIES } from "src/utils/constants";
import { capitalize } from "src/utils/capitalize";
import { removeUnderlines } from "src/utils/removeUnderlines";
import { useSearchParams, Routes, Route, MemoryRouter } from "react-router-dom";
import { fillUpSpaces } from "src/utils/fillUpSpaces";

import { calcSegments } from "src/components/PieChart/components/Chart";
import { getBarHeight } from "src/components/BarChart/components/Chart";
import { createCSV } from "src/utils/createCSV";

const MOCK_CHART_DATA: ChartItem[] = [
  { label: "18-25", percentage: 30, color: "#3B82F6", step: 15 },
  { label: "26-35", percentage: 50, color: "#EC4899", step: 15 },
  { label: "36-45", percentage: 20, color: "#10B981", step: 15 },
];

const MOCK_PIE_SEGMENTS = [
  { dash: 150.79644737231007, offset: 0, ...MOCK_CHART_DATA[0] },
  {
    dash: 251.32741228718345,
    offset: 150.79644737231007,
    ...MOCK_CHART_DATA[1],
  },
  {
    dash: 100.53096491487338,
    offset: 402.1238596594935,
    ...MOCK_CHART_DATA[2],
  },
];

const MOCK_BAR_HEIGHTS = ["30%", "50%", "20%"];

describe("Dropdown test", () => {
  it("should select options", () => {
    const Wrapper = () => {
      const [searchParams, setSearchParams] = useSearchParams();

      const selectedCategory = searchParams.get("chartType") ?? "age";

      return (
        <Dropdown
          options={CATEGORIES.map((category) =>
            capitalize(removeUnderlines(category))
          )}
          selectedOption={capitalize(removeUnderlines(selectedCategory))}
          onOptionSelect={(category) => {
            setSearchParams((prev) => {
              prev.set(
                "chartType",
                fillUpSpaces((category as Category).toLocaleLowerCase())
              );
              return prev;
            });
          }}
        />
      );
    };

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Wrapper />} />
        </Routes>
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId("dropdown");
    const dropdownText = screen.getByTestId("dropdown-text");

    expect(dropdownText).toHaveTextContent("Age");

    fireEvent.click(dropdown);

    const genderOption = screen.getByTestId("option-Gender");
    fireEvent.click(genderOption);

    expect(dropdownText).toHaveTextContent("Gender");
  });
});

describe("Test charts", () => {
  it("should test pie chart", () => {
    const currentSegments = calcSegments(MOCK_CHART_DATA);

    expect(currentSegments).toEqual(MOCK_PIE_SEGMENTS);
  });

  it("should test bar chart", () => {
    const currentHeights = MOCK_CHART_DATA.map((item) =>
      getBarHeight(item.percentage, MOCK_CHART_DATA)
    );

    expect(currentHeights).toEqual(MOCK_BAR_HEIGHTS);
  });
});

describe("Test csv generation", () => {
  it("should create correct content", async () => {
    const csv = createCSV(MOCK_CHART_DATA);
    const csvContent = await csv.text();

    const headers = Object.keys(MOCK_CHART_DATA[0]).join(",");

    const content = MOCK_CHART_DATA.map((el) =>
      Object.values(el)
        .map((value) => `"${value}"`)
        .join(",")
    ).join("\n");

    const expectedContent = headers + "\n" + content;

    expect(csvContent).toBe(expectedContent);
  });
});
