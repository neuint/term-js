import { isNull, isString, isUndefined, noop } from 'lodash-es';
import escapeHTML from 'escape-html';

import css from './index.scss';
import lineTemplate from './template.html';

import { DOWN_CODE, ENTER_CODE, LEFT_CODE, RIGHT_CODE, UP_CODE } from '@Term/constants/keyCodes';
import { getKeyCode } from '@Term/utils/event';
import ICaret from '@Term/BaseCaret/ICaret';
import ICaretFactory from '@Term/CaretFactory/ICaretFactory';
import CaretFactory from '@Term/CaretFactory';
import { LOCK_TIMEOUT } from '@Term/Line/constants';
import {
  FormattedValueFragmentType,
  FormattedValueType,
  ValueFragmentType,
  ValueType,
} from '@Term/types';
import { getStartIntersectionString } from '@Term/utils/string';
import TemplateEngine from '../TemplateEngine';
import ILine from './ILine';
import Input from './Input';
import { NON_BREAKING_SPACE } from '../constants/strings';
import IInput from '@Term/Line/Input/IInput';
import { ParamsType } from '@Term/Line/types';

class Line extends TemplateEngine implements ILine {
  public static getHeight(
    params: {
      delimiter?: string;
      label?: string;
      value: string;
      width: number;
      itemSize: { width: number; height: number },
    },
  ): number {
    const { delimiter, label, value, width, itemSize } = params;
    const { width: itemWidth, height: itemHeight } = itemSize;
    const labelLength = (delimiter ? delimiter.length + 1 : 0)
      + (label ? label.length + 1 : 0);
    const rowItemsCount = Math
      .floor((width - Line.itemHorizontalPadding - labelLength * itemWidth) / itemWidth);
    return Math.ceil((value.length || 1) / rowItemsCount) * itemHeight
      + 2 * Line.itemVerticalPadding;
  }

