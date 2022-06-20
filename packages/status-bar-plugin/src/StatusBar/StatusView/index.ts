import { TemplateEngine } from '@term-js/term';

import template from './template.html';
import css from './index.scss';

import IStatusView from '@StatusBar/StatusView/IStatusView';

class StatusView extends TemplateEngine implements IStatusView {
  private iconField: string = '';
  public set icon(val: string) {
    this.iconField = val;
    this.render();
  }
  public get icon(): string {
    return this.iconField;
  }

  private textField: string = '';
  public set text(val: string) {
    this.textField = val;
    this.render();
  }
  public get text(): string {
    return this.textField;
  }

  private isRendered: boolean = false;

  constructor(container: HTMLElement) {
    super(template, container);
  }

  render() {
    const { icon, text, isRendered } = this;
    super.render({ css, icon, text }, isRendered ? { replace: this } : {});
    this.isRendered = true;
  }
}

export default StatusView;
