import { ExpenseCategory, IncomeCategory } from "../types";

export const textInputRegex =
  /^(?!\s+$)[~!\s@#$%^&*()_+=[\]{}|;':",./<>?a-zA-Z0-9-]+$/;

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const NumberRegex = /^[1-9]\d*$/;

export const Windows1252Regex =
  /^(?!\s+$)[~!\s@#$%^&*()_+=[\]{}|;':",./<>?a-zA-Z0-9-]+$/;

export const isRunningStandalone = () => {
  return window.matchMedia("(display-mode: standalone)").matches;
};

export const isAppRunningOnIos16 = (): boolean => {
  const userAgent = window?.navigator.userAgent || "";
  return userAgent.includes("iPhone OS 16");
};

export const isStandAloneAndRunningOnIos16 = () =>
  isRunningStandalone() && isAppRunningOnIos16();

export const getInitials = (str: string = "") => {
  if (!str) return "RS";

  const initials = str
    .split(" ")
    .map(
      (name, index, arr) => (index === 0 || index === arr.length - 1) && name[0]
    )
    .filter((initial) => initial)
    .join("");

  return initials.toUpperCase() || "RS";
};

export const capitalizeFirstLetter = (name: string = ""): string => {
  if (!name) return name;

  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const formatNumber = (
  num: number,
  isUSD: boolean,
  showDecimals: boolean = true
) => {
  const options = showDecimals
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : {};

  return new Intl.NumberFormat(isUSD ? "en-US" : "en-IN", options).format(num);
};

export const getCategoryName = (
  selectedCategoryId: string,
  isSelectedTypeIncome: boolean,
  incomeCategories: IncomeCategory[] | [],
  expenseCategories: ExpenseCategory[] | []
) => {
  if (isSelectedTypeIncome) {
    return incomeCategories.find((cat) => cat._id === selectedCategoryId)?.name;
  }

  return expenseCategories.find(
    ({ category }) => category._id === selectedCategoryId
  )?.category.name;
};
