import template from './template.html';
import css from './index.scss';

import { ITemplateEngine, TemplateEngine } from '@term-js/term';
import { OptionsType } from '@TerminalsOrchestrator/Workspace/Content/types';
import ContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow';
import IContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow/IContentWindow';

class Content extends TemplateEngine implements ITemplateEngine {
  private readonly options: OptionsType = {};
  private contentWindows: IContentWindow[] = [];
  constructor(container: HTMLElement, options: OptionsType = {}) {
    super(template, container);
    this.options = options;
    this.render();
  }

  public render() {
    const { className = '' } = this.options;
    super.render({ css, className });
    this.contentWindows.push(new ContentWindow(this.getRef('root') as HTMLElement, {
      position: { left: 20, right: 20, top: 20, bottom: 20 },
    }));
  }
}

export default Content;
