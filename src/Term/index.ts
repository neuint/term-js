import { noop, last, get } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';

import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';
import Line from './Line';
import ILine from './Line/ILine';

import TemplateEngine from '@Term/TemplateEngine';
import { getKeyCode } from '@Term/utils/event';
import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import { DOWN_CODE, UP_CODE } from '@Term/constants/keyCodes';

import css from './index.scss';
import './theme.scss';
import template from './template.html';
import VirtualizedList from '@Term/VirtualizedList';

class Term extends TemplateEngine implements ITerm {
  private historyField: string[] = [];
  private historyIndex: number = -1;
  private stopHistory: boolean = false;
  public get history(): string[] {
    return this.historyField;
  }

  private readonly ro: ResizeObserver;
  private readonly vl: IVirtualizedList<ILine>;
  private size: { width: number; height: number } = { width: 0, height: 0 };
  private caret?: string;
  private get lines(): ILine[] {
    return this.vl.getItems();
  }

  constructor(container: Element, params: {
    lines: string[];
    editLine?: string;
    header?: string;
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (line: string) => void;
    caret?: string;
  } = { lines: [], editLine: '' }) {
    super(template, container);
    this.size.width = (container as HTMLElement).offsetWidth;
    this.size.height = (container as HTMLElement).offsetHeight;
    this.ro = new ResizeObserver(this.observeHandler);
    this.ro.observe(container);
    this.caret = params.caret;
    this.render({ css, header: params.header });
    this.vl = new VirtualizedList(this.getRef('linesContainer') as Element);
    this.addLines(params.lines, params.editLine || '');
    this.addListeners();
    this.vl.scrollBottom();
    this.lastLineFocus();
  }

  public addEventListener<K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) {
    throw new Error('No implementation');
  }

  public removeEventListener<K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) {
    throw new Error('No implementation');
  }

  destroy() {
    const { vl } = this;
    vl.getGeneralItems().forEach(line => line.destroy());
    vl.getVirtualItems().forEach(line => line.destroy());
    this.removeListeners();
    super.destroy();
  }

  public write(data: string | string[], duration?: number) {
    throw new Error('No implementation');
  }

  public setCaret(caret: string) {
    this.caret = caret;
    const line = last(this.vl.getGeneralItems());
    if (!line) return;
    line.setCaret(caret);
  }

  public setHeader(text: string) {
    const header = this.getRef('header');
    const headerText = this.getRef('headerText') as Element;
    if (text) {
      headerText.innerHTML = text;
      header?.classList.remove(css.hidden);
    } else {
      header?.classList.add(css.hidden);
    }
  }

  private observeHandler = (entries: ResizeObserverEntry[]) => {
    const { size, vl } = this;
    const { width, height } = get(entries, '[0].contentRect');
    if (size.width !== width || size.height !== height) {
      size.width = width;
      size.height = height;
      vl.getVirtualItems().forEach((line: ILine) => line.updateViewport());
      vl.getGeneralItems().forEach((line: ILine) => line.updateViewport());
    }
  }

  private addListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.addEventListener('click', this.clickHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.removeEventListener('click', this.clickHandler);
  }

  protected addLines(lines: string[], editLine: string) {
    const { vl } = this;
    const virtualItemsContainer = vl.getVirtualItemsContainer();
    const generalItemsContainer = vl.getGeneralItemsContainer();
    if (!virtualItemsContainer || !generalItemsContainer) return;
    lines.forEach((value: string) => {
      vl.append(new Line(virtualItemsContainer, { value, editable: false, className: css.line }));
    });
    vl.append(new Line(generalItemsContainer, {
      className: css.line,
      value: editLine,
      editable: true,
      onSubmit: this.submitHandler,
      onChange: this.changeHandler,
      caret: this.caret,
    }), false);
    this.clearHistoryState();
    this.addKeyDownHandler();
  }

  private clickHandler = (e: MouseEvent) => {
    if (e.target === this.vl.getRef('root')) this.lastLineFocus();
  }

  private lastLineFocus() {
    const lastLine = last(this.vl.getGeneralItems()) as ILine;
    if (document.hasFocus()) lastLine.focus();
  }

  private submitHandler = (value: string) => {
    const { history, vl } = this;
    const virtualItemsContainer = vl.getVirtualItemsContainer();
    if (!virtualItemsContainer) return;
    if (value && last(history) !== value) this.historyField.push(value);
    vl.append(new Line(virtualItemsContainer, { value, editable: false, className: css.line }));
    vl.scrollBottom();
    this.clearHistoryState();
    const editable = last(vl.getGeneralItems());
    if (!editable) return;
    editable.clear();
  }

  private changeHandler = (value: string) => {
    const { historyIndex, history, vl } = this;
    if (history[historyIndex] !== value) this.stopHistory = true;
    vl.scrollBottom();
  }

  private clearHistoryState() {
    this.historyIndex = -1;
    this.stopHistory = false;
  }

  private getLastLineInput(): HTMLTextAreaElement | null {
    const line = last(this.vl.getGeneralItems());
    if (!line) return null;
    return line.getRef('input') as HTMLTextAreaElement;
  }

  private addKeyDownHandler() {
    const input = this.getLastLineInput();
    if (!input) return;
    input.addEventListener('keydown', this.lineKeydownHandler);
  }

  private removeKeyDownHandler() {
    const input = this.getLastLineInput();
    if (!input) return;
    input.removeEventListener('keydown', this.lineKeydownHandler);
  }

  private lineKeydownHandler = (e: KeyboardEvent) => {
    (({
      [UP_CODE]: this.prevHistory,
      [DOWN_CODE]: this.nextHistory,
    } as { [code: number]: (e: KeyboardEvent) => void })[Number(getKeyCode(e))] || noop)(e);
  }

  private prevHistory = (e: KeyboardEvent) => {
    const { historyIndex, history, stopHistory, lines } = this;
    const input = this.getLastLineInput();
    const line = last(lines);
    if (!history.length || !input || stopHistory) return;
    const newIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
    if (historyIndex === newIndex) return;
    this.historyIndex = newIndex;
    input.value = history[newIndex];
    (line as ILine).moveCaretToEnd();
    e.preventDefault();
  }

  private nextHistory = (e: KeyboardEvent) => {
    const { historyIndex, history, stopHistory, lines } = this;
    const input = this.getLastLineInput();
    const line = last(lines);
    if (!history.length || !input || stopHistory || historyIndex < 0) return;
    const newIndex = historyIndex === history.length - 1 ? -1 : historyIndex + 1;
    if (historyIndex === newIndex) return;
    this.historyIndex = newIndex;
    input.value = newIndex >= 0 ? history[newIndex] : '';
    (line as ILine).moveCaretToEnd();
    e.preventDefault();
  }
}

export default Term;
