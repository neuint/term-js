export type FormattedValueFragmentType = {
  str: string;
  clickHandler?: (e: Event, id?: string | number) => void;
  id?: string | number;
  lock?: boolean;
  className?: string;
};

export type ValueFragmentType = string | FormattedValueFragmentType;

export type FormattedValueType = ValueFragmentType[];

export type ValueType = string | FormattedValueType;
