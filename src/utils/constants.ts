import { Category, Language } from "src/types";

export const CATEGORIES: Category[] = [
  "age",
  "gender",
  "workplace",
  "industry",
  "location",
  "birth_date",
];

export const LANGUAGE_OPTIONS: { label: Language; flag: string }[] = [
  { label: "English", flag: "🇺🇸" },
  { label: "Українська", flag: "🇺🇦" },
  { label: "Español", flag: "🇪🇸" },
  { label: "Français", flag: "🇫🇷" },
  { label: "Deutsch", flag: "🇩🇪" },
  { label: "Italiano", flag: "🇮🇹" },
  { label: "Português", flag: "🇵🇹" },
  { label: "中文", flag: "🇨🇳" },
  { label: "日本語", flag: "🇯🇵" },
  { label: "한국어", flag: "🇰🇷" },
];

export const API_URL = "http://localhost:3001/api";
