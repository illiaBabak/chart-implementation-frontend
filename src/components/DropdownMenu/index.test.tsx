import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownMenu } from ".";
import { useState } from "react";
import { Category } from "src/types";

describe("DropdownMenu", () => {
  it("should render and select options", () => {
    const Wrapper = () => {
      const [selectedCategory, setSelectedCategory] = useState<Category>("age");

      return (
        <DropdownMenu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
