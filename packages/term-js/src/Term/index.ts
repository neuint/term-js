import { last, get, isUndefined, isArray, isString, isObject } from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';

import { getKeyCode } from '@general/utils/event';
import { escapeString } from '@general/utils/string';
import { getScrollbarSize } from '@general/utils/viewport';

import './index.scss';
import template from './template.html';

import VirtualizedList from './VirtualizedList';
import IVirtualizedList from './VirtualizedList/IVirtualizedList';
import TemplateEngine from './TemplateEngine';
import { DOWN_CODE, K_CODE, UP_CODE } from './_constants/keyCodes';
import { compareItemSize, getItemSize } from './_utils/viewport';
import {
  EditLineParamsType,
  FormattedValueFragmentType,
  SizeType,
  TermConstructorParamsType,
  TermInfoCaretType,
  TermInfoEditType,
  TermInfoElementsType,
  TermInfoLabelType, TermInfoLinesTypes,
  TermParamsType,
  ValueType,
} from './types';

import ITerm from './ITerm';
import ITermEventMap from './_interfaces/ITermEventMap';
import Line from './Line';
import ILine from './Line/ILine';
import KeyboardShortcutsManager from './KeyboardShortcutsManager';
import ValueEvent from './_events/ValueEvent';
import {
  ACTION_EVENT_NAME,
  CLEAR_ACTION_NAME,
  INPUT_EVENT_LIST,
  SUBMIT_EVENT_NAME,
  UPDATE_CARET_POSITION_EVENT_NAME,
} from './_constants/events';
import ActionEvent from './_events/ActionEvent';
import IKeyboardShortcutsManager from './KeyboardShortcutsManager/IKeyboardShortcutsManager';
import IPluginManager from './PluginManager/IPluginManager';
import PluginManager from './PluginManager';
import ITermInfo from './_interfaces/ITermInfo';
import BaseInput from './Line/Input/BaseInput';
import { CHANGE_EVENT_TYPE } from './Line/Input/ContentEditableInput/constants';
import CaretEvent from './_events/CaretEvent';
import ICaret from './BaseCaret/ICaret';
import { DEFAULT_DELIMITER } from './_constants/strings';
import { IS_MAC } from './_constants/browser';

export { default as ITerm } from './ITerm';
export { default as ITermInfo } from './_interfaces/ITermInfo';
export { default as KeyboardShortcutsManager } from './KeyboardShortcutsManager';
export { default as IKeyboardShortcutsManager } from './KeyboardShortcutsManager/IKeyboardShortcutsManager';
export { ActionShortcutType } from './KeyboardShortcutsManager/types';
export {
  TermConstructorParamsType,
  ValueType,
  InfoType,
  FormattedValueType,
  ValueFragmentType,
  FormattedValueFragmentType,
} from './types';
export { default as IPluginManager } from './PluginManager/IPluginManager';
export { default as Plugin } from './PluginManager/Plugin';
export { default as IPlugin } from './PluginManager/Plugin/IPlugin';
export { default as TemplateEngine } from './TemplateEngine';
export { default as ITemplateEngine } from './TemplateEngine/ITemplateEngine';

class Term extends TemplateEngine implements ITerm {
  private static processParams(
    params: TermConstructorParamsType,
  ): TermConstructorParamsType {
    const { editLine } = params;
    if (isString(editLine)) return params;
    const { secret, value } = editLine as { value: ValueType; secret?: boolean };
    if (!secret) return params;
    let processedValue = value;
    if (isString(value)) processedValue = value.split('');
    if (isArray(value)) {
      processedValue = value.reduce((acc, item) => {
        acc.push(...(isString(item) ? item.split('') : item.str.split('').map((char: string) => {
          return { ...item, str: char };
        })));
        return acc;
      }, []);
    }
    return { ...params, editLine: { ...editLine, value: processedValue } };
  }

  private isDisabled = false;

  public get disabled(): boolean {
    return this.isDisabled;
  }

  public set disabled(val: boolean) {
    const { isDisabled, editLine, keyboardShortcutsManager } = this;
    if (isDisabled === val) return;
    this.isDisabled = val;
    if (editLine) editLine.disabled = val;
    if (val) keyboardShortcutsManager.deactivate();
    else keyboardShortcutsManager.activate();
  }

