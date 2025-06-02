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
  birthDate: Date;
};
