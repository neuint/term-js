import escapeHTML from 'escape-html';
import { isString } from 'lodash-es';

import TemplateEngine from '@Term/TemplateEngine';
import IInput from '@Term/Line/Input/IInput';
import { ValueFragmentType, ValueType } from '@Term/types';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';

abstract class BaseInput extends TemplateEngine implements IInput {
  protected static getNormalizedTemplateString(str: string): string {
    return escapeHTML(str).replace(/\s/g, NON_BREAKING_SPACE);
  }

  protected static getValueFragmentTemplate(
    valueFragment: ValueFragmentType, index: number,
  ): string {
    if (isString(valueFragment)) return BaseInput.getNormalizedTemplateString(valueFragment);
    const { str, className } = valueFragment;
    const normalizedString = BaseInput.getNormalizedTemplateString(str);
    return `<span ref="fragment-${index}" class="${className || ''}">${normalizedString}</span>`;
  }

  protected static getValueTemplate(value: ValueType): string {
    if (isString(value)) return BaseInput.getNormalizedTemplateString(value);
    return value.reduce((acc: string, item: ValueFragmentType, index: number): string => {
      return `${acc}${BaseInput.getValueFragmentTemplate(item, index)}`;
    }, '');
  }

  protected characterWidth: number = 16;
  protected characterHeight: number = 8;
  public get characterSize(): { width: number; height: number } {
    return { width: this.characterWidth, height: this.characterHeight };
  }
  public set characterSize(size: { width: number; height: number }) {
    this.characterWidth = size.width;
    this.characterHeight = size.height;
  }

  private caretPositionField: number = 0;
  public get caretPosition(): number {
    return this.caretPositionField;
  }
  public get selectedRange(): { from: number; to: number } {
    return { from: 0, to: 0 };
  }

  protected valueField: ValueType = '';
  public get value(): ValueType {
    return this.valueField;
  }
  public set value(val: ValueType) {
    this.valueField = val;
  }

  protected isCaretHidden: boolean = false;
  public get hiddenCaret(): boolean {
    return this.isCaretHidden;
  }
  public set hiddenCaret(isCaretHidden: boolean) {
    this.isCaretHidden = isCaretHidden;
  }

  protected constructor(template: string, container?: Element) {
    super(template, container);
    this.render();
  }

  public abstract write(value: ValueType, delay?: number): Promise<boolean>;

  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    const root = this.getRef('input') as HTMLElement;
    if (root) root.addEventListener(type, listener, options);
  }

  public removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) {
    const root = this.getRef('input') as HTMLElement;
    if (root) root.removeEventListener(type, listener, options);
  }

  public focus() {
    const root = this.getRef('input') as HTMLElement;
    if (root) root.focus();
  }
}

export default BaseInput;
