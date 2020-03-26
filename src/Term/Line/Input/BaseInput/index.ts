import css from './index.scss';

import escapeHTML from 'escape-html';
import { isString } from 'lodash-es';

import TemplateEngine from '@Term/TemplateEngine';
import IInput from '@Term/Line/Input/IInput';
import {
  FormattedValueFragmentType,
  FormattedValueType,
  ValueFragmentType,
  ValueType,
} from '@Term/types';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';
import { getStartIntersectionString } from '@Term/utils/string';
import {
  DATA_INDEX_ATTRIBUTE_NAME, SECRET_CHARACTER,
} from '@Term/Line/Input/constants';

abstract class BaseInput extends TemplateEngine implements IInput {
  public static getValueString(value: ValueType, params: { secret?: boolean } = {}): string {
    const { secret = false } = params;
    return isString(value)
      ? secret ? BaseInput.convertSecret(value) : value
      : value.reduce((acc: string, item: ValueFragmentType): string => {
        const str = isString(item) ? item : item.str;
        const val = secret && (isString(item) || !item.lock)
          ? BaseInput.convertSecret(str) : str;
        return `${acc}${val}`;
      }, '');
  }

  protected static getFragmentTemplate(
    str: string,
    params: { className?: string; index: number; secret?: boolean },
  ): string {
    const { className = '', secret = false, index } = params;
    const composedClassName = [secret ? css.secret : '', className].join(' ');
    const processedString = BaseInput.getNormalizedTemplateString(secret
      ? BaseInput.convertSecret(str) : str);
    return `<span
      ${DATA_INDEX_ATTRIBUTE_NAME}="${index}"
      ref="fragment-${index}"
      class="${composedClassName}">${processedString}</span>`;
  }

  protected static getNormalizedTemplateString(str: string): string {
    return escapeHTML(str).replace(/\s/g, NON_BREAKING_SPACE);
  }

  protected static getValueFragmentTemplate(
    valueFragment: ValueFragmentType, index: number, params: { secret?: boolean } = {},
  ): string {
    const { secret } = params;
    if (isString(valueFragment)) {
      return BaseInput.getFragmentTemplate(valueFragment, { index, secret });
    }
    const { str, className = '', lock } = valueFragment;
    const isSecret = !lock && secret;
    return BaseInput.getFragmentTemplate(str, { className, index, secret: isSecret });
  }

  protected static getValueTemplate(value: ValueType, params: { secret?: boolean } = {}): string {
    if (isString(value)) return BaseInput.getNormalizedTemplateString(value);
    return value.reduce((acc: string, item: ValueFragmentType, index: number): string => {
      return `${acc}${BaseInput.getValueFragmentTemplate(item, index, params)}`;
    }, '');
  }

  protected static getUpdatedValueField(value: string, prevValue: ValueType): ValueType {
    if (isString(prevValue)) return value;
    let checkValue = value;
    let stop = false;
    const updatedValueField = prevValue.reduce((
      acc: FormattedValueType, item: ValueFragmentType,
    ): FormattedValueType => {
      const isStringItem = isString(item);
      const itemStr = (isStringItem ? item : (item as FormattedValueFragmentType).str) as string;
      const { str, isFull } = getStartIntersectionString(itemStr, checkValue);
      if (str && !stop) {
        acc.push(isStringItem ? str : { ...(item as FormattedValueFragmentType), str });
        checkValue = checkValue.substring(str.length);
        stop = !isFull;
      }
      return acc;
    }, [] as FormattedValueType);
    checkValue.split('').forEach(char => updatedValueField.push(char));
    return updatedValueField.filter(item => isString(item) ? item : item.str);
  }

  protected static getLockString(value: ValueType): string {
    if (isString(value)) return '';
    let str = '';
    let lockStr = '';
    value.forEach((item: ValueFragmentType) => {
      if (isString(item)) {
        str += item;
      } else {
        str += item.str;
        if (item.lock) lockStr = str;
      }
    });
    return lockStr;
  }

  private static convertSecret(str: string): string {
    return (new Array(str.length)).fill(SECRET_CHARACTER).join('');
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

  public get caretPosition(): number {
    return -1;
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

  public get lockString(): string {
    const { valueField } = this;
    return BaseInput.getLockString(valueField);
  }

  protected isCaretHidden: boolean = false;
  public get hiddenCaret(): boolean {
    return this.isCaretHidden;
  }
  public set hiddenCaret(isCaretHidden: boolean) {
    this.isCaretHidden = isCaretHidden;
  }

  protected secretField: boolean = false;
  public get secret(): boolean {
    return this.secretField;
  }
  public set secret(secret: boolean) {
    this.secretField = secret;
  }

  public get isFocused(): boolean {
    const { activeElement } = document;
    const root = this.getRef('input');
    return activeElement === root
      || activeElement?.parentNode === root
      || activeElement?.parentNode === root;
  }

  protected constructor(
    template: string, container?: Element, cssData?: { [key: string]: string },
  ) {
    super(template, container);
    this.render({ css: cssData });
    this.addHandlers();
  }

  protected addHandlers() {
    const root = this.getRootElement();
    if (root) {
      root.addEventListener('click', this.clickHandler);
      root.addEventListener('mousedown', this.mouseDownHandler);
    }
  }

  protected removeHandlers() {
    const root = this.getRootElement();
    if (root) {
      root.removeEventListener('click', this.clickHandler);
      root.removeEventListener('mousedown', this.mouseDownHandler);
    }
  }

  protected mouseDownHandler = (e: Event) => {
    const valueFieldItem = this.getEventFormattedValueFragment(e);
    if (valueFieldItem && valueFieldItem.clickHandler && valueFieldItem.lock) {
      e.preventDefault();
    }
  }

  protected clickHandler = (e: Event) => {
    const valueFieldItem = this.getEventFormattedValueFragment(e);
    if (valueFieldItem && valueFieldItem.clickHandler) {
      valueFieldItem.clickHandler(e, valueFieldItem.id);
    }
  }

  protected getValueItemString(index: number): string {
    const { valueField } = this;
    if (isString(valueField)) return index ? '' : valueField;
    const item = valueField[index];
    if (!item) return '';
    return isString(item) ? item : item.str;
  }

  protected abstract getRootElement(): Element | undefined;

  public abstract write(value: ValueType, delay?: number): Promise<boolean>;

  public getSimpleValue(showSecret: boolean = true): string {
    const { secretField } = this;
    return BaseInput.getValueString(this.valueField, { secret: secretField && !showSecret });
  }

  // tslint:disable-next-line:no-empty
  public moveCaretToEnd(isForce: boolean = false) {}

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

  public destroy() {
    this.removeHandlers();
    super.destroy();
  }

  private getEventFormattedValueFragment(e: Event): FormattedValueFragmentType | null {
    const target = e.target as Element;
    if (!target) return null;
    return this.getElementFormattedValueFragment(target);
  }

  private getElementFormattedValueFragment(element: Element): FormattedValueFragmentType | null {
    const { valueField } = this;
    if (isString(valueField)) return null;
    const dataIndex = element.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
    const valueFieldItem = dataIndex ? valueField[Number(dataIndex)] : null;
    return !valueFieldItem || isString(valueFieldItem)
      ? null : valueFieldItem as FormattedValueFragmentType;
  }
}

export default BaseInput;
