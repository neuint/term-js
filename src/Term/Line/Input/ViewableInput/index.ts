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

  public write(value: ValueType, delay?: number): Promise<boolean> {
    throw new Error('Needs implementation');
  }

  public render() {
    super.render({ css, value: BaseInput.getValueTemplate(this.valueField) });
  }
}

export default ViewableInput;
