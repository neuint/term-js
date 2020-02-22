export type ValueFragmentType = string | {
  str: string;
  clickHandler?: () => void;
  lock?: boolean;
  className?: string;
};

export type ValueType = string | ValueFragmentType[];
