import { Dispatch, JSX, SetStateAction, useState } from "react";
import { capitalize } from "src/utils/capitalize";
import { CATEGORIES } from "src/utils/constants";
import ClickAwayListener from "react-click-away-listener";
import { removeUnderlines } from "src/utils/removeUnderlines";
import { Category } from "src/types";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  selectedCategory: Category;
  setSelectedCategory: Dispatch<SetStateAction<Category>>;
};

export const DropdownMenu = ({
  selectedCategory,
  setSelectedCategory,
}: Props): JSX.Element => {
  const [isFocusedDropdown, setIsFocusedDropdown] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsFocusedDropdown(false)}>
      <div
        data-testid="dropdown-menu"
        onClick={() => setIsFocusedDropdown((prev) => !prev)}
        className={`cursor-pointer bg-white min-w-[290px] max-w-[290px] h-[45px] rounded-sm ${
          isFocusedDropdown ? "outline-3 outline-blue-500" : ""
        }`}
      >
        <div className="flex items-center justify-between h-full w-full px-3">
          <p data-testid="dropdown-text" className="text-xl font-bold">
            {removeUnderlines(capitalize(selectedCategory))}
          </p>
          <motion.img
            src="/images/arrow-down.png"
            alt="arrow-down"
            className="w-[20px] h-[20px] object-contain pointer-events-none select-none"
            animate={{
              rotateX: isFocusedDropdown ? 180 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        </div>

        <AnimatePresence>
          {isFocusedDropdown && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="absolute mt-4 outline-3 outline-blue-500 rounded-sm z-10"
            >
              {CATEGORIES.map((category, index) => (
                <div
                  data-testid={`dropdown-category-${category}`}
                  key={`category-${category}-${index}`}
                  className="bg-white w-[290px] font-bold px-3 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {capitalize(removeUnderlines(category))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClickAwayListener>
  );
};
