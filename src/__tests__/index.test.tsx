import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BarChart } from "../components/BarChart";
import { PieChart } from "../components/PieChart";
import { useState } from "react";
import { Category, ChartItem } from "src/types";
import { Dropdown } from "src/components/Dropdown";
import { CATEGORIES } from "src/utils/constants";

const mockChartData: ChartItem[] = [
  { label: "18-25", percentage: 30, color: "#3B82F6", step: 15 },
  { label: "26-35", percentage: 45, color: "#EC4899", step: 15 },
  { label: "36-45", percentage: 20, color: "#10B981", step: 15 },
  { label: "46+", percentage: 5, color: "#F59E0B", step: 15 },
];

describe("DropdownMenu", () => {
  it("should render and select options", () => {
    const Wrapper = () => {
      const [selectedCategory, setSelectedCategory] = useState<Category>("age");

      return (
        <Dropdown
          options={CATEGORIES}
          selectedOption={selectedCategory}
          onOptionSelect={setSelectedCategory}
        />
      );
    };

    render(<Wrapper />);

    const dropdownButton = screen.getByTestId("dropdown-menu");
    const dropdownText = screen.getByTestId("dropdown-text");

    expect(dropdownButton).toBeInTheDocument();
    expect(dropdownText).toHaveTextContent("Age");

    fireEvent.click(dropdownButton);

    const genderButton = screen.getByTestId("dropdown-category-gender");
    fireEvent.click(genderButton);

    expect(dropdownText).toHaveTextContent("Gender");
  });
});

describe("BarChart", () => {
  beforeEach(() => {
    render(<BarChart dataToDisplay={mockChartData} />);
  });

  it("should render chart with data", () => {
    const chartContainer = screen.getByTestId("bar-chart");
    const chartTitle = screen.getByTestId("bar-chart-title");
    const chart = screen.getByTestId("bar-chart-container");

    expect(chartContainer).toBeInTheDocument();
    expect(chartTitle).toBeInTheDocument();
    expect(chart).toBeInTheDocument();
  });

  it("should handle data items", () => {
    expect(screen.getByTestId("bar-label-18-25")).toBeInTheDocument();
    expect(screen.getByTestId("bar-label-26-35")).toBeInTheDocument();
    expect(screen.getByTestId("bar-label-36-45")).toBeInTheDocument();
    expect(screen.getByTestId("bar-label-46+")).toBeInTheDocument();
  });

  it("should render bar columns with correct colors", () => {
    const column18_25 = screen.getByTestId("bar-column-18-25");
    const column26_35 = screen.getByTestId("bar-column-26-35");
    const column36_45 = screen.getByTestId("bar-column-36-45");
    const column46_plus = screen.getByTestId("bar-column-46+");

    expect(column18_25).toHaveStyle({ backgroundColor: "#3B82F6" });
    expect(column26_35).toHaveStyle({ backgroundColor: "#EC4899" });
    expect(column36_45).toHaveStyle({ backgroundColor: "#10B981" });
    expect(column46_plus).toHaveStyle({ backgroundColor: "#F59E0B" });
  });
});

describe("PieChart", () => {
  beforeEach(() => {
    render(<PieChart dataToDisplay={mockChartData} />);
  });

  it("should render chart with data", () => {
    const chartContainer = screen.getByTestId("pie-chart");
    const chartTitle = screen.getByTestId("pie-chart-title");
    const chartSvg = screen.getByTestId("pie-chart-svg");

    expect(chartContainer).toBeInTheDocument();
    expect(chartTitle).toBeInTheDocument();
    expect(chartSvg).toBeInTheDocument();
  });

  it("should handle data items", () => {
    expect(screen.getByTestId("pie-segment-18-25")).toBeInTheDocument();
    expect(screen.getByTestId("pie-segment-26-35")).toBeInTheDocument();
    expect(screen.getByTestId("pie-segment-36-45")).toBeInTheDocument();
    expect(screen.getByTestId("pie-segment-46+")).toBeInTheDocument();
  });

  it("should render pie segments with correct stroke colors", () => {
    const segment18_25 = screen.getByTestId("pie-segment-18-25");
    const segment26_35 = screen.getByTestId("pie-segment-26-35");
    const segment36_45 = screen.getByTestId("pie-segment-36-45");
    const segment46_plus = screen.getByTestId("pie-segment-46+");

    expect(segment18_25).toHaveAttribute("stroke", "#3B82F6");
    expect(segment26_35).toHaveAttribute("stroke", "#EC4899");
    expect(segment36_45).toHaveAttribute("stroke", "#10B981");
    expect(segment46_plus).toHaveAttribute("stroke", "#F59E0B");
  });
});
