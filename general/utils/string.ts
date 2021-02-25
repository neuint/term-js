import { SECRET_CHARACTER } from '@Term/constants/strings';
import { NON_BREAKING_SPACE_PATTERN } from '@Term/constants/patterns';

export const escapeString = (str: string): string => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const getPasteString = (origin: string, updated: string): string => {
  let startIndex = -1;
  let endIndex = -1;
  const ln = updated.length;
  for (let i = 0; i < ln; i += 1) {
    if (startIndex < 0 && origin[i] !== updated[i]) {
      startIndex = i;
      break;
    }
  }
  for (let i = ln - 1; i >= 0; i -= 1) {
    if (endIndex < 0 && origin[i] !== updated[i]) {
      endIndex = i;
      break;
    }
  }
  if (startIndex < 0 && endIndex < 0) return updated;
  return updated.substring(startIndex < 0 ? 0 : startIndex, endIndex < 0 ? ln : endIndex + 1);
};

export const removeDomElements = (str: string): string => str
  .replace(NON_BREAKING_SPACE_PATTERN, ' ')
  .replace(/<br[^>]*>/g, '')
  .replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '')
  .replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '')
  .replace(/<pre[^>]*>/g, '').replace(/<\/pre>/g, '')
  .replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '')
  .replace(/<u[^>]*>/g, '').replace(/<\/u>/g, '')
  .replace(/<i[^>]*>/g, '').replace(/<\/i>/g, '')
  .replace(/<b[^>]*>/g, '').replace(/<\/b>/g, '');

export const escapePasteString = (str: string): string => {
  const pureString = removeDomElements(str);
  return escapeString(pureString);
};

export const getSecretString = (str: string): string => (new Array(str.length))
  .fill(SECRET_CHARACTER).join('');

export const safeTemplate = (template: string, data: { [key: string]: string }) => Object.keys(data)
  .reduce((
    acc: string, key: string,
  ) => acc.replace(new RegExp(`{${key}}`, 'g'), escapeString(data[key])), template);
