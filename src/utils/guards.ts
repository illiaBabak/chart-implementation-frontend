import { Category, Chart, User } from "src/types";
import { CATEGORIES } from "./constants";

export const isString = (data: unknown): data is string =>
  typeof data === "string";

export const isNumber = (data: unknown): data is number =>
  typeof data === "number";

export const isDate = (data: unknown): data is Date => {
  if (isString(data)) return !isNaN(new Date(data).getTime());
  return data instanceof Date;
};

export const isObject = (data: unknown): data is object =>
  typeof data === "object" && data !== null;

export const isUser = (data: unknown): data is User =>
  isObject(data) &&
  "id" in data &&
  isNumber(data.id) &&
  "name" in data &&
  isString(data.name) &&
  "age" in data &&
  isNumber(data.age) &&
  "gender" in data &&
  (data.gender === "male" || data.gender === "female") &&
  "workplace" in data &&
  isString(data.workplace) &&
  "industry" in data &&
  isString(data.industry) &&
  "location" in data &&
  isString(data.location) &&
  "birth_date" in data &&
  isDate(data.birth_date);

export const isUserArr = (data: unknown): data is User[] =>
  Array.isArray(data) && data.every(isUser);

export const isChart = (value: unknown): value is Chart =>
  typeof value === "object" &&
  value !== null &&
  "chart_type" in value &&
  "status" in value &&
  "version" in value &&
  "key" in value &&
  "url" in value &&
  isString(value.chart_type) &&
  isString(value.status) &&
  isNumber(value.version) &&
  isString(value.key) &&
  (value.url === null || isString(value.url));

export const isChartArray = (value: unknown): value is Chart[] =>
  Array.isArray(value) && value.every(isChart);

export const isCategory = (value: string): value is Category =>
  CATEGORIES.includes(value as Category);
