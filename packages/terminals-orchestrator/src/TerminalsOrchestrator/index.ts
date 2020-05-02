import './theme.scss';
import template from './template.html';
import css from './index.scss';

import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';
import { OptionsType } from '@TerminalsOrchestrator/types';
import { TemplateEngine } from '@term-js/term';

class TerminalsOrchestrator extends TemplateEngine implements ITerminalsOrchestrator {
  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.render();
  }

  public destroy() {
    super.destroy();
  }

  public render() {
    super.render({ css });
  }
}

export default TerminalsOrchestrator;
