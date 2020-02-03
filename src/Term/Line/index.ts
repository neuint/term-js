import { noop } from 'lodash-es';

import ILine from './ILine';
import { NON_BREAKING_SPACE } from '../constants/strings';

import { ENTER_CODE } from '@Term/constants/keyCodes';
import { getKeyCode } from '@Term/utils/event';
import lineTemplate from './template.html';
import TemplateEngine from '../TemplateEngine';

import css from './index.scss';

class Line extends TemplateEngine implements ILine {
  private valueField: string = '';
  public get value(): string {
    return this.valueField;
  }

  private label: string = '';
  private delimiter: string = '';
  private editable: boolean;
  private onSubmit: (value: string) => void = noop;
  private onChange: (value: string) => void = noop;

  constructor(
    container: Element,
    params: {
      value?: string;
      label?: string;
      delimiter?: string;
      onSubmit?: (value: string) => void;
      onChange?: (value: string) => void;
      editable?: boolean;
    } = {},
  ) {
    super(lineTemplate, container);
    const { label = '', value = '', delimiter = '~', onChange = noop, onSubmit = noop,
      editable = true } = params;
    this.valueField = value;
    this.label = label;
    this.delimiter = delimiter;
    this.onSubmit = onSubmit;
    this.onChange = onChange;
    this.editable = editable;
    this.container = container;
    this.render();
    this.addEventListeners();
  }

  get characterSize() {
    const { offsetWidth, offsetHeight } = this.getRef('helpContainer') as HTMLElement;
    return { width: offsetWidth, height: offsetHeight };
  }

  public stopEdit() {
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
    const { label, delimiter, value, editable } = this;
    super.render({
      css,
      label,
      delimiter,
      editable,
      value: editable ? value : value.replace(/\s/g, NON_BREAKING_SPACE),
      nbs: NON_BREAKING_SPACE,
    }, this.getRef('root'));
    if (editable) this.updateInputSize();
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

  private keyDownHandler = (e: KeyboardEvent) => {
    (({
      [ENTER_CODE]: this.submitHandler,
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
    this.onChange(value);
  }

  private updateInputSize = () => {
    const { width } = this.characterSize;
    const inputContainer = this.getRef('inputContainer');
    const input = this.getRef('input') as HTMLInputElement;
    const { offsetWidth } = inputContainer as HTMLElement;
    const { value } = input;
    if (!width || !value || !offsetWidth) return this.updateRowsCount(2);
    const rowLength = Math.floor(offsetWidth / this.characterSize.width);
    this.updateRowsCount(Math.ceil(value.length / rowLength) + 1);
  }

  private updateRowsCount(count: number) {
    const input = this.getRef('input') as HTMLInputElement;
    if (Number(input.getAttribute('rows')) !== count) {
      input.setAttribute('rows', String(count));
    }
  }
}

export default Line;
