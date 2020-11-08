import { isString } from 'lodash-es';

import { FormattedValueFragmentType, ValueFragmentType, ValueType } from '@Term/types';
import { escapeString, getSecretString } from '@general/utils/string';
import { DATA_INDEX_ATTRIBUTE_NAME } from '@Term/Line/Input/constants';

export const getValueItemHtml = (
  item: ValueFragmentType,
  index: number,
  params: { secret?: boolean, secretClassName?: string } = {},
): string => {
  const { secret = false, secretClassName = '' } = params;
  const info = isString(item) ? { str: item } as FormattedValueFragmentType : item;
  const className = secret ? `${secretClassName} ${info.className || ''}` : info.className || '';
  return (`<span ${DATA_INDEX_ATTRIBUTE_NAME}="${index}" ref="fragment-${index}" class="${className}">${secret ? getSecretString(info.str) : escapeString(info.str)}</span>`);
};

export const getValueHtmlInfo = (
  val: ValueType, params: { secret?: boolean, secretClassName?: string } = {},
): { lock: string, edit: string } => {
  if (isString(val)) return { lock: '', edit: val };
  let tempString = '';
  let lock = '';
  val.forEach((item: ValueFragmentType, index: number) => {
    tempString += getValueItemHtml(item, index, params);
    if (!isString(item) && item.lock) {
      lock += tempString;
      tempString = '';
    }
  });
  return { lock, edit: tempString };
};
