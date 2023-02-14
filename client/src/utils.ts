import { Descendant, Node } from "slate";

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

export const getTimeString = (time: number) => {
  const dTime = Math.max(0, Date.now() - time);
  return (
    dTime > year 
    ? (dTime / year).toFixed(0) + 'yr'
    : dTime > month
      ? (dTime / month).toFixed(0) + 'mo'
      : dTime > week 
        ? (dTime / week).toFixed(0) + 'w'
        : dTime > day 
          ? (dTime / day).toFixed(0) + 'd'
          : dTime > hour
            ? (dTime / hour).toFixed(0) + 'h'
            : dTime > minute 
              ? (dTime / minute).toFixed(0) + 'min'
              : 'LIVE!'
  );
};

export const serialize = (value: Descendant[]) => {
  return value.map(n => Node.string(n)).join('\n');
};

export const deserialize = (text: string) => {
  return text.split('\n').map(line => {
    return { text: line };
  });
};

