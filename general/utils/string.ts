import { SECRET_CHARACTER } from '@Term/constants/strings';

export const escapeString = (str: string): string => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const getSecretString = (str: string): string => (new Array(str.length))
  .fill(SECRET_CHARACTER).join('');

export const safeTemplate = (template: string, data: { [key: string]: string }) => Object.keys(data)
  .reduce((
    acc: string, key: string,
  ) => acc.replace(new RegExp(`{${key}}`, 'g'), escapeString(data[key])), template);
