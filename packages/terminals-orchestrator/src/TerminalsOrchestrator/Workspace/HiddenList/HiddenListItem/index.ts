import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import IHiddenListItem from './IHiddenListItem';

class HiddenListItem extends TemplateEngine implements IHiddenListItem {
  private text: string;
  private index: number;
  constructor(container: HTMLElement, options: { text: string; index: number }) {
    super(template, container);
    this.text = options.text;
    this.index = options.index;
    this.render();
  }

  public render() {
    const { text, index } = this;
    super.render({ css, text, index });
  }
}

export default HiddenListItem;
