import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Category, ChartItem } from "src/types";
import { Dropdown } from "src/components/Dropdown";
import { CATEGORIES } from "src/utils/constants";
import { capitalize } from "src/utils/capitalize";
import { removeUnderlines } from "src/utils/removeUnderlines";
import { useSearchParams, Routes, Route, MemoryRouter } from "react-router-dom";
import { fillUpSpaces } from "src/utils/fillUpSpaces";
import { PieChart } from "src/components/PieChart";
import { BarChart } from "src/components/BarChart";

const MOCK_CHART_DATA: ChartItem[] = [
  { label: "18-25", percentage: 30, color: "#3B82F6", step: 15 },
  { label: "26-35", percentage: 50, color: "#EC4899", step: 15 },
  { label: "36-45", percentage: 20, color: "#10B981", step: 15 },
];

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

  it("should test pie chart", () => {
    render(<PieChart dataToDisplay={MOCK_CHART_DATA} />);

    const svg = screen.getByTestId("pie-chart-svg");
    expect(svg).toBeInTheDocument();

    const segments = MOCK_CHART_DATA.map((segment, index) => {
      const dash = (segment.percentage / 100) * CIRCUMFERENCE;

      const offset =
        index === 0
          ? 0
          : MOCK_CHART_DATA.slice(0, index).reduce(
              (sum, s) => sum + (s.percentage / 100) * CIRCUMFERENCE,
              0
            );

      return {
        dash,
        offset,
      };
    });

    MOCK_CHART_DATA.map((el, index) => {
      const currentSegment = screen.getByTestId(`pie-segment-${el.label}`);

      expect(currentSegment).toBeInTheDocument();

      const strokeDasharray = currentSegment.getAttribute("stroke-dasharray");
      const strokeOffset = currentSegment.getAttribute("stroke-dashoffset");

      expect(strokeDasharray).toBe(
        `${segments[index].dash} ${CIRCUMFERENCE - segments[index].dash}`
      );
      expect(strokeOffset).toBe(`${-segments[index].offset}`);
    });
  });

  it("should test bar chart", () => {
    render(<BarChart dataToDisplay={MOCK_CHART_DATA} />);

    const barChartContainer = screen.getByTestId("bar-chart-container");
    expect(barChartContainer).toBeInTheDocument();

    const expectedPercentageMarkers = MOCK_CHART_DATA.length
      ? Array.from({ length: 6 }, (_, index) =>
          (MOCK_CHART_DATA[0].step * index).toFixed(1)
        ).reverse()
      : [];

    const getBarHeight = (percentage: number) => {
      return `${
        percentage *
        (50 / Math.max(...MOCK_CHART_DATA.map((item) => item.percentage)))
      }%`;
    };

    expectedPercentageMarkers.map((expectedPercantageMarker) => {
      const expectedMarker = screen.getByTestId(
        `percentage-marker-${expectedPercantageMarker}`
      );

      expect(expectedMarker).toBeInTheDocument();
    });

    MOCK_CHART_DATA.map((el) => {
      const barColumn = screen.getByTestId(`bar-column-${el.label}`);

      expect(barColumn).toBeInTheDocument();

      expect(barColumn).toHaveStyle(`height: ${getBarHeight(el.percentage)}`);
    });
  });
});
