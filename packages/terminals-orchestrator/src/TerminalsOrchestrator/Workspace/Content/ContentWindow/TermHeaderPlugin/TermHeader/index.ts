import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import { IS_MAC } from '@general/utils/browser';

import ITermHeader from './ITermHeader';
import { OptionsType } from './types';
import SelectInput from '../../../../SelectInput';
import ISelectInput from '../../../../SelectInput/ISelectInput';

class TermHeader extends TemplateEngine implements ITermHeader {
  public get draggableElement(): HTMLElement {
    return this.getRef('inputContainer') as HTMLElement;
  }

  private readonly options: OptionsType;
  private selectInput: ISelectInput;

  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.options = options;
    this.render();
    this.selectInput = new SelectInput(this.getRef('inputContainer') as HTMLElement, {
      className: css.input, value: options.title, disabled: true,
      onSubmit: this.submitTitleHandler, onBlur: this.submitTitleHandler,
    });
  }

  public render() {
    super.render({ css, reverse: IS_MAC ? '' : css.reverse });
    this.addListeners();
  }

  public destroy() {
    this.removeListeners();
    this.selectInput.destroy();
    super.destroy();
  }

  private addListeners() {
    const { onClose } = this.options;
    const rename = this.getRef('rename') as HTMLElement;
    const close = this.getRef('rename') as HTMLElement;
    if (onClose) close.addEventListener('click', onClose);
    rename.addEventListener('click', this.onRename);
  }

  private removeListeners() {
    const { onClose } = this.options;
    const rename = this.getRef('rename') as HTMLElement;
    const close = this.getRef('rename') as HTMLElement;
    if (onClose) close.removeEventListener('click', onClose);
    rename.removeEventListener('click', this.onRename);
  }

  private submitTitleHandler = () => {
    const { options: { onRename }, selectInput } = this;
    selectInput.disabled = true;
    if (onRename) onRename(selectInput.value);
  }

  private onRename = () => {
    const { selectInput } = this;
    const { onRenaming } = this.options;
    selectInput.disabled = false;
    selectInput.focus();
    selectInput.select();
    if (onRenaming) onRenaming();
  }
}

export default TermHeader;
