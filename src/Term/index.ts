import { noop, last, get, isUndefined } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';

import './fonts.scss';
import './theme.scss';
import css from './index.scss';
import template from './template.html';

import VirtualizedList from '@Term/VirtualizedList';
import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import TemplateEngine from '@Term/TemplateEngine';
import { getKeyCode } from '@Term/utils/event';
import { DOWN_CODE, UP_CODE } from '@Term/constants/keyCodes';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';
import { scrollbarSize } from '@Term/utils/viewport';
import { ValueType } from '@Term/types';

import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';
import Line from './Line';
import ILine from './Line/ILine';

class Term extends TemplateEngine implements ITerm {
  private static scrollbarSize: number = 20;

  private historyField: string[] = [];
  private historyIndex: number = -1;
  private stopHistory: boolean = false;
  public get history(): string[] {
    return this.historyField;
  }

  private itemSizeField?: { width: number; height: number };
  private itemSizeContainer?: HTMLElement;
  private get itemSize(): { width: number; height: number } {
    const { itemSizeField } = this;
    if (itemSizeField) return itemSizeField;
    const root = this.getRef('root');
    if (!root) return { width: 1, height: 1 };
    const textContainer = document.createElement('span');
    textContainer.innerHTML = NON_BREAKING_SPACE;
    textContainer.className = css.checkCharacterContainer;
    root.appendChild(textContainer);
    this.itemSizeField = { width: textContainer.offsetWidth, height: textContainer.offsetHeight };
    this.itemSizeContainer = textContainer;
    return this.itemSizeField;
  }

  private readonly ro: ResizeObserver;
  private readonly lines: ValueType[] = [];
  private readonly vl: IVirtualizedList<ILine>;
  private heightCache: number[] = [];
  private size: { width: number; height: number } = { width: 0, height: 0 };
  private caret?: string;
  private editLine?: ILine;
  private delimiter: string = '~';
  private label: string = '';

  constructor(container: Element, params: {
    lines: ValueType[];
    editLine?: ValueType;
    header?: string;
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (line: string) => void;
    caret?: string;
    label?: string;
    delimiter?: string;
  } = { lines: [], editLine: '' }) {
    super(template, container);
    this.lines = params.lines;
    this.size.width = (container as HTMLElement).offsetWidth;
    this.size.height = (container as HTMLElement).offsetHeight;
    this.ro = new ResizeObserver(this.observeHandler);
    this.ro.observe(container);
    this.caret = params.caret;
    this.label = params.label || this.label;
    this.delimiter = params.delimiter || this.delimiter;
    this.render({ css, header: params.header });
    Term.scrollbarSize = scrollbarSize(this.getRef('root') as HTMLElement);
    this.vl = new VirtualizedList(
      this.getRef('linesContainer') as Element,
      { length: this.lines.length, itemGetter: this.itemGetter, heightGetter: this.heightGetter },
    );
    this.addEditLine(params.editLine || '');
    this.addListeners();
    this.vl.scrollBottom();
    this.lastLineFocus();
    this.frameHandler = this.characterUpdater;
    this.registerFrameHandler();
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

  private characterUpdater = () => {
    const { width, height } = this.itemSize;
    const { itemSizeContainer, vl } = this;
    if (itemSizeContainer) {
      const { offsetWidth, offsetHeight } = itemSizeContainer;
      this.itemSizeField = { width: offsetWidth, height: offsetHeight };
      if (offsetWidth !== width || offsetHeight !== height) {
        this.heightCache = [];
        vl.updateViewport();
      }
    }
  }

  private itemGetter = (
    index: number, params?: { container?: HTMLElement, ref?: ILine, append?: boolean },
  ): ILine | null => {
    const { lines, vl, delimiter, label } = this;
    const { container, ref, append } = params || {};
    const virtualItemsContainer = container || (vl
      ? vl.getVirtualItemsContainer() as HTMLElement : undefined);
    return virtualItemsContainer ? new Line(virtualItemsContainer, {
      ref, append, delimiter, label, editable: false, value: lines[index], className: css.line,
    }) : null;
  }

  private heightGetter = (index: number): number => {
    const { heightCache, itemSize, size, lines, delimiter, label } = this;
    if (isUndefined(heightCache[index])) {
      heightCache[index] = Line.getHeight({
        itemSize,
        delimiter,
        label,
        value: lines[index],
        width: size.width - Term.scrollbarSize,
      });
    }
    return heightCache[index];
  }

  private observeHandler = (entries: ResizeObserverEntry[]) => {
    const { size, vl } = this;
    const { width, height } = get(entries, '[0].contentRect');
    if (size.width !== width) {
      size.width = width;
      size.height = height;
      this.heightCache = [];
      vl.updateViewport();
    } else if (size.height !== height) {
      size.width = width;
      size.height = height;
      vl.updateViewport();
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

  protected addEditLine(editLine: ValueType) {
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
    if (document.hasFocus() && this.editLine) {
      this.editLine.focus();
    }
  }

  private submitHandler = (
    params: { value: string; formattedValue: ValueType; lockString: string },
  ) => {
    const { value, formattedValue, lockString } = params;
    const { history, vl } = this;
    const historyValue = value.substring(lockString.length);
    if (historyValue && last(history) !== historyValue) this.historyField.push(historyValue);
    this.lines.push(formattedValue);
    this.clearHistoryState();
    vl.length = this.lines.length;
    vl.scrollBottom();
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

  private addKeyDownHandler() {
    const { editLine } = this;
    if (!editLine || !editLine.input) return;
    editLine.input.addEventListener('keydown', this.lineKeydownHandler);
  }

  private removeKeyDownHandler() {
    const { editLine } = this;
    if (!editLine || !editLine.input) return;
    editLine.input.removeEventListener('keydown', this.lineKeydownHandler);
  }

  private lineKeydownHandler = (e: KeyboardEvent) => {
    (({
      [UP_CODE]: this.prevHistory,
      [DOWN_CODE]: this.nextHistory,
    } as { [code: number]: (e: KeyboardEvent) => void })[Number(getKeyCode(e))] || noop)(e);
  }

  private prevHistory = (e: KeyboardEvent) => {
    const { historyIndex, history, stopHistory, editLine } = this;
    if (!history.length || !editLine || stopHistory) return;
    const newIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
    if (historyIndex === newIndex) return;
    this.historyIndex = newIndex;
    editLine.value = history[newIndex];
    editLine.moveCaretToEnd();
    e.preventDefault();
  }

  private nextHistory = (e: KeyboardEvent) => {
    const { historyIndex, history, stopHistory, editLine } = this;
    if (!history.length || !editLine || stopHistory || historyIndex < 0) return;
    const newIndex = historyIndex === history.length - 1 ? -1 : historyIndex + 1;
    if (historyIndex === newIndex) return;
    this.historyIndex = newIndex;
    editLine.value = newIndex >= 0 ? history[newIndex] : '';
    editLine.moveCaretToEnd();
    e.preventDefault();
  }
}

export default Term;
