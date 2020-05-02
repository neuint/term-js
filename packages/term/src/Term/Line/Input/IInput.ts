import { ValueType } from '@Term/types';
import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface IInput extends ITemplateEngine {
  characterSize: { width: number; height: number };
  value: ValueType;
  lockString: string;
  caretPosition: number;
  disabled: boolean;
  selectedRange: { from: number; to: number };
  hiddenCaret: boolean;
  isFocused: boolean;
  secret: boolean;
  getSimpleValue(showSecret?: boolean): string;
  focus(): void;
  blur(): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  moveCaretToEnd(isForce?: boolean): void;
  getCaretOffset(): { left: number; top: number };
  getEndOffset(): { left: number; top: number };
}
