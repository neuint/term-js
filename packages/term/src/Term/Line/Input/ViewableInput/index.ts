import template from './template.html';
import css from './index.scss';

import IInput from '@Term/Line/Input/IInput';
import BaseInput from '@Term/Line/Input/BaseInput';
import { ValueType } from '@Term/types';

class ViewableInput extends BaseInput implements IInput {
  public set value(val: ValueType) {
    this.valueField = val;
    const root = this.getRef('input') as HTMLElement;
    if (root) root.innerHTML = BaseInput.getValueTemplate(this.valueField);
  }

  constructor(container?: Element) {
    super(template, container, css);
  }

  public render() {
    super.render({ css, value: BaseInput.getValueTemplate(this.valueField) });
  }

  // tslint:disable-next-line:no-empty
  public moveCaretToEnd(isForce: boolean = false) {}

  protected getRootElement(): Element | undefined {
    return this.getRef('input');
  }

  protected getEditElement(): Element | undefined {
    return this.getRef('input');
  }
}

export default ViewableInput;
