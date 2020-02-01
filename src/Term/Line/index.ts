import ILine from './ILine';
import { NON_BREAKING_SPACE } from '../constants/strings';

import css from './index.scss';

class Line implements ILine {
  private container: Element;
  private value: string = '';
  private label: string = '';
  private delimiter: string = '';

  protected readonly containers: {
    [key: string]: Element;
  } = {};

  constructor(
    container: Element,
    params: { value?: string; label?: string; delimiter?: string } = {},
  ) {
    const { label = 'guest', value = '', delimiter = '~' } = params;
    this.value = value;
    this.label = label;
    this.delimiter = delimiter;
    this.container = container;
    this.addLineElements();
  }

  protected addLineElements() {
    const { containers, container } = this;
    const wrapper = document.createElement('div');
    wrapper.className = css.wrapper;
    containers.wrapper = wrapper;
    this.addLabel();
    container.appendChild(wrapper);
  }

  protected addLabel() {
    const { containers, label, delimiter } = this;
    const labelWrapper = document.createElement('div');
    const labelTextContainer = document.createElement('div');
    const labelText = document.createElement('span');
    const labelDelimiterContainer = document.createElement('div');
    const labelDelimiter = document.createElement('span');
    labelWrapper.className = css.labelWrapper;
    labelTextContainer.className = css.labelTextContainer;
    labelText.className = css.labelText;
    labelDelimiter.className = css.labelText;
    labelTextContainer.appendChild(labelText);
    labelDelimiterContainer.appendChild(labelDelimiter);
    if (label) {
      labelTextContainer.innerHTML = `${label}${NON_BREAKING_SPACE}`;
      labelWrapper.appendChild(labelTextContainer);
    }
    if (delimiter) {
      labelDelimiter.innerHTML = `${delimiter}${NON_BREAKING_SPACE}`;
      labelWrapper.appendChild(labelDelimiterContainer);
    }
    containers.labelWrapper = labelWrapper;
    containers.labelTextContainer = labelTextContainer;
    containers.labelText = labelText;
    containers.labelDelimiterContainer = labelDelimiterContainer;
    containers.labelDelimiter = labelDelimiter;
    containers.wrapper.appendChild(labelWrapper);
  }
}

export default Line;
