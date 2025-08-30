import { CATEGORIES } from "src/utils/constants";

export type Category = (typeof CATEGORIES)[number];

export type User = {
  id: number;
  name: string;
  age: number;
  gender: "male" | "female";
  workplace: string;
  industry: string;
  location: string;
  birth_date: Date;
};

export type ChartItem = {
  label: string;
  percentage: number;
  color: string;
  step: number;
};

export type ChartProps = {
  dataToDisplay: ChartItem[];
};

export type Chart = {
  chart_type: string;
  status: string;
  version: number;
  key: string;
  url: string | null;
};

export type ChartType = "bar" | "pie" | "both";

export type Language =
  | "en"
  | "uk"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "zh"
  | "ja"
  | "ko";
