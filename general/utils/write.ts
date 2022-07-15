import { isArray } from 'lodash-es';
import {
  FullWriteType,
  NormalizedWriteItemType,
  WriteItemType,
  WriteType,
  FormattedValueFragmentType,
  ComplexWriteItemType,
} from '../types/write';

type TermType = {
  write(
    data: string | FormattedValueFragmentType,
    options?: { withSubmit?: boolean, duration?: number, skipHandler?: boolean }
  ): Promise<boolean> | boolean;
};

const normalizeWriteItem = (item: WriteItemType): NormalizedWriteItemType | undefined => {
  if (typeof item === 'string') return { value: { str: item } };
  if ((item as FormattedValueFragmentType)?.str !== undefined) {
    return { value: item as FormattedValueFragmentType };
  }
  if ((item as ComplexWriteItemType)?.value !== undefined) {
    const { value, withSubmit } = item as ComplexWriteItemType;
    return { withSubmit, value: typeof value === 'string' ? { str: value } : value };
  }
  return undefined;
};

const getWriteData = (write: WriteType): NormalizedWriteItemType[] => {
  if ((write as FullWriteType)?.data === undefined) {
    return [normalizeWriteItem(write as WriteItemType)];
  }
  const { duration, data } = write as FullWriteType;
  const normalizedData = isArray(data) ? data.map(normalizeWriteItem) : [normalizeWriteItem(data)];
  const fullLength = duration ? normalizedData.reduce((acc, item) => {
    return acc + item.value.str.length;
  }, 0) : 0;
  const characterDuration = duration && fullLength ? duration / fullLength : 0;
  return normalizedData.map((item) => ({
    ...item,
    duration: duration ? item.value.str.length * characterDuration : undefined,
  }));
};

export const writeData = (term: TermType, data: WriteType): Promise<undefined> => {
  const normalizedData = getWriteData(data);
  return new Promise<undefined>((resolve) => {
    const next = () => {
      const item = normalizedData.shift();
      if (!item) {
        resolve(undefined);
        return;
      }
      const writeResponse = term.write(item.value, {
        duration: item.duration, withSubmit: item.withSubmit,
      });
      if (writeResponse instanceof Promise) {
        writeResponse.then(next);
      } else {
        next();
      }
    };
    next();
  });
};