  public get secret(): boolean {
    return this.editLine.secret;
  }

  public set secret(value: boolean) {
    this.editLine.secret = value;
  }

  private headerField = '';

  public get header(): string {
    return this.headerField;
  }

  public set header(val: string) {
    const { headerField } = this;
    if (headerField !== val) {
      const headerText = this.getRef('headerText') as HTMLElement;
      headerText.innerHTML = escapeString(val);
    }
    this.headerField = val;
  }

  public get value(): ValueType {
    return this.editLine?.value || '';
  }

  public set value(val: ValueType) {
    const { editLine } = this;
    if (editLine) editLine.value = val;
  }

  private readonly ro: ResizeObserver;

  private readonly vl: IVirtualizedList<ILine>;

  public readonly keyboardShortcutsManager: IKeyboardShortcutsManager;

  public readonly pluginManager: IPluginManager;

  private history: { list: string[]; index: number; stopHistory: boolean } = {
    list: [], index: -1, stopHistory: false,
  };

  private params: TermParamsType = {
    label: '',
    delimiter: DEFAULT_DELIMITER,
    header: '',
    caret: '',
    scrollbarSize: 20,
    size: { width: 1, height: 1 },
  };

  private isEditing = false;

  private writingInterval?: ReturnType<typeof setInterval>;

  private submitTimeout?: ReturnType<typeof setTimeout>;

  private itemSize: SizeType = { width: 1, height: 1 };

  private heightCache: number[] = [];

  private lines: ValueType[] = [];

  private editLine?: ILine;

  private skipHandler = false;

  private listeners: {
    [event: string]: ({ handler: (e: any) => void, options?: EventListenerOptions })[];
  } = {};

  constructor(container: Element, params: TermConstructorParamsType = { lines: [], editLine: '' }) {
    super(template, container);
    // eslint-disable-next-line no-param-reassign
    params = Term.processParams(params);
    const { virtualizedTopOffset, virtualizedBottomOffset, header } = params;
    this.headerField = header || '';
    this.init(container, params);
    this.ro = new ResizeObserver(this.observeHandler);
    this.keyboardShortcutsManager = new KeyboardShortcutsManager({ onAction: this.actionHandler });
    this.vl = new VirtualizedList(this.getRef('linesContainer') as Element, {
      length: this.lines.length,
      itemGetter: this.itemGetter,
      heightGetter: this.heightGetter,
      topOffset: virtualizedTopOffset || 0,
      bottomOffset: virtualizedBottomOffset || 0,
    });
    this.preStart(container, params);
    this.pluginManager = new PluginManager(this.getTermInfo(), this.keyboardShortcutsManager);
  }

