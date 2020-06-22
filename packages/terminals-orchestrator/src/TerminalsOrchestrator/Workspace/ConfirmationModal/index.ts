import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import IConfirmationModal from './IConfirmationModal';
import { OptionsType } from './types';

class ConfirmationModal extends TemplateEngine implements IConfirmationModal {
  private readonly options: OptionsType;
  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.options = options;
    this.render();
  }

  public render() {
    const { title, text, submit, cancel, onSubmit, onCancel } = this.options;
    super.render({
      css, title, text, submit: onSubmit ? submit : '', cancel: onCancel ? cancel : '',
    });
    this.addListeners();
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  private addListeners() {
    const { onSubmit, onCancel } = this.options;
    const submit = this.getRef('submit');
    const cancel = this.getRef('cancel');
    if (submit && onSubmit) submit.addEventListener('click', onSubmit);
    if (cancel && onCancel) cancel.addEventListener('click', onCancel);
  }

  private removeListeners() {
    const { onSubmit, onCancel } = this.options;
    const submit = this.getRef('submit');
    const cancel = this.getRef('cancel');
    if (submit && onSubmit) submit.removeEventListener('click', onSubmit);
    if (cancel && onCancel) cancel.removeEventListener('click', onCancel);
  }
}

export default ConfirmationModal;
