import template from './template.html';
import './index.scss';

import IInput from '../IInput';
import BaseInput from '../BaseInput';
import { ValueType } from '../../../types';

class ViewableInput extends BaseInput implements IInput {
  public set value(val: ValueType) {
    this.valueField = val;
    const root = this.getRef('input') as HTMLElement;
    if (root) root.innerHTML = BaseInput.getValueTemplate(this.valueField);
  }

  constructor(container?: Element) {
    super(template, container);
  }

  public render() {
    super.render({ value: BaseInput.getValueTemplate(this.valueField) });
  }

  protected getRootElement(): Element | undefined {
    return this.getRef('input');
  }
}

export default ViewableInput;
