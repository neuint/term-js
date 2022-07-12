export type FormattedValueFragmentType = {
  str: string;
  clickHandler?: (e: Event, id?: string | number) => void;
  id?: string | number;
  lock?: boolean;
  className?: string;
};

export type NormalizedWriteItemType = {
  withSubmit?: boolean;
  duration?: number;
  value: FormattedValueFragmentType;
};

export type ComplexWriteItemType = {
  withSubmit?: boolean;
  value: string | FormattedValueFragmentType;
};

export type WriteItemType = string | FormattedValueFragmentType | ComplexWriteItemType;

export type FullWriteType = {
  data: WriteItemType | WriteItemType[];
  duration?: number;
};

export type WriteType = WriteItemType | FullWriteType;
