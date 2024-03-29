import { TemplateEngine, ITemplateEngine } from '@neuint/term-js';

import template from './template.html';
import './index.scss';

class ContextMenuView extends TemplateEngine implements ITemplateEngine {
  private reRender = false;

  constructor(container: HTMLElement) {
    super(template, container);
  }

  public render() {
    super.render({}, this.reRender ? { replace: this } : {});
    this.reRender = true;
  }
}

export default ContextMenuView;
