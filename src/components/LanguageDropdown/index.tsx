import { Dispatch, JSX, SetStateAction, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "src/types";

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en", flag: "🇺🇸" },
  { label: "Українська", value: "uk", flag: "🇺🇦" },
  { label: "Español", value: "es", flag: "🇪🇸" },
  { label: "Français", value: "fr", flag: "🇫🇷" },
  { label: "Deutsch", value: "de", flag: "🇩🇪" },
  { label: "Italiano", value: "it", flag: "🇮🇹" },
  { label: "Português", value: "pt", flag: "🇵🇹" },
  { label: "中文", value: "zh", flag: "🇨🇳" },
  { label: "日本語", value: "ja", flag: "🇯🇵" },
  { label: "한국어", value: "ko", flag: "🇰🇷" },
];

type Props = {
  selectedLanguage: Language;
  setSelectedLanguage: Dispatch<SetStateAction<Language>>;
};

export const LanguageDropdown = ({
  selectedLanguage,
  setSelectedLanguage,
}: Props): JSX.Element => {
  const [isFocusedDropdown, setIsFocusedDropdown] = useState(false);

  const selectedLanguageOption =
    LANGUAGE_OPTIONS.find((option) => option.value === selectedLanguage) ||
    LANGUAGE_OPTIONS[0];

  return (
    <ClickAwayListener onClickAway={() => setIsFocusedDropdown(false)}>
      <div className="relative">
        <div
          data-testid="language-dropdown"
          onClick={() => setIsFocusedDropdown((prev) => !prev)}
          className={`cursor-pointer bg-white min-w-[200px] max-w-[200px] h-[45px] rounded-sm border border-gray-300 flex items-center justify-between px-3 hover:border-blue-400 transition-colors ${
            isFocusedDropdown ? "border-blue-500 ring-2 ring-blue-200" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedLanguageOption.flag}</span>
            <span className="text-base font-medium text-gray-700">
              {selectedLanguageOption.label}
            </span>
          </div>
          <motion.img
            src="/images/arrow-down.png"
            alt="arrow-down"
            className="w-[16px] h-[16px] object-contain pointer-events-none select-none"
            animate={{
              rotate: isFocusedDropdown ? 180 : 0,
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
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-sm shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {LANGUAGE_OPTIONS.map((option, index) => (
                <div
                  data-testid={`language-option-${option.value}`}
                  key={`language-${option.value}-${index}`}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedLanguage === option.value ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedLanguage(option.value as Language);
                    setIsFocusedDropdown(false);
                  }}
                >
                  <span className="text-lg">{option.flag}</span>
                  <span className="text-base font-medium text-gray-700">
                    {option.label}
                  </span>
                  {selectedLanguage === option.value && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClickAwayListener>
  );
};
