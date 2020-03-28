import { noop, last, get, isUndefined, isArray, isString, isObject } from 'lodash-es';
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
import { EditLineParamsType, ValueType } from '@Term/types';

import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';
import Line from './Line';
import ILine from './Line/ILine';
import KeyboardShortcutsManager from '@Term/KeyboardShortcutsManager';
import ValueEvent from '@Term/events/ValueEvent';
import {
  ACTION_EVENT_NAME,
  CLEAR_ACTION_NAME,
  INPUT_EVENT_LIST,
  SUBMIT_EVENT_NAME, UPDATE_CARET_POSITION_EVENT_NAME,
} from '@Term/constants/events';
import ActionEvent from '@Term/events/ActionEvent';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
import IPluginManager from '@Term/PluginManager/IPluginManager';
import PluginManager from '@Term/PluginManager';
import ITermInfo from '@Term/ITermInfo';
import BaseInput from '@Term/Line/Input/BaseInput';
import { CHANGE_EVENT_TYPE } from '@Term/Line/Input/ContentEditableInput/constants';
import CaretEvent from '@Term/events/CaretEvent';
import ICaret from '@Term/BaseCaret/ICaret';

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
  private readonly vl: IVirtualizedList<ILine>;
  private heightCache: number[] = [];
  private lines: ValueType[] = [];
  private size: { width: number; height: number } = { width: 0, height: 0 };
  private caret?: string;
  private editLine?: ILine;
  private delimiter: string = '~';
  private label: string = '';
  private header?: string;
  private listeners: {
    [event: string]: ({ handler: (e: any) => void, options?: EventListenerOptions })[];
  } = {};
  public readonly keyboardShortcutsManager: IKeyboardShortcutsManager;
  public readonly pluginManager: IPluginManager;

  constructor(container: Element, params: {
    lines: ValueType[];
    editLine?: EditLineParamsType;
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
    this.header = params.header;
    this.caret = params.caret;
    this.label = params.label || this.label;
    this.delimiter = params.delimiter || this.delimiter;
    this.render({ css, header: this.header });
    this.keyboardShortcutsManager = new KeyboardShortcutsManager({ onAction: this.actionHandler });
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
    this.addKeyboardShortcutsManagerListeners();
    this.keyboardShortcutsManager.activate();
    this.pluginManager = new PluginManager(this.getTermInfo());
  }

  public addEventListener = <K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) => {
    const { listeners } = this;
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push({ handler, options });
    this.registerListener(type, handler, options);
  }

  public removeEventListener = <K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) => {
    const list = this.listeners[type];
    if (!list) return;
    const index = list.findIndex(item => item.handler === handler);
    if (index >= 0) list.splice(index, 1);
    this.unregisterListener(type, handler, options);
  }

  public destroy() {
    this.removeKeyDownHandler();
    this.unregisterAllListeners();
    this.editLine?.destroy();
    this.removeListeners();
    this.pluginManager.destroy();
    this.keyboardShortcutsManager.destroy();
    super.destroy();
  }

  public setLabel = (params: { label?: string; delimiter?: string } = {}) => {
    const { editLine } = this;
    const { label, delimiter } = params;
    let isUpdated = false;
    if (!isUndefined(label)) {
      this.label = label;
      isUpdated = true;
    }
    if (!isUndefined(delimiter)) {
      this.delimiter = delimiter;
      isUpdated = true;
    }
    if (editLine && editLine.label) editLine.label.params = params;
    if (isUpdated) this.updateTermInfo();
  }

  public write(data: string | string[], duration?: number) {
    throw new Error('No implementation');
  }

  public setCaret(caret: string) {
    this.caret = caret;
    if (!this.editLine) return;
    this.editLine.setCaret(caret);
    this.updateTermInfo();
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
    this.updateTermInfo();
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
    const { editLine } = this;
    const root = this.getRef('root') as HTMLElement;
    if (root) root.addEventListener('click', this.clickHandler);
    if (editLine) editLine.input?.addEventListener(CHANGE_EVENT_TYPE, this.updateTermInfo);
  }

  private removeListeners() {
    const { editLine } = this;
    const root = this.getRef('root') as HTMLElement;
    if (root) root.removeEventListener('click', this.clickHandler);
    if (editLine) editLine.input?.removeEventListener(CHANGE_EVENT_TYPE, this.updateTermInfo);
  }

  protected addEditLine(editLineParams: EditLineParamsType) {
    const { vl, delimiter, label } = this;
    const generalItemsContainer = vl.getGeneralItemsContainer();
    if (!generalItemsContainer) return;
    this.editLine = new Line(generalItemsContainer, {
      label,
      delimiter,
      className: css.line,
      value: isArray(editLineParams) || isString(editLineParams)
        ? editLineParams : editLineParams.value,
      editable: true,
      onSubmit: this.submitHandler,
      onChange: this.changeHandler,
      onUpdateCaretPosition: this.updateCaretPositionHandler,
      caret: this.caret,
      secret: get(editLineParams as EditLineParamsType, 'secret') || false,
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
    const { history, vl, editLine, listeners } = this;
    const historyValue = value.substring(lockString.length);
    if (historyValue && last(history) !== historyValue && !editLine?.secret) {
      this.historyField.push(historyValue);
    }
    this.lines.push(formattedValue);
    this.clearHistoryState();
    vl.length = this.lines.length;
    vl.scrollBottom();
    if (!this.editLine) return;
    this.editLine.clear();
    this.editLine.secret = false;
    this.updateTermInfo();
    if (listeners[SUBMIT_EVENT_NAME]) {
      const event = new ValueEvent(value, historyValue || undefined);
      listeners[SUBMIT_EVENT_NAME].forEach(item => item.handler(event));
    }
  }

  private changeHandler = (value: string) => {
    const { historyIndex, history, vl } = this;
    if (history[historyIndex] !== value) this.stopHistory = true;
    if (!value) this.stopHistory = false;
    vl.scrollBottom();
  }

  private updateCaretPositionHandler = (position: number, caret?: ICaret) => {
    const { listeners } = this;
    this.updateTermInfo();
    if (listeners[UPDATE_CARET_POSITION_EVENT_NAME]) {
      const caretEvent = new CaretEvent(position, caret);
      listeners[UPDATE_CARET_POSITION_EVENT_NAME].forEach(item => item.handler(caretEvent));
    }
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

  private addKeyboardShortcutsManagerListeners() {
    const { keyboardShortcutsManager } = this;
    keyboardShortcutsManager.addListener(CLEAR_ACTION_NAME, this.clearHandler);
  }

  private clearHandler = () => {
    this.setLines([]);
    this.updateTermInfo();
  }

  private actionHandler = (action: string, e: Event) => {
    const { listeners } = this;
    if (listeners[ACTION_EVENT_NAME]) {
      const event = new ActionEvent({ action });
      listeners[ACTION_EVENT_NAME].forEach(item => item.handler(event));
    }
  }

  private registerListener<K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) {
    const { editLine } = this;
    if (editLine && INPUT_EVENT_LIST.includes(type)) {
      editLine.input?.addEventListener(
        type as keyof HTMLElementEventMap,
        handler as (e: HTMLElementEventMap[keyof HTMLElementEventMap]) => void,
        options,
      );
    }
  }

  private unregisterAllListeners() {
    const { listeners } = this;
    Object.keys(listeners).forEach((type: string) => {
      if (INPUT_EVENT_LIST.includes(type)) {
        listeners[type].forEach((item) => {
          this.unregisterListener(type as keyof ITermEventMap, item.handler, item.options);
        });
      }
    });
  }

  private unregisterListener<K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) {
    const { editLine } = this;
    if (editLine && INPUT_EVENT_LIST.includes(type)) {
      editLine.input?.removeEventListener(
        type as keyof HTMLElementEventMap,
        handler as (e: HTMLElementEventMap[keyof HTMLElementEventMap]) => void,
        options,
      );
    }
  }

  private setLines = (lines: ValueType[]) => {
    const { vl } = this;
    this.lines = lines;
    vl.length = lines.length;
    vl.clearCache();
    this.updateTermInfo();
  }

  private getTermInfo(): ITermInfo {
    const { editLine, header, lines, label, delimiter } = this;
    return {
      elements: {
        root: this.getRef('content'),
        edit: editLine?.getRef('content'),
        title: this.getRef('header'),
      },
      title: header || '',
      caretPosition: editLine?.input?.caretPosition || 0,
      lines: lines.map((line: ValueType): string => BaseInput.getValueString(line)),
      editLine: BaseInput.getValueString(editLine?.value || ''),
      parameterizedLines: lines,
      parameterizedEditLine: editLine?.value || '',
      addEventListener: this.addEventListener,
      removeEventListener: this.removeEventListener,
      updateLines: this.setLines,
      setLabel: this.setLabel,
      labelParams: { label, delimiter },
      updateEditLine: (params: EditLineParamsType) => {
        if (!editLine) return;
        if (isObject(params) && !isArray(params)) {
          editLine.secret = Boolean(params.secret);
          editLine.value = params.value;
        } else {
          editLine.value = params;
        }
        this.updateTermInfo();
      },
      setCaretPosition: (position: number) => {
        if (position < 0) {
          editLine?.moveCaretToEnd();
          this.updateTermInfo();
        } else if (editLine && editLine.input && position >= 0) {
          editLine.input.caretPosition = position;
          this.updateTermInfo();
        }
      },
    };
  }

  private updateTermInfo = () => {
    this.pluginManager.updateTermInfo(this.getTermInfo());
  }
}

export default Term;
