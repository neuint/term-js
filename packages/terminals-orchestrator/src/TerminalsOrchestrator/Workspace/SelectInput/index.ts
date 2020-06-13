import { TemplateEngine } from '@term-js/term';
import { ENTER_KEY_CODE } from '@general/constants/keyCodes';

import template from './template.html';
import css from './index.scss';

import ISelectInput from '@TerminalsOrchestrator/Workspace/SelectInput/ISelectInput';
import { OptionsType } from '@TerminalsOrchestrator/Workspace/SelectInput/types';

class SelectInput extends TemplateEngine implements ISelectInput {
  private isDisabled: boolean = false;
  public get disabled(): boolean {
    return this.isDisabled;
  }
  public set disabled(val: boolean) {
    const { isDisabled } = this;
    this.isDisabled = val;
    if (isDisabled === val) return;
    const root = this.getRef('root') as HTMLElement;
    if (val) {
      root.classList.add(css.disabled);
      root.setAttribute('disabled', 'true');
    } else {
      root.removeAttribute('disabled');
      root.classList.remove(css.disabled);
    }
  }

  public get value(): string {
    const root = this.getRef('root') as HTMLInputElement;
    return root.value;
  }

  public set value(val: string) {
    const root = this.getRef('root') as HTMLInputElement;
    root.value = val;
  }

  private options: OptionsType;
  constructor(container: HTMLElement, options: OptionsType = { value: '' }) {
    super(template, container);
    this.options = options;
    this.render();
    this.addListeners();
  }

  public render() {
    const { value, disabled = false, className = '' } = this.options;
    super.render({ css, className });
    this.disabled = disabled;
    (this.getRef('root') as HTMLInputElement).value = value;
  }

  public select() {
    const root = this.getRef('root') as HTMLInputElement;
    root.select();
  }

  public focus() {
    const root = this.getRef('root') as HTMLInputElement;
    root.focus();
  }

  public blur() {
    const root = this.getRef('root') as HTMLInputElement;
    root.blur();
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  private addListeners() {
    const root = this.getRef('root') as HTMLInputElement;
    const { onBlur, onSubmit } = this.options;
    if (onBlur) root.addEventListener('blur', onBlur);
    if (onSubmit) root.addEventListener('keydown', this.keyDownHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLInputElement;
    const { onBlur, onSubmit } = this.options;
    if (onBlur) root.removeEventListener('blur', onBlur);
    if (onSubmit) root.removeEventListener('keydown', this.keyDownHandler);
  }

  private keyDownHandler = (e: KeyboardEvent) => {
    const { onSubmit } = this.options;
    const { keyCode } = e;
    if (keyCode === ENTER_KEY_CODE && onSubmit) onSubmit(e);
  }
}

export default SelectInput;
