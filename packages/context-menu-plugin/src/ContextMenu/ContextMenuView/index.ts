import { TemplateEngine, ITemplateEngine } from '@term-js/term';

import template from './template.html';
import css from './index.scss';

class ContextMenuView extends TemplateEngine implements ITemplateEngine {
  private reRender: boolean = false;
  constructor(container: HTMLElement) {
    super(template, container);
  }

  public render() {
    super.render({ css }, this.reRender ? { replace: this } : {});
    this.reRender = true;
  }
}

export default ContextMenuView;
