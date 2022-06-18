import css from './index.scss';
import template from './template.html';

import TemplateEngine from '../../TemplateEngine';
import ITemplateEngine from '../../TemplateEngine/ITemplateEngine';
import { NON_BREAKING_SPACE } from '../../_constants/strings';

class Label extends TemplateEngine implements ITemplateEngine {
  private label = '';

  private delimiter = '';

  private reRender = false;

  public set params(params: { label?: string; delimiter?: string }) {
    this.label = params.label || this.label;
    this.delimiter = params.delimiter || this.delimiter;
    this.render();
  }

  public get params(): { label?: string; delimiter?: string } {
    const { label, delimiter } = this;
    return { label, delimiter };
  }

  constructor(container: Element, params: { label?: string; delimiter?: string } = {}) {
    super(template, container);
    this.label = params.label || '';
    this.delimiter = params.delimiter || '';
    this.render();
  }

  public render() {
    const { label, delimiter } = this;
    super.render({
      css, label, delimiter, nbs: NON_BREAKING_SPACE,
    }, this.reRender ? { replace: this } : {});
    this.reRender = true;
  }
}

export default Label;
