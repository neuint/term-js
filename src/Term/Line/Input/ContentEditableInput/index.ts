import template from './template.html';
import css from './index.scss';

import IInput from '@Term/Line/Input/IInput';
import { ValueType } from '@Term/types';
import BaseInput from '@Term/Line/Input/BaseInput';

class ContentEditableInput extends BaseInput implements IInput {
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

  public set value(val: ValueType) {
    this.valueField = val;
    const root = this.getRef('input') as HTMLElement;
    if (root) root.innerHTML = BaseInput.getValueTemplate(this.valueField);
  }

  constructor(container?: Element) {
    super(template, container);
  }

  public write(value: ValueType, delay?: number): Promise<boolean> {
    throw new Error('Needs implementation');
  }

  public moveCaretToEnd(isForce: boolean = false) {
    const root = this.getRef('input') as HTMLElement;
    if (isForce) this.focus();
    if (!root || document.activeElement !== root) return;
  }

  private changeHandler = (e: Event) => {

  }
}

export default ContentEditableInput;
