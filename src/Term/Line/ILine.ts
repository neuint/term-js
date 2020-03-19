import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';
import { ValueType } from '@Term/types';
import IInput from '@Term/Line/Input/IInput';

export default interface ILine extends ITemplateEngine, IVirtualizedItem<ITemplateEngine> {
  input?: IInput;
  value: ValueType;
  stopEdit(): void;
  focus(): void;
  updateViewport(): void;
  setCaret(name: string): void;
  destroy(): void;
  moveCaretToEnd(isForce?: boolean): void;
  clear(): void;
}
