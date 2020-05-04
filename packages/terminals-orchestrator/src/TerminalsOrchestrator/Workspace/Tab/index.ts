import template from './template.html';
import css from './index.scss';

import { IS_MAC } from 'utils/browser';
import { escapeString } from 'utils/string';
import { TemplateEngine } from '@term-js/term';
import ITab from '@TerminalsOrchestrator/Workspace/Tab/ITab';
import { TabOptionsType } from '@TerminalsOrchestrator/Workspace/Tab/types';

class Tab extends TemplateEngine implements ITab {
  private indexField: number = -1;
  public set index(val: number) {
    const shortcutText = this.getRef('shortcutText');
    if (shortcutText && val !== this.indexField) shortcutText.innerHTML = this.shortcut;
    this.indexField = val;
  }
  public get index(): number {
    return this.indexField;
  }

  private titleField: string = '';
  public set title(val: string) {
    const title = this.getRef('title');
    if (title && val !== this.titleField) title.innerHTML = escapeString(val);
    this.titleField = val;
  }
  public get title(): string {
    return this.titleField;
  }

  private isActive: boolean = false;
  public set active(val: boolean) {
    const root = this.getRef('root');
    if (root && val !== this.isActive) {
      if (val) root.classList.add(css.active);
      else root.classList.remove(css.active);
    }
    this.isActive = val;
  }
  public get active(): boolean {
    return this.isActive;
  }

  private get shortcut(): string {
    const { index } = this;
    if (index < 0) return '';
    const shortcutNumber = index + 1;
    return IS_MAC ? `⌘${shortcutNumber}` : `alt${shortcutNumber}`;
  }

  constructor(container: HTMLElement, options: TabOptionsType) {
    super(template, container);
    this.isActive = options.active || false;
    this.titleField = options.title || '';
    this.indexField = options.index === undefined ? -1 : options.index;
    this.render();
  }

  public render() {
    const { title, active, shortcut, index } = this;
    super.render({ shortcut, css, title: escapeString(title),
      active: active ? css.active : '', reverse: IS_MAC ? '' : css.reverse,
      first: index === 0 ? css.first : '',
    });
  }
}

export default Tab;
