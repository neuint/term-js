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
  virtualizedTopOffset?: number;
  virtualizedBottomOffset?: number;
};

export type TermParamsType = {
  label: string;
  delimiter: string;
  header: string;
  caret: string;
  scrollbarSize: number;
  size: SizeType;
};

export type TermInfoElementsType = { root?: Element; edit?: Element; title?: Element };
export type TermInfoLabelType = {
  label?: string;
  delimiter?: string;
  set(params?: { label?: string; delimiter?: string }): void;
};
export type TermInfoCaretType = {
  position: number;
  offset: { left: number; top: number };
  size: { width: number; height: number };
  setCaretPosition: (position: number) => void;
};
export type TermInfoEditType = {
  value: string;
  parameterizedValue: EditLineParamsType;
  update: (params: EditLineParamsType) => void;
  endOffset: { left: number; top: number };
  focus: () => void,
  write: (
    data: string | FormattedValueFragmentType, duration?: number,
  ) => Promise<boolean> | boolean;
};
export type TermInfoLinesTypes = {
  list: string[];
  parameterizedList: ValueType[];
  update: (lines: ValueType[]) => void;
};

export type InfoType = { [key: string]: boolean | string | number }
| boolean | string | number;
