import { ValueType, ValueFragmentType } from '../types/value';

export const escapeString = (str: string): string => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const safeTemplate = (template: string, data: { [key: string]: string }) => Object.keys(data)
  .reduce((
    acc: string, key: string,
  ) => acc.replace(new RegExp(`{${key}}`, 'g'), escapeString(data[key])), template);

export const getNotLockedString = (data: ValueType): string => {
  if (typeof data === 'string') return data;
  let result = '';
  data.forEach((fragment: ValueFragmentType) => {
    if (typeof fragment === 'string') return result = `${result}${fragment}`;
    return fragment.lock ? result = '' : `${result}${fragment.str}`;
  });
  return result;
};