  public addEventListener = <K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) => {
    const { listeners } = this;
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push({ handler, options });
    this.registerListener(type, handler, options);
  };

  public removeEventListener = <K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) => {
    const list = this.listeners[type];
    if (!list) return;
    const index = list.findIndex((item) => item.handler === handler);
    if (index >= 0) list.splice(index, 1);
    this.unregisterListener(type, handler, options);
  };

  public destroy() {
    clearInterval(this.writingInterval as unknown as number);
    clearTimeout(this.submitTimeout as unknown as number);
    this.removeKeyDownHandler();
    this.unregisterAllListeners();
    this.editLine?.destroy();
    this.removeListeners();
    this.pluginManager.destroy();
    this.keyboardShortcutsManager.destroy();
    getItemSize(this.getRef('root') as HTMLElement);
    // TODO: add unobserve.
    super.destroy();
  }

  public setLabel = (params: { label?: string; delimiter?: string } = {}) => {
    const { editLine, params: currentParams } = this;
    const { label, delimiter } = params;
    let isUpdated = false;
    if (!isUndefined(label)) {
      currentParams.label = label;
      isUpdated = true;
    }
    if (!isUndefined(delimiter)) {
      currentParams.delimiter = delimiter;
      isUpdated = true;
    }
    if (editLine && editLine.label) editLine.label.params = params;
    if (isUpdated) this.updateTermInfo();
  };

  public write = (
    data: string | FormattedValueFragmentType,
    options: { withSubmit?: boolean, duration?: number, skipHandler?: boolean } = {},
  ): Promise<boolean> | boolean => {
    const { editLine, isEditing } = this;
    const { withSubmit, duration = 0, skipHandler } = options;
    if (skipHandler) this.skipHandler = true;
    if (!editLine || isEditing) return duration ? Promise.resolve(false) : false;
    this.isEditing = true;
    editLine.disabled = true;
    if (duration >= 0) {
      const { value: original } = editLine;
      const str = isString(data) ? data : data.str;
      const millisecondCharactersCount = str.length / duration;
      let milliseconds = 0;
      const updatingValue = isString(data) ? { str: data } : { ...data, str: '' };
      return new Promise((res: (result: boolean) => void) => {
        this.writingInterval = setInterval(() => {
          milliseconds += 1;
          const substr = str.substr(0, Math.floor(millisecondCharactersCount * milliseconds));
          if (substr === str) {
            clearInterval(this.writingInterval as unknown as number);
            this.updateEditLine(data, true, original);
            if (withSubmit) editLine.submit();
            this.skipHandler = false;
            setTimeout(() => editLine.focus(), 0);
            res(true);
          } else if (updatingValue.str !== substr) {
            updatingValue.str = substr;
            this.updateEditLine(updatingValue, false, original);
          }
        }, 1);
      });
    }
    this.updateEditLine(data, true);
    if (withSubmit) editLine.submit();
    this.skipHandler = false;
    setTimeout(() => editLine.focus(), 0);
    return true;
  };

  public setCaret(caret: string) {
    this.params.caret = caret;
    if (!this.editLine) return;
    this.editLine.setCaret(caret);
    this.updateTermInfo();
  }

  public setHeader(text: string) {
    const header = this.getRef('header');
    const headerText = this.getRef('headerText') as Element;
    if (text) {
      headerText.innerHTML = text;
      header?.classList.remove('Term__header--hidden');
    } else {
      header?.classList.add('Term__header--hidden');
    }
    this.params.header = '';
    this.updateTermInfo();
  }

  public blur() {
    const { editLine } = this;
    if (editLine) editLine.blur();
  }

  private updateEditLine(
    data: string | FormattedValueFragmentType, stopEdit?: boolean, original?: ValueType,
  ) {
    const { editLine } = this;
    if (editLine) {
      const value = isUndefined(original) ? editLine.value : original;
      editLine.value = isArray(value) ? [...value, data] : [value, data];
      editLine.moveCaretToEnd();
      if (stopEdit) editLine.disabled = false;
    }
    if (stopEdit) this.isEditing = false;
  }

  private init(container: Element, params: TermConstructorParamsType) {
    const { header = '' } = params;
    this.setParams(container, params);
    this.render({ header, hidden: header ? '' : 'Term__header--hidden' });
    this.params.scrollbarSize = getScrollbarSize(this.getRef('root') as HTMLElement);
    this.itemSize = getItemSize(this.getRef('root') as HTMLElement, true);
    this.addListeners();
  }

  private preStart(container: Element, params: TermConstructorParamsType) {
    this.addEditLine(params.editLine || '');
    this.ro.observe(container);
    this.vl.scrollBottom();
    this.lastLineFocus();
    this.frameHandler = this.characterUpdater;
    this.registerFrameHandler();
    this.addKeyboardShortcutsManagerListeners();
    this.keyboardShortcutsManager.activate();
  }

  private setParams(container: Element, params: TermConstructorParamsType) {
    const { params: currentParams } = this;
    this.lines = params.lines;
    currentParams.size.width = (container as HTMLElement).offsetWidth;
    currentParams.size.height = (container as HTMLElement).offsetHeight;
    currentParams.header = params.header || currentParams.header;
    currentParams.caret = params.caret || currentParams.caret;
    currentParams.label = params.label || currentParams.label;
    currentParams.delimiter = params.delimiter || currentParams.delimiter;
  }

  private characterUpdater = () => {
    const { vl, itemSize } = this;
    const newItemSize = getItemSize(this.getRef('root') as HTMLElement, true);
    if (!compareItemSize(itemSize, newItemSize)) {
      this.heightCache = [];
      this.itemSize = newItemSize;
      vl.updateViewport();
    }
  };

  private itemGetter = (
    index: number, params?: { container?: HTMLElement, ref?: ILine, append?: boolean },
  ): ILine | null => {
    const { lines, vl, params: { delimiter, label } } = this;
    const { container, ref, append } = params || {};
    const virtualItemsContainer = container || (vl
      ? vl.getVirtualItemsContainer() as HTMLElement : undefined);
    return virtualItemsContainer ? new Line(virtualItemsContainer, {
      ref, append, delimiter, label, editable: false, value: lines[index], className: 'Term__line',
    }) : null;
  };

  private heightGetter = (index: number): number => {
    const {
      heightCache, itemSize, lines, params: { delimiter, label, size, scrollbarSize },
    } = this;
    if (isUndefined(heightCache[index])) {
      heightCache[index] = Line.getHeight({
        itemSize,
        delimiter,
        label,
        value: lines[index],
        width: size.width - scrollbarSize,
      });
    }
    return heightCache[index];
  };

  private observeHandler = (entries: ResizeObserverEntry[]) => {
    const { params: { size }, vl } = this;
    const { width, height } = get(entries, '[0].contentRect');
    if (size.width !== width) {
      size.width = width;
      size.height = height;
      this.heightCache = [];
      vl.updateViewport();
      this.updateTermInfo();
    } else if (size.height !== height) {
      size.width = width;
      size.height = height;
      vl.updateViewport();
      this.updateTermInfo();
    }
  };

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
    const { vl, params: { delimiter, label, caret } } = this;
    const generalItemsContainer = vl.getGeneralItemsContainer();
    if (!generalItemsContainer) return;
    this.editLine = new Line(generalItemsContainer, {
      label,
      delimiter,
      caret,
      className: ['Term__line', 'Term__editLine'].join(' '),
      value: isArray(editLineParams) || isString(editLineParams)
        ? editLineParams : editLineParams.value,
      editable: true,
      onSubmit: this.submitHandler,
      onChange: this.changeHandler,
      onUpdateCaretPosition: this.updateCaretPositionHandler,
      secret: get(editLineParams as EditLineParamsType, 'secret') || false,
    });
    this.clearHistoryState();
    this.addKeyDownHandler();
  }

  private clickHandler = (e: MouseEvent) => {
    if (e.target === this.vl.getRef('root')) this.lastLineFocus();
  };

  private lastLineFocus() {
    if (document.hasFocus() && this.editLine) {
      this.editLine.focus();
    }
  }

  private submitHandler = (
    params: { value: string; formattedValue: ValueType; lockString: string },
  ) => {
    const { value, formattedValue, lockString } = params;
    const { vl, editLine, listeners, skipHandler, history: { list } } = this;
    const historyValue = value.substring(lockString.length);
    if (historyValue && last(list) !== historyValue && !editLine?.secret) list.push(historyValue);
    if (!editLine) return;
    editLine.visible = false;
    this.lines.push(formattedValue);
    this.clearHistoryState();
    this.history.list = list;
    vl.length = this.lines.length;
    vl.scrollBottom();
    editLine.clear();
    editLine.secret = false;
    this.updateTermInfo();
    this.submitTimeout = setTimeout(() => {
      editLine.visible = true;
      editLine.focus();
      if (listeners[SUBMIT_EVENT_NAME] && !skipHandler) {
        const event = new ValueEvent(value, historyValue || undefined);
        listeners[SUBMIT_EVENT_NAME].forEach((item) => item.handler(event));
      }
    }, 10);
  };

  private changeHandler = (value: string) => {
    const { history: { list, index }, vl } = this;
    if (list[index] !== value) this.history.stopHistory = true;
    if (!value) this.history.stopHistory = false;
    vl.scrollBottom();
  };

  private updateCaretPositionHandler = (position: number, caret?: ICaret) => {
    const { listeners } = this;
    this.updateTermInfo();
    if (listeners[UPDATE_CARET_POSITION_EVENT_NAME]) {
      const caretEvent = new CaretEvent(position, caret);
      listeners[UPDATE_CARET_POSITION_EVENT_NAME].forEach((item) => item.handler(caretEvent));
    }
  };

  private clearHistoryState() {
    this.history = { list: [], index: -1, stopHistory: false };
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
    const keyCode = Number(getKeyCode(e));
    if (keyCode === UP_CODE) {
      this.prevHistory(e);
    } else if (keyCode === DOWN_CODE) {
      this.nextHistory(e);
    }
  };

  private prevHistory = (e: KeyboardEvent) => {
    const { index, list } = this.history;
    this.applyHistory(e, index < 0 ? list.length - 1 : Math.max(0, index - 1));
  };

  private nextHistory = (e: KeyboardEvent) => {
    const { index, list } = this.history;
    return index < 0
      ? this.applyHistory(e, -1)
      : this.applyHistory(e, index === list.length - 1 ? -1 : index + 1);
  };

  private applyHistory(e: KeyboardEvent, newIndex: number) {
    const { history: { index, list, stopHistory }, editLine } = this;
    if (!list.length || !editLine || stopHistory) return null;
    if (index === newIndex) return e.stopPropagation();
    this.history.index = newIndex;
    editLine.value = newIndex >= 0 ? list[newIndex] || '' : '';
    editLine.moveCaretToEnd();
    return e.preventDefault();
  }

  private addKeyboardShortcutsManagerListeners() {
    const { keyboardShortcutsManager } = this;
    if (IS_MAC) {
      keyboardShortcutsManager.addShortcut(CLEAR_ACTION_NAME, { code: K_CODE, meta: true });
    } else {
      keyboardShortcutsManager.addShortcut(CLEAR_ACTION_NAME, { code: K_CODE, ctrl: true });
    }
    keyboardShortcutsManager.addListener(CLEAR_ACTION_NAME, this.clearHandler);
  }

  private clearHandler = () => {
    this.setLines([]);
    this.updateTermInfo();
  };

  private actionHandler = (action: string) => {
    const { listeners } = this;
    if (listeners[ACTION_EVENT_NAME]) {
      const event = new ActionEvent({ action });
      listeners[ACTION_EVENT_NAME].forEach((item) => item.handler(event));
    }
  };

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
  };

  private getTermInfo(): ITermInfo {
    const { params: { header } } = this;
    return {
      title: header,
      elements: this.getTermInfoElements(),
      label: this.getTermInfoLabel(),
      caret: this.getTermInfoCaret(),
      edit: this.getTermInfoEdit(),
      lines: this.getTermInfoLines(),
      history: this.history.list,
      addEventListener: this.addEventListener,
      removeEventListener: this.removeEventListener,
    };
  }

  private getTermInfoElements(): TermInfoElementsType {
    const { editLine } = this;
    return {
      root: this.getRef('content'),
      edit: editLine?.getRef('content'),
      title: this.getRef('header'),
    };
  }

  private getTermInfoLabel(): TermInfoLabelType {
    const { label, delimiter } = this.params;
    return { label, delimiter, set: this.setLabel };
  }

  private getTermInfoCaret(): TermInfoCaretType {
    const { editLine, itemSize } = this;
    return {
      position: editLine?.input?.caretPosition || 0,
      offset: editLine?.caretOffset || { left: 0, top: 0 },
      size: { width: itemSize.width, height: itemSize.height },
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

  private getTermInfoEdit(): TermInfoEditType {
    const { editLine } = this;
    return {
      value: BaseInput.getValueString(editLine?.value || ''),
      parameterizedValue: editLine?.value || '',
      write: this.write,
      focus: () => editLine?.focus(),
      blur: () => editLine?.blur(),
      update: (params: EditLineParamsType) => {
        if (!editLine) return;
        if (isObject(params) && !isArray(params)) {
          editLine.secret = Boolean(params.secret);
          editLine.value = params.value;
        } else {
          editLine.value = params;
        }
        this.updateTermInfo();
      },
      endOffset: editLine?.endOffset || { left: 0, top: 0 },
    };
  }

  private getTermInfoLines(): TermInfoLinesTypes {
    const { lines } = this;
    return {
      list: lines.map((line: ValueType): string => BaseInput.getValueString(line)),
      parameterizedList: lines,
      update: this.setLines,
    };
  }

  private updateTermInfo = () => {
    this.pluginManager.updateTermInfo(this.getTermInfo());
  };
}

export default Term;
