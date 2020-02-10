import { noop, last, get, isUndefined } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';
import './fonts.scss';
import './theme.scss';
import css from './index.scss';

import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';
import Line from './Line';
import ILine from './Line/ILine';

import TemplateEngine from '@Term/TemplateEngine';
import { getKeyCode } from '@Term/utils/event';
import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import { DOWN_CODE, UP_CODE } from '@Term/constants/keyCodes';

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
  private readonly lines: string[] = [];
  private readonly vl: IVirtualizedList<ILine>;
  private heightCache: number[] = [];
  private size: { width: number; height: number } = { width: 0, height: 0 };
  private caret?: string;
  private editLine?: ILine;
  private delimiter: string = '~';
  private label: string = '';

  constructor(container: Element, params: {
    lines: string[];
    editLine?: string;
    header?: string;
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (line: string) => void;
    caret?: string;
  } = { lines: [], editLine: '' }) {
    super(template, container);
    this.lines = params.lines;
    this.size.width = (container as HTMLElement).offsetWidth;
    this.size.height = (container as HTMLElement).offsetHeight;
    this.ro = new ResizeObserver(this.observeHandler);
    this.ro.observe(container);
    this.caret = params.caret;
    this.render({ css, header: params.header });
    this.vl = new VirtualizedList(
      this.getRef('linesContainer') as Element,
      { length: this.lines.length, itemGetter: this.itemGetter, heightGetter: this.heightGetter },
    );
    this.addEditLine(params.editLine || '');
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

  public destroy() {
    this.removeKeyDownHandler();
    this.editLine?.destroy();
    this.removeListeners();
    super.destroy();
  }

  public setLabel(params: { label?: string; delimiter?: string }) {
    const { label, delimiter } = params;
    if (!isUndefined(label)) this.label = label;
    if (!isUndefined(delimiter)) this.delimiter = delimiter;
  }

  public write(data: string | string[], duration?: number) {
    throw new Error('No implementation');
  }

  public setCaret(caret: string) {
    this.caret = caret;
    if (!this.editLine) return;
    this.editLine.setCaret(caret);
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

  private itemGetter = (index: number): ILine | null => {
    const { lines, vl, delimiter, label } = this;
    const virtualItemsContainer = vl.getVirtualItemsContainer() as HTMLElement;
    return virtualItemsContainer ? new Line(virtualItemsContainer, {
      delimiter, label, editable: false, value: lines[index],
    }) : null;
  }

  private heightGetter = (index: number): number => {
    const { heightCache, size, lines } = this;
    if (isUndefined(heightCache[index])) {

    }
    return heightCache[index];
  }

  private observeHandler = (entries: ResizeObserverEntry[]) => {
    const { size } = this;
    const { width, height } = get(entries, '[0].contentRect');
    if (size.width !== width) {
      size.width = width;
      this.heightCache = [];
    }
    if (size.height !== height) size.height = height;
  }

  private addListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.addEventListener('click', this.clickHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.removeEventListener('click', this.clickHandler);
  }

  protected addEditLine(editLine: string) {
    const { vl, delimiter, label } = this;
    const generalItemsContainer = vl.getGeneralItemsContainer();
    if (!generalItemsContainer) return;
    this.editLine = new Line(generalItemsContainer, {
      label,
      delimiter,
      className: css.line,
      value: editLine,
      editable: true,
      onSubmit: this.submitHandler,
      onChange: this.changeHandler,
      caret: this.caret,
    });
    this.clearHistoryState();
    this.addKeyDownHandler();
  }

  private clickHandler = (e: MouseEvent) => {
    if (e.target === this.vl.getRef('root')) this.lastLineFocus();
  }

  private lastLineFocus() {
    if (document.hasFocus() && this.editLine) this.editLine.focus();
  }

  private submitHandler = (value: string) => {
    const { history, vl } = this;
    if (value && last(history) !== value) this.historyField.push(value);
    this.lines.push(value);
    vl.scrollBottom();
    this.clearHistoryState();
    vl.length = this.lines.length;
    if (!this.editLine) return;
    this.editLine.clear();
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
    if (!this.editLine) return null;
    return this.editLine.getRef('input') as HTMLTextAreaElement;
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
    const { historyIndex, history, stopHistory } = this;
    const input = this.getLastLineInput();
    if (!history.length || !input || stopHistory) return;
    const newIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
    if (historyIndex === newIndex) return;
    this.historyIndex = newIndex;
    input.value = history[newIndex];
    if (this.editLine) this.editLine.moveCaretToEnd();
    e.preventDefault();
  }

  private nextHistory = (e: KeyboardEvent) => {
    const { historyIndex, history, stopHistory } = this;
    const input = this.getLastLineInput();
    if (!history.length || !input || stopHistory || historyIndex < 0) return;
    const newIndex = historyIndex === history.length - 1 ? -1 : historyIndex + 1;
    if (historyIndex === newIndex) return;
    this.historyIndex = newIndex;
    input.value = newIndex >= 0 ? history[newIndex] : '';
    if (this.editLine) this.editLine.moveCaretToEnd();
    e.preventDefault();
  }
}

export default Term;
