import { Category, Language } from "src/types";

export const CATEGORIES: Category[] = [
  "age",
  "gender",
  "workplace",
  "industry",
  "location",
  "birth_date",
];

export const LANGUAGE_OPTIONS: { label: Language; labelToShow: string }[] = [
  { label: "English", labelToShow: "🇺🇸 English" },
  { label: "Українська", labelToShow: "🇺🇦 Українська" },
  { label: "Español", labelToShow: "🇪🇸 Español" },
  { label: "Français", labelToShow: "🇫🇷 Français" },
  { label: "Deutsch", labelToShow: "🇩🇪 Deutsch" },
  { label: "Italiano", labelToShow: "🇮🇹 Italiano" },
  { label: "Português", labelToShow: "🇵🇹 Português" },
  { label: "中文", labelToShow: "🇨🇳 中文" },
  { label: "日本語", labelToShow: "🇯🇵 日本語" },
  { label: "한국어", labelToShow: "🇰🇷 한국어" },
];
