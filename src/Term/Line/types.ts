import { ValueType } from '@Term/types';
import ILine from '@Term/Line/ILine';
import ICaret from '@Term/BaseCaret/ICaret';

export type ParamsType = {
  caret?: string;
  value?: ValueType;
  label?: string;
  delimiter?: string;
  onSubmit?: (params: {
    value: string; formattedValue: ValueType; lockString: string;
  }) => void;
  onChange?: (value: string) => void;
  onUpdateCaretPosition?: (caretPosition: number, caret?: ICaret) => void;
  editable?: boolean;
  className?: string;
  append?: boolean;
  ref?: ILine;
  secret?: boolean;
};
