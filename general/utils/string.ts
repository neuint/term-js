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
