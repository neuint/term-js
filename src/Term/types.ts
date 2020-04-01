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

export type EditLineParamsType = ValueType | { value: ValueType; secret?: boolean };

export type SizeType = { width: number; height: number };

export type TermConstructorParamsType = {
  lines: ValueType[];
  editLine?: EditLineParamsType;
  header?: string;
  onSubmit?: (line: string, lines: string[]) => void;
  onChange?: (line: string) => void;
  caret?: string;
  label?: string;
  delimiter?: string;
};

export type TermParamsType = {
  label: string;
  delimiter: string;
  header: string;
  caret: string;
  scrollbarSize: number;
  size: SizeType;
};
