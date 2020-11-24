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
  const str = secret && !info.lock ? getSecretString(info.str) : escapeString(info.str);
  return (`<span ${DATA_INDEX_ATTRIBUTE_NAME}="${index}" ref="fragment-${index}" class="${className}">${str}</span>`);
};

export const getValueHtmlInfo = (
  val: ValueType, params: { secret?: boolean, lockCount?: number, secretClassName?: string } = {},
): { lock: string, edit: string } => {
  if (isString(val)) return { lock: '', edit: val };
  const lastLockIndex = (params.lockCount || 0) - 1;
  let edit = '';
  let lock = '';
  val.forEach((item: ValueFragmentType, index: number) => {
    if (lastLockIndex >= index) lock += getValueItemHtml(item, index, params);
    else edit += getValueItemHtml(item, index, params);
  });
  return { lock, edit };
};
