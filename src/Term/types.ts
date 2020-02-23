export type FormattedValueFragmentType = {
  str: string;
  clickHandler?: () => void;
  lock?: boolean;
  className?: string;
};

export type ValueFragmentType = string | FormattedValueFragmentType;

export type FormattedValueType = ValueFragmentType[];

export type ValueType = string | FormattedValueType;
