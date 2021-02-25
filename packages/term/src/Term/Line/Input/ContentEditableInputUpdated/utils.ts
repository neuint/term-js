import { isString } from 'lodash-es';

import {
  FormattedValueFragmentType,
  ValueFragmentType,
  ValueType,
} from '@Term/types';
import { escapeString } from '@general/utils/string';
import { DATA_INDEX_ATTRIBUTE_NAME } from '@Term/Line/Input/constants';

export const getValueItemHtml = (
  item: ValueFragmentType,
  index: number,
): string => {
  const info = isString(item) ? { str: item } as FormattedValueFragmentType : item;
  const str = escapeString(info.str);
  return (`<span ${DATA_INDEX_ATTRIBUTE_NAME}="${index}" ref="fragment-${index}" class="${info.className}">${str}</span>`);
};

export const getValueHtmlInfo = (
  val: ValueType, params: { lockCount?: number } = {},
): { lock: string, edit: string } => {
  if (isString(val)) return { lock: '', edit: val };
  const lastLockIndex = (params.lockCount || 0) - 1;
  let edit = '';
  let lock = '';
  val.forEach((item: ValueFragmentType, index: number) => {
    if (lastLockIndex >= index) lock += getValueItemHtml(item, index);
    else edit += getValueItemHtml(item, index);
  });
  return { lock, edit };
};

export const getPasteProcessedValueItem = (
  original: string, updated: string, pasteString: string,
): string => {
  throw new Error('no implementation');
};
