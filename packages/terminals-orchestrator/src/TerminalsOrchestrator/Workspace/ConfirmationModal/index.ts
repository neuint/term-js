import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import { ENTER_KEY_CODE, ESC_KEY_CODE } from '@general/constants/keyCodes';
import { stopPropagation } from '@general/utils/event';
import { Emitter, EMITTER_TOP_LAYER_TYPE } from 'key-layers-js';
import IConfirmationModal from './IConfirmationModal';
import { OptionsType } from './types';

class ConfirmationModal extends TemplateEngine implements IConfirmationModal {
  private readonly options: OptionsType;
  private readonly emitter: Emitter;

  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.options = options;
    this.render();
    this.emitter = new Emitter(EMITTER_TOP_LAYER_TYPE);
    this.addListeners();
  }

  public render() {
    const { title, text, submit, cancel, onSubmit, onCancel } = this.options;
    super.render({
      css, title, text, submit: onSubmit ? submit : '', cancel: onCancel ? cancel : '',
    });
  }

  public destroy() {
    this.removeListeners();
    this.emitter.destroy();
    super.destroy();
  }

  private addListeners() {
    const { emitter, options: { onSubmit, onCancel } } = this;
    const root = this.getRef('root') as HTMLElement;
    root.addEventListener('click', stopPropagation);
    if (onSubmit) {
      const submit = this.getRef('submit');
      if (submit) submit.addEventListener('click', onSubmit);
      emitter.addListener('keyDown', onSubmit, { code: ENTER_KEY_CODE });
    }
    if (onCancel) {
      const cancel = this.getRef('cancel');
      const overlay = this.getRef('overlay') as HTMLElement;
      overlay.addEventListener('click', onCancel);
      if (cancel) cancel.addEventListener('click', onCancel);
      emitter.addListener('keyDown', onCancel, { code: ESC_KEY_CODE });
    }
  }

  private removeListeners() {
    const { emitter, options: { onSubmit, onCancel } } = this;
    if (onSubmit) {
      const submit = this.getRef('submit');
      if (submit) submit.removeEventListener('click', onSubmit);
      emitter.removeListener('keyDown', onSubmit);
    }
    if (onCancel) {
      const cancel = this.getRef('cancel');
      const overlay = this.getRef('overlay') as HTMLElement;
      overlay.removeEventListener('click', onCancel);
      if (cancel) cancel.removeEventListener('click', onCancel);
      emitter.removeListener('keyDown', onCancel);
    }
  }
}

export default ConfirmationModal;
