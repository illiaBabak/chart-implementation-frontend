import { JSX, useState } from "react";
import { capitalize } from "src/utils/capitalize";
import { CATEGORIES } from "src/utils/constants";
import ClickAwayListener from "react-click-away-listener";
import { removeUnderlines } from "src/utils/removeUnderlines";

export const DropdownMenu = (): JSX.Element => {
  const [isFocusedDropdown, setIsFocusedDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>("age");

  return (
    <ClickAwayListener onClickAway={() => setIsFocusedDropdown(false)}>
      <div
        onClick={() => setIsFocusedDropdown((prev) => !prev)}
        className={`cursor-pointer bg-white w-[290px] h-[45px] rounded-sm ${
          isFocusedDropdown ? "outline-3 outline-blue-500" : ""
        }`}
      >
        <div className="flex items-center justify-between h-full w-full px-3">
          <p className="text-xl font-bold">
            {removeUnderlines(capitalize(selectedCategory))}
          </p>
          <img
            src="/images/arrow-down.png"
            alt="arrow-down"
            className="w-[20px] h-[20px] object-contain pointer-events-none select-none"
          />
        </div>

        {isFocusedDropdown && (
          <div className="absolute mt-4 outline-3 outline-blue-500 rounded-sm">
            {CATEGORIES.map((category, index) => (
              <div
                key={`category-${category}-${index}`}
                className="bg-white w-[290px] font-bold px-3 py-2 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setSelectedCategory(category)}
              >
                {capitalize(removeUnderlines(category))}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};
