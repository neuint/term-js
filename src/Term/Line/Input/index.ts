import template from './template.html';
import css from './index.scss';

import TemplateEngine from '@Term/TemplateEngine';
import IInput from '@Term/Line/Input/IInput';
import { ValueType } from '@Term/types';

class Input extends TemplateEngine implements IInput {
  private characterWidth: number = 16;
  private characterHeight: number = 8;
  public get characterSize(): { width: number; height: number } {
    return { width: this.characterWidth, height: this.characterHeight };
  }
  public set characterSize(size: { width: number; height: number }) {
    this.characterWidth = size.width;
    this.characterHeight = size.height;
  }

  public get caretPosition(): number {
    return 0;
  }

  public get selectedRange(): { from: number; to: number } {
    return { from: 0, to: 0 };
  }

  private valueField: ValueType = '';
  public get value(): ValueType {
    return '';
  }
  public set value(val: ValueType) {
    this.valueField = val;
  }

  private isCaretHidden: boolean = false;
  public get hiddenCaret(): boolean {
    return this.isCaretHidden;
  }
  public set hiddenCaret(isCaretHidden: boolean) {
    if (this.isCaretHidden === isCaretHidden) return;
    const root = this.getRef('input') as HTMLElement;
    if (isCaretHidden) {
      root.classList.add(css.hiddenCaret);
    } else {
      root.classList.remove(css.hiddenCaret);
    }
    this.isCaretHidden = isCaretHidden;
  }

  constructor(container?: Element) {
    super(template, container);
    this.render({ css });
  }

  public write(value: ValueType, delay?: number): Promise<boolean> {
    throw new Error('Needs implementation');
  }

  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    const root = this.getRef('input') as HTMLElement;
    root.addEventListener(type, listener, options);
  }

  public removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) {
    const root = this.getRef('input') as HTMLElement;
    root.removeEventListener(type, listener, options);
  }

  public focus() {
    const root = this.getRef('input') as HTMLElement;
    root.focus();
  }
}

export default Input;
