import { noop, last, get, mergeWith } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';

import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';
import Line from './Line';
import ILine from './Line/ILine';

import TemplateEngine from '@Term/TemplateEngine';
import { getKeyCode } from '@Term/utils/event';
import template from './template.html';

import css from './index.scss';
import './theme.scss';
import { DOWN_CODE, UP_CODE } from '@Term/constants/keyCodes';

class Term extends TemplateEngine implements ITerm {
  private historyField: string[] = [];
  private historyIndex: number = -1;
  private stopHistory: boolean = false;
  public get history(): string[] {
    return this.historyField;
  }

  private lines: ILine[] = [];
  private readonly ro: ResizeObserver;
  private size: { width: number; height: number } = { width: 0, height: 0 };
  private caret?: string;

  constructor(container: Element, params: {
    lines: string[];
    header?: string;
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (line: string) => void;
    caret?: string;
  } = { lines: [''] }) {
    super(template, container);
    this.size.width = (container as HTMLElement).offsetWidth;
    this.size.height = (container as HTMLElement).offsetHeight;
    this.ro = new ResizeObserver(this.observeHandler);
    this.ro.observe(container);
    this.caret = params.caret;
    this.render({ css, header: params.header });
    this.addLines(params.lines);
    this.addListeners();
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
    this.lines.forEach((line) => {
      line.destroy();
    });
    this.removeListeners();
    super.destroy();
  }

  public write(data: string | string[], duration?: number) {
    throw new Error('No implementation');
  }

  public setCaret(caret: string) {
    this.caret = caret;
    const line = last(this.lines);
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
    const { size, lines } = this;
    const { width, height } = get(entries, '[0].contentRect');
    if (size.width !== width || size.height !== height) {
      size.width = width;
      size.height = height;
      lines.forEach((line: ILine) => {
        line.updateViewport();
      });
    }
  }

  private addListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (!root) return;
    root.addEventListener('click', this.clickHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (!root) return;
    root.removeEventListener('click', this.clickHandler);
  }

  protected addLines(lines: string[]) {
    const linesContainer = this.getRef('linesContainer') as Element;
    const lastLineIndex = lines.length - 1;
    this.lines = lines.map((lineValue: string, index: number): ILine => {
      return  new Line(linesContainer, index === lastLineIndex ? {
        editable: true,
        onSubmit: this.submitHandler,
        onChange: this.changeHandler,
        caret: this.caret,
      } : {});
    });
    this.clearHistoryState();
    this.addKeyDownHandler();
  }

  private clickHandler = (e: MouseEvent) => {
    if (e.target === this.getRef('linesContainer')) {
      const lastLine = last(this.lines) as ILine;
      lastLine.focus();
    }
  }

  private submitHandler = (value: string) => {
    const { lines, history } = this;
    const linesContainer = this.getRef('linesContainer') as HTMLElement;
    this.removeKeyDownHandler();
    last(lines)?.stopEdit();
    if (value && last(history) !== value) this.historyField.push(value);
    const newLine = new Line(linesContainer, {
      editable: true, onSubmit: this.submitHandler, onChange: this.changeHandler, caret: this.caret,
    });
    lines.push(newLine);
    this.scrollBottom();
    newLine.focus();
    this.clearHistoryState();
    this.addKeyDownHandler();
  }

  private changeHandler = (value: string) => {
    const { historyIndex, history } = this;
    if (history[historyIndex] !== value) this.stopHistory = true;
    this.scrollBottom();
  }

  private scrollBottom() {
    const linesContainer = this.getRef('linesContainer') as HTMLElement;
    if (!linesContainer) return;
    linesContainer.scrollTop = linesContainer.scrollHeight + linesContainer.offsetHeight;
  }

  private clearHistoryState() {
    this.historyIndex = -1;
    this.stopHistory = false;
  }

  private getLastLineInput(): HTMLTextAreaElement | null {
    const line = last(this.lines);
    if (!line) return null;
    return  line.getRef('input') as HTMLTextAreaElement;
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
