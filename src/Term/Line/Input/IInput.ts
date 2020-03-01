import { ValueType } from '@Term/types';
import ITemplateEngine from '@Term/TemplateEngine/ITemplateEngine';

export default interface IInput extends ITemplateEngine {
  characterSize: { width: number; height: number };
  value: ValueType;
  lockString: string;
  caretPosition: number;
  selectedRange: { from: number; to: number };
  hiddenCaret: boolean;
  getSimpleValue(): string;
  focus(): void;
  write(value: ValueType, delay?: number): Promise<boolean>;
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
  moveCaretToEnd(): void;
}
