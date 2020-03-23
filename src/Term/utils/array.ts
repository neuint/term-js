export const checkArraysEqual = <T>(
  first: T[], second: T[],
): boolean => first.length === second.length && first.every(item => second.includes(item));
