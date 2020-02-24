import { ValueType } from '@Term/types';
import ILine from '@Term/Line/ILine';

export type ParamsType = {
  caret?: string;
  value?: ValueType;
  label?: string;
  delimiter?: string;
  onSubmit?: (value: string, formattedValue: ValueType) => void;
  onChange?: (value: string) => void;
  editable?: boolean;
  className?: string;
  append?: boolean;
  ref?: ILine;
};
