import { User } from "src/types";

export const isString = (data: unknown): data is string =>
  typeof data === "string";

export const isNumber = (data: unknown): data is number =>
  typeof data === "number";

export const isDate = (data: unknown): data is Date => data instanceof Date;

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
  "birthDate" in data &&
  isDate(data.birthDate);

export const isUserArr = (data: unknown): data is User[] =>
  Array.isArray(data) && data.every(isUser);