  public static getLockString(value: ValueType): string {
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

  private static getUpdatedValueField(value: string, prevValue: ValueType): ValueType {
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
    updatedValueField.push(checkValue);
    return updatedValueField;
  }

  public static getValueString(value: ValueType): string {
    if (isString(value)) return value;
    return value.reduce((
      acc: string, item: ValueFragmentType,
    ): string => `${acc}${isString(item) ? item : item.str}`, '');
  }

  private static getNormalizedTemplateString(str: string): string {
    return escapeHTML(str).replace(/\s/g, NON_BREAKING_SPACE);
  }

  private static getValueFragmentTemplate(valueFragment: ValueFragmentType, index: number): string {
    if (isString(valueFragment)) return Line.getNormalizedTemplateString(valueFragment);
    const { str, className } = valueFragment;
    const normalizedString = Line.getNormalizedTemplateString(str);
    return `<span ref="fragment-${index}" class="${className || ''}">${normalizedString}</span>`;
  }

  private static getValueTemplate(value: ValueType): string {
    if (isString(value)) return Line.getNormalizedTemplateString(value);
    return value.reduce((acc: string, item: ValueFragmentType, index: number): string => {
      return `${acc}${Line.getValueFragmentTemplate(item, index)}`;
    }, '');
  }

  private static cf: ICaretFactory = CaretFactory.getInstance();
  private static itemVerticalPadding: number = 4;
  private static itemHorizontalPadding: number = 16;

  private valueField: ValueType = '';
  public get value(): ValueType {
    return Line.getValueString(this.valueField);
  }
  public set value(val: ValueType) {
    const input = this.getRef('input');
    const inputView = this.getRef('inputView');
    this.valueField = val;
    if (inputView) inputView.innerHTML = Line.getValueTemplate(val);
    if (this.editable) {
      (input as HTMLInputElement).value = this.value as string;
    } else {
      (input as HTMLElement).innerHTML = Line.getValueTemplate(val);
    }
    this.updateInputSize();
  }

  public get hidden(): boolean {
    return this.isHidden;
  }

  private get valueTemplate(): string {
    return Line.getValueTemplate(this.valueField);
  }

  private heightField: number = 0;
  public get height(): number {
    return this.heightField;
  }

  private label: string = '';
  private caret?: ICaret;
  private delimiter: string = '';
  private className: string = '';
  private editable: boolean;
  private onSubmit: (value: string, formattedValue: ValueType) => void = noop;
  private readonly onChange: (value: string) => void = noop;
  private lockTimeout?: ReturnType<typeof setTimeout>;
  private caretPosition: number = 0;
  private input?: IInput;

  constructor(
    container: Element,
    params: ParamsType = {},
  ) {
    super(lineTemplate, container);
    const { label = '', value = '', delimiter = '~', onChange = noop, onSubmit = noop,
      editable = true, caret, className = '' } = params;
    this.valueField = value;
    this.className = className;
    this.label = label;
    this.delimiter = delimiter;
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.editable = editable;
    this.container = container;
    this.render();
    this.setCaret(caret || 'simple');
    this.addEventListeners();
    this.updateHeight();
    this.frameHandler = this.updateCaretData;
    if (this.editable) {
      this.registerFrameHandler();
      this.moveCaretToEnd(true);
    }
  }

  get characterSize() {
    const { offsetWidth, offsetHeight } = this.getRef('helpContainer') as HTMLElement;
    return { width: offsetWidth, height: offsetHeight };
  }

  public stopEdit() {
    this.removeCaret();
    this.removeEventListeners();
    this.editable = false;
    this.unregisterFrameHandler();
    this.render();
  }

  public focus() {
    if (this.input) this.input.focus();
  }

  public render() {
    const { label, delimiter, editable, className, valueTemplate } = this;
    const root = this.getRef('root');
    super.render({
      css, label, delimiter, editable, className, valueTemplate, nbs: NON_BREAKING_SPACE,
    }, root ? { replace: this } : {});
    if (editable) this.input = new Input(this.getRef('inputContainer') as HTMLElement);
  }

  public setCaret(name: string = 'simple') {
    const input = this.getRef('input');
    this.removeCaret();
    const caret = Line.cf.create(name, this.getRef('inputContainer') as Element);
    if (caret && this.editable) {
      input?.classList.add(css.customCaret);
    } else {
      input?.classList.remove(css.customCaret);
      return;
    }
    this.caret = caret;
    this.updateCaretData();
  }

  public updateViewport() {
    const { isHidden } = this;
    if (isHidden) this.show();
    this.updateInputSize();
    if (isHidden) this.hide();
  }

  public destroy() {
    super.destroy();
    const { lockTimeout } = this;
    if (lockTimeout) clearTimeout(lockTimeout);
    this.removeCaret();
    this.removeEventListeners();
  }

  public moveCaretToEnd(isForce: boolean = false) {
    const input = this.getRef('input') as HTMLTextAreaElement;
    if (isForce) this.focus();
    if (!input || document.activeElement !== input) return;
    input.selectionStart = input.selectionEnd = input.value.length;
    this.caretPosition = input.selectionEnd;
  }

  public clear() {
    this.value = '';
  }

  private addEventListeners() {
    const { editable } = this;
    if (editable) {
      const input = this.getRef('input') as HTMLElement;
      input.addEventListener('keydown', this.keyDownHandler);
      input.addEventListener('input', this.changeHandler);
      input.addEventListener('cut', this.changeHandler);
      input.addEventListener('paste', this.changeHandler);
    }
  }

  private removeEventListeners() {
    const { editable } = this;
    if (editable) {
      const input = this.getRef('input') as HTMLElement;
      input.removeEventListener('keydown', this.keyDownHandler);
      input.removeEventListener('input', this.changeHandler);
      input.removeEventListener('cut', this.changeHandler);
      input.removeEventListener('paste', this.changeHandler);
    }
  }

  private keyDownHandler = (e: KeyboardEvent) => {
    (({
      [ENTER_CODE]: this.submitHandler,
      [LEFT_CODE]: this.lockCaret,
      [RIGHT_CODE]: this.lockCaret,
      [UP_CODE]: this.lockCaret,
      [DOWN_CODE]: this.lockCaret,
    } as { [code: number]: (e: KeyboardEvent) => void })[Number(getKeyCode(e))] || noop)(e);
  }

  private submitHandler = (e: Event): void => {
    const { onSubmit } = this;
    e.preventDefault();
    this.updateValueField();
    return onSubmit(this.value as string, this.valueField);
  }

  private changeHandler = () => {
    if (!this.preventLockUpdate()) {
      const inputView = (this.getRef('inputView') as HTMLInputElement);
      this.updateValueField();
      this.updateInputSize();
      this.lockCaret();
      inputView.innerHTML = this.valueTemplate;
      this.onChange(this.value as string);
    }
  }

  private preventLockUpdate(): boolean {
    const { valueField } = this;
    if (isString(valueField)) return false;
    const input = this.getRef('input') as HTMLTextAreaElement;
    const { value } = input;
    const lockStr = Line.getLockString(valueField);
    if (lockStr && value.indexOf(lockStr) !== 0) {
      const newCaretPosition = lockStr.length;
      input.value = this.value as string;
      input.selectionStart = input.selectionEnd = newCaretPosition;
      this.caretPosition = newCaretPosition;
      return true;
    }
    this.caretPosition = input.selectionEnd;
    return false;
  }

  private updateValueField() {
    return this.valueField = Line.getUpdatedValueField(
      (this.getRef('input') as HTMLInputElement).value,
      this.valueField,
    );
  }

  private updateInputSize = () => {
    const { width } = this.characterSize;
    const inputContainer = this.getRef('inputContainer');
    const input = this.getRef('input') as HTMLInputElement;
    const { offsetWidth } = inputContainer as HTMLElement;
    if (!input) return this.updateRowsCount(2);
    const value = this.editable ? input.value : input.innerHTML;
    if (!width || !value || !offsetWidth) return this.updateRowsCount(2);
    const rowLength = Math.floor(offsetWidth / width);
    this.updateRowsCount(Math.ceil(value.length / rowLength) + 1);
  }

  private updateRowsCount(count: number) {
    const input = this.getRef('input') as HTMLInputElement;
    if (this.editable && input && Number(input.getAttribute('rows')) !== count) {
      input.setAttribute('rows', String(count));
    }
    this.updateHeight();
  }

  private updateHeight = () => {
    const root = this.getRef('root') as HTMLInputElement;
    if (!root) return;
    this.heightField = root.offsetHeight;
  }

  private updateCaretData = () => {
    const { editable, caret } = this;
    const input = this.getRef('input');
    const { activeElement } = document;
    if (!editable || !input || !caret) return;
    const { selectionStart, selectionEnd } = input as HTMLInputElement;
    if (selectionStart === selectionEnd && activeElement === input && document.hasFocus()) {
      this.showCaret();
    } else {
      this.hideCaret();
    }
  }

  private showCaret() {
    const { caret } = this;
    const { width, height } = this.characterSize;
    const inputContainer = this.getRef('inputContainer');
    const input = this.getRef('input') as HTMLInputElement;
    if (!caret || !inputContainer) return;
    const { selectionStart, selectionEnd } = input as HTMLInputElement;
    const skip = isUndefined(selectionStart) || isUndefined(selectionEnd)
      || isNull(selectionStart) || isNull(selectionEnd);
    if (skip) return;
    const { offsetWidth } = inputContainer as HTMLElement;
    const { value } = input;
    const rowLength = Math.floor(offsetWidth / width);
    const row = Math.floor(selectionStart as number / rowLength);
    caret.hidden = false;
    const character = value[selectionStart as number] === ' '
      ? NON_BREAKING_SPACE : value[selectionStart as number] || NON_BREAKING_SPACE;
    const top = Math.round(height * row);
    const left = Math.round((selectionStart as number - row * rowLength) * width);
    caret.setPosition(left, top);
    caret.setValue(character);
  }

  private hideCaret() {
    const { caret } = this;
    if (!caret) return;
    caret.hidden = true;
  }

  private removeCaret() {
    const { caret } = this;
    if (!caret) return;
    this.caret = undefined;
    caret.destroy();
  }

  private lockCaret = () => {
    const { caret, lockTimeout } = this;
    if (lockTimeout) clearTimeout(lockTimeout);
    if (!caret) return;
    caret.lock = true;
    this.lockTimeout = setTimeout(() => caret.lock = false, LOCK_TIMEOUT);
  }
}

export default Line;
