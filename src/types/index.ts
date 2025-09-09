export type Category =
  | "age"
  | "gender"
  | "workplace"
  | "industry"
  | "location"
  | "birth_date";

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
  | "English"
  | "Українська"
  | "Español"
  | "Français"
  | "Deutsch"
  | "Italiano"
  | "Português"
  | "中文"
  | "日本語"
  | "한국어";
