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

  public get width(): number {
    const root = this.getRef('root');
    return root ? (root as HTMLElement).offsetWidth : 0;
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

  private isInvisible: boolean;
  public set invisible(val: boolean) {
    if (this.isInvisible === val) return;
    this.isInvisible = val;
    const root = this.getRef('root');
    if (!root) return;
    if (val) root.classList.add(css.invisible);
    else root.classList.remove(css.invisible);
  }
  public get invisible(): boolean {
    return this.isInvisible;
  }

  private isHiddenField: boolean = false;
  public set hidden(val: boolean) {
    if (this.isHiddenField === val) return;
    this.isHiddenField = val;
    const root = this.getRef('root');
    if (!root) return;
    if (val) root.classList.add(css.hidden);
    else root.classList.remove(css.hidden);
  }
  public get hidden(): boolean {
    return this.isHiddenField;
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
    this.isInvisible = options.invisible || false;
    this.titleField = options.title || '';
    this.indexField = options.index === undefined ? -1 : options.index;
    this.render();
  }

  public render() {
    const { title, active, shortcut, index } = this;
    super.render({
      shortcut,
      css,
      title: escapeString(title),
      active: active ? css.active : '',
      reverse: IS_MAC ? '' : css.reverse,
      first: index === 0 ? css.first : '',
      invisible: this.isInvisible ? css.invisible : '',
      hidden: this.isHiddenField ? css.hidden : '',
    });
  }
}

export default Tab;
