import { isNull, isUndefined, noop } from 'lodash-es';

import { DOWN_CODE, ENTER_CODE, LEFT_CODE, RIGHT_CODE, UP_CODE } from '@Term/constants/keyCodes';
import { getKeyCode } from '@Term/utils/event';
import ICaret from '@Term/BaseCaret/ICaret';
import ICaretFactory from '@Term/CaretFactory/ICaretFactory';
import CaretFactory from '@Term/CaretFactory';
import { LOCK_TIMEOUT } from '@Term/Line/constants';
import lineTemplate from './template.html';
import TemplateEngine from '../TemplateEngine';
import ILine from './ILine';
import { NON_BREAKING_SPACE } from '../constants/strings';

import css from './index.scss';

class Line extends TemplateEngine implements ILine {
  private static cf: ICaretFactory = CaretFactory.getInstance();

  private valueField: string = '';
  public get value(): string {
    return this.valueField;
  }

  private hiddenField: boolean = false;
  public get hidden(): boolean {
    return this.hiddenField;
  }

  private heightField: number = 0;
  public get height(): number {
    return this.heightField;
  }

  private label: string = '';
  private caret?: ICaret;
  private animationFrame?: any;
  private delimiter: string = '';
  private className: string = '';
  private editable: boolean;
  private onSubmit: (value: string) => void = noop;
  private readonly onChange: (value: string) => void = noop;
  private lockTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    container: Element,
    params: {
      caret?: string;
      value?: string;
      label?: string;
      delimiter?: string;
      onSubmit?: (value: string) => void;
      onChange?: (value: string) => void;
      editable?: boolean;
      className?: string;
    } = {},
  ) {
    super(lineTemplate, container);
    const { label = '', value = '', delimiter = '~', onChange = noop, onSubmit = noop,
      editable = true, caret = 'simple', className = '' } = params;
    this.valueField = value;
    this.className = className;
    this.label = label;
    this.delimiter = delimiter;
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.editable = editable;
    this.container = container;
    this.render();
    this.setCaret(caret);
    this.addEventListeners();
  }

  get characterSize() {
    const { offsetWidth, offsetHeight } = this.getRef('helpContainer') as HTMLElement;
    return { width: offsetWidth, height: offsetHeight };
  }

  public stopEdit() {
    this.removeCaret();
    this.removeEventListeners();
    this.editable = false;
    this.render();
  }

  public focus() {
    const input = this.getRef('input') as HTMLInputElement;
    if (!input) return;
    if (document.activeElement === input) return;
    input.focus();
    input.value = input.value;
  }

  public render() {
    const { label, delimiter, value, editable, className } = this;
    const root = this.getRef('root');
    super.render({
      css,
      label,
      delimiter,
      editable,
      className,
      value: editable ? value : value.replace(/\s/g, NON_BREAKING_SPACE),
      nbs: NON_BREAKING_SPACE,
    }, root);
    if (editable) this.updateInputSize();
  }

  public setCaret(name: string = 'simple') {
    const input = this.getRef('input');
    this.removeCaret();
    const caret = Line.cf.create(name, this.getRef('inputContainer') as Element);
    if (caret) {
      input?.classList.add(css.customCaret);
    } else {
      input?.classList.remove(css.customCaret);
      return;
    }
    this.caret = caret;
    this.updateCaretData();
  }

  public updateViewport() {
    this.updateInputSize();
  }

  public destroy() {
    super.destroy();
    const { lockTimeout } = this;
    if (lockTimeout) clearTimeout(lockTimeout);
    this.removeCaret();
    this.removeEventListeners();
  }

  public moveCaretToEnd() {
    const input = this.getRef('input') as HTMLTextAreaElement;
    if (!input || document.activeElement !== input) return;
    input.selectionStart = input.selectionEnd = input.value.length;
  }

  public show(append: boolean = false, target?: HTMLElement) {
    this.hiddenField = false;
    return target ? this.showWithTarget(append, target) : this.showWithoutTarget(append);
  }

  public hide() {
    const { container } = this;
    const root = this.getRef('root');
    this.hiddenField = true;
    if (!root || !container) return;
    container.removeChild(root);
  }

  public clear() {
    const input = this.getRef('input');
    if (this.editable) {
      (input as HTMLInputElement).value = '';
    } else {
      (input as HTMLElement).innerHTML = '';
    }
  }

  private showWithoutTarget(append: boolean) {
    const container = this.container as HTMLElement;
    const root = this.getRef('root') as HTMLElement;
    if (append) return container.appendChild(root);
    const { childNodes } = container;
    if (!childNodes.length) return container.appendChild(root);
    container.insertBefore(root, childNodes[0]);
  }

  private showWithTarget(append: boolean = false, target: HTMLElement) {
    const container = this.container as HTMLElement;
    const root = this.getRef('root') as HTMLElement;
    const { childNodes } = container;
    if (!childNodes.length) return container.appendChild(root);
    if (!Array.prototype.includes.call(childNodes, target)) return;
    if (!append) return container.insertBefore(root, target);
    let refElement;
    Array.prototype.find.call(childNodes, (childNode: HTMLElement, index: number): boolean => {
      if (childNode === target) {
        refElement = childNodes[index + 1];
        return true;
      }
      return false;
    });
    return refElement
      ? container.insertBefore(root, refElement)
      : container.appendChild(root);
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

  private submitHandler = (e: KeyboardEvent): void => {
    const { onSubmit } = this;
    e.preventDefault();
    this.valueField = (this.getRef('input') as HTMLInputElement).value;
    return onSubmit(this.value);
  }

  private changeHandler = () => {
    const value = (this.getRef('input') as HTMLInputElement).value;
    this.updateInputSize();
    this.lockCaret();
    this.onChange(value);
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
    if (Number(input.getAttribute('rows')) !== count) {
      input.setAttribute('rows', String(count));
      this.updateHeight();
    }
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
    this.animationFrame = window.requestAnimationFrame(this.updateCaretData);
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
