import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';
import { ValueType } from '@Term/types';
import IInput from '@Term/Line/Input/IInput';
import ILabel from '@Term/Line/Label/ILabel';

export default interface ILine extends ITemplateEngine, IVirtualizedItem<ITemplateEngine> {
  label?: ILabel;
  input?: IInput;
  value: ValueType;
  secret: boolean;
  disabled: boolean;
  stopEdit(): void;
  focus(): void;
  updateViewport(): void;
  setCaret(name: string): void;
  destroy(): void;
  moveCaretToEnd(isForce?: boolean): void;
  clear(): void;
}
