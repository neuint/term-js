import template from './template.html';
import css from './index.scss';

import { IS_MAC } from 'utils/browser';
import { escapeString } from 'utils/string';
import { TemplateEngine } from '@term-js/term';
import ITab from '@TerminalsOrchestrator/Workspace/Tab/ITab';
import {
  EventHandlerType,
  TabOptionsType,
  EventType,
  ClickEventHandlerType, DragEventHandlerType,
} from '@TerminalsOrchestrator/Workspace/Tab/types';

class Tab extends TemplateEngine implements ITab {
  private indexField: number = -1;
  public set index(val: number) {
    const { indexField } = this;
    this.indexField = val;
    const shortcutText = this.getRef('shortcutText');
    if (shortcutText && val !== indexField) shortcutText.innerHTML = this.shortcut;
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

  private handlers: {
    click: ClickEventHandlerType[];
    close: ClickEventHandlerType[];
    drag: DragEventHandlerType[];
    dragend: DragEventHandlerType[];
  } = { click: [], close: [], drag: [], dragend: [] };

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
    this.addListeners();
  }

  public addEventListener(event: EventType, handler: EventHandlerType) {
    const list = this.handlers[event];
    if (list) list.push(handler as ClickEventHandlerType);
  }

  public removeEventListener(event: EventType, handler: EventHandlerType) {
    const list = this.handlers[event];
    if (!list) return;
    const index = list.indexOf(handler as ClickEventHandlerType);
    if (index >= 0) list.splice(index, 1);
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  private addListeners() {
    const root = this.getRef('root') as HTMLElement;
    const close = this.getRef('close') as HTMLElement;
    root.addEventListener('click', this.clickHandler);
    root.addEventListener('dragstart', this.dragStartHandler);
    root.addEventListener('drag', this.dragHandler);
    document.addEventListener('dragover', this.dragoverHandler);
    root.addEventListener('dragend', this.dragEndHandler);
    close.addEventListener('click', this.closeHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLElement;
    const close = this.getRef('close') as HTMLElement;
    root.removeEventListener('click', this.clickHandler);
    root.removeEventListener('dragstart', this.dragStartHandler);
    root.removeEventListener('drag', this.dragHandler);
    document.removeEventListener('dragover', this.dragoverHandler);
    root.addEventListener('dragend', this.dragEndHandler);
    close.removeEventListener('click', this.closeHandler);
  }

  private clickHandler = (e: Event) => {
    const { index, handlers } = this;
    handlers.click.forEach(handler => handler(index, e));
  }

  private closeHandler = (e: Event) => {
    const { index, handlers } = this;
    e.stopPropagation();
    handlers.close.forEach(handler => handler(index, e));
  }

  private dragStartHandler = () => {
    const root = this.getRef('root') as HTMLElement;
    root.classList.add(css.draggable);
  }

  private dragHandler = (e: DragEvent) => {
    const { handlers, index } = this;
    handlers.drag.forEach(handler => handler(index, e));
  }

  private dragEndHandler = (e: DragEvent) => {
    const { handlers, index } = this;
    const root = this.getRef('root') as HTMLElement;
    root.classList.remove(css.draggable);
    handlers.dragend.forEach(handler => handler(index, e));
  }

  private dragoverHandler = (e: DragEvent) => {
    e.preventDefault();
  }
}

export default Tab;
