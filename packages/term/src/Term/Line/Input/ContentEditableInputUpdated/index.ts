import { isString, isUndefined } from 'lodash-es';

import BaseInput from '@Term/Line/Input/BaseInput';
import IInput from '@Term/Line/Input/IInput';
import template from './template.html';
import {
  getContentEditableCaretPosition,
  moveContentEditableCaretToEnd,
  setContentEditableCaretPosition,
} from '@Term/utils/viewport';
import { CHANGE_EVENT_TYPE, DATA_INDEX_ATTRIBUTE_NAME } from '../constants';
import { FormattedValueType, ValueFragmentType, ValueType } from '@Term/types';
import { getPasteProcessedValueItem, getValueHtmlInfo } from './utils';
import { getKeyCode } from '@general/utils/event';
import { U_KEY_CODE, I_KEY_CODE, B_KEY_CODE } from '@general/constants/keyCodes';
import { TEXT_NODE_TYPE } from '@Term/Line/Input/ContentEditableInput/constants';
import { NON_BREAKING_SPACE_PATTERN } from '@Term/constants/patterns';
import { escapePasteString, getPasteString } from '@general/utils/string';

import css from './index.scss';
import rootCss from '@Term/index.scss';
import { NON_BREAKING_SPACE } from '@Term/constants/strings';

const CONTROL_KEY_CODES = [
  U_KEY_CODE, I_KEY_CODE, B_KEY_CODE,
];

class ContentEditableInput extends BaseInput implements IInput {
  private externalChangeListeners: (
    (this: HTMLElement, ev: HTMLElementEventMap['change']) => any
  )[] = [];

  private lockLengthLength: number = -1;
  private get lockLength(): number {
    let { lockLengthLength } = this;
    if (lockLengthLength >= 0) return lockLengthLength;
    const { valueField } = this;
    if (isString(valueField)) {
      lockLengthLength = 0;
    } else {
      let temp = 0;
      lockLengthLength = valueField.reduce((acc, item: ValueFragmentType): number => {
        if (isString(item)) {
          temp += item.length;
          return acc;
        }
        temp += item.str.length;
        if (item.lock) {
          // tslint:disable-next-line:no-parameter-reassignment
          acc += temp;
          temp = 0;
        }
        return acc;
      }, 0);
    }
    return lockLengthLength;
  }

  public get caretPosition(): number {
    const editPart = this.getEditElement();
    const { lockLength } = this;
    if (!editPart) return -1;
    const position = getContentEditableCaretPosition(editPart as HTMLElement);
    return position >= 0 ? lockLength + position : position;
  }

  public set caretPosition(position: number) {
    const editPart = this.getEditElement();
    if (position < 0 || !editPart) return;
    setContentEditableCaretPosition(editPart as HTMLElement, position);
  }

  private isDisabled: boolean = false;
  public get disabled(): boolean {
    return this.isDisabled;
  }
  public set disabled(value: boolean) {
    this.isDisabled = value;
  }

  public set hiddenCaret(isCaretHidden: boolean) {
    const input = this.getRootElement();
    if (this.isCaretHidden === isCaretHidden || !input) return;
    if (isCaretHidden) {
      (input as HTMLElement).classList.add(css.hiddenCaret);
    } else {
      (input as HTMLElement).classList.remove(css.hiddenCaret);
    }
    this.isCaretHidden = isCaretHidden;
  }
  public get hiddenCaret(): boolean {
    return this.isCaretHidden;
  }

  public set value(val: ValueType) {
    this.valueField = val;
    this.updateLockCount();
    this.updateContent();
  }
  public get value(): ValueType {
    return this.valueField;
  }

  public set secret(secret: boolean) {
    if (secret === this.secretField) return;
    this.secretField = secret;
    const editElement = this.getEditElement();
    if (!editElement) return;
    if (secret) editElement.classList.add(rootCss.password);
    else editElement.classList.remove(rootCss.password);
  }
  public get secret(): boolean {
    return this.secretField;
  }

  private prevContent?: string;
  private prevCaretPosition: number = 0;

  constructor(container?: Element) {
    super(template, container, css);
    const root = this.getRootElement() as HTMLElement;
    const editElement = this.getEditElement() as HTMLElement;
    const lockElement = this.getLockElement() as HTMLElement;
    this.addEventListener('input', this.changeHandler);
    this.addEventListener('cut', this.changeHandler);
    this.addEventListener('paste', this.pasteHandler);
    this.addEventListener('keydown', this.keydownHandler);
    if (root) root.addEventListener('click', this.rootClickHandler);
    if (editElement) editElement.addEventListener('click', this.editClickHandler);
    if (lockElement) lockElement.addEventListener('click', this.lockClickHandler);
  }

  public moveCaretToEnd(isForce: boolean = false) {
    const editPart = this.getRef('edit-part');
    if (!editPart) return;
    moveContentEditableCaretToEnd(editPart as HTMLElement, isForce);
  }

  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (type === CHANGE_EVENT_TYPE) {
      this.externalChangeListeners.push(
        listener as (this: HTMLElement, ev: HTMLElementEventMap['change']) => any,
      );
    } else {
      super.addEventListener(type, listener, options);
    }
  }

  public removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) {
    if (type === CHANGE_EVENT_TYPE) {
      this.externalChangeListeners = this.externalChangeListeners.filter((
        item,
      ): boolean => item !== listener);
    } else {
      super.removeEventListener(type, listener, options);
    }
  }

  public destroy() {
    const root = this.getRootElement() as HTMLElement;
    const editElement = this.getEditElement() as HTMLElement;
    const lockElement = this.getLockElement() as HTMLElement;
    this.removeEventListener('input', this.changeHandler);
    this.removeEventListener('cut', this.changeHandler);
    this.removeEventListener('paste', this.pasteHandler);
    this.removeEventListener('keydown', this.keydownHandler);
    if (root) root.removeEventListener('click', this.rootClickHandler);
    if (editElement) editElement.removeEventListener('click', this.editClickHandler);
    if (lockElement) lockElement.removeEventListener('click', this.lockClickHandler);
    super.destroy();
  }

  protected getEditElement(): Element | undefined {
    return this.getRef('edit-part');
  }

  protected getLockElement(): Element | undefined {
    return this.getRef('lock-part');
  }

  protected getRootElement(): Element | undefined {
    return this.getRef('input');
  }

  private updateContent() {
    this.setString();
    this.updateStyles();
  }

  private setString() {
    const { lockCount } = this;
    const editPart = this.getEditElement() as HTMLElement;
    const lockPart = this.getLockElement() as HTMLElement;
    if (editPart && lockPart) {
      const { edit, lock } = getValueHtmlInfo(this.valueField, { lockCount });
      editPart.innerHTML = edit;
      lockPart.innerHTML = lock;
    }
  }

  private updateStyles() {
    const editElement = this.getEditElement() as HTMLElement;
    if (editElement) {
      Array.prototype.forEach.call(
        editElement.childNodes, (childNode: HTMLElement, index: number) => {
          if (childNode.nodeType !== TEXT_NODE_TYPE) {
            const { color } = window.getComputedStyle(childNode);
            if (color) (editElement.childNodes[index] as HTMLElement).style.textShadow = `0 0 0 ${color}`;
          }
        },
      );
    }
  }

  private pasteHandler = () => {
    this.prevCaretPosition = this.caretPosition;
    this.prevContent = BaseInput.getValueString(this.value);
  }

  private keydownHandler = (e: KeyboardEvent) => {
    const keyCode = getKeyCode(e) || -1;
    if (CONTROL_KEY_CODES.includes(keyCode) && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
    }
  }

  private rootClickHandler = (e: Event) => {
    this.moveCaretToEnd(true);
  }

  private editClickHandler = (e: Event) => {
    e.stopPropagation();
  }

  private lockClickHandler = (e: Event) => {
    e.stopPropagation();
    this.caretPosition = 0;
  }

  private changeHandler = (e: Event) => {
    this.updateValue();
    if (this.secret) this.hideSecretCharacters();
    this.externalChangeListeners
      .forEach(handler => handler.call(this.getRootElement() as HTMLElement, e));
  }

  private updateValue() {
    const { value } = this;
    if (isString(value)) {
      this.updateStringValue();
    } else {
      this.updateComplexValue();
    }
  }

  private updateStringValue() {
    const { prevContent } = this;
    const editElement = this.getEditElement() as HTMLElement;
    const isPaste = !isUndefined(prevContent);
    if (!editElement) return;
    let lastText = editElement.innerHTML || '';
    if (isPaste) {
      const pasteString = getPasteString(prevContent as string, lastText);
      lastText = pasteString
        ? lastText.replace(pasteString, escapePasteString(pasteString))
        : lastText;
      editElement.innerHTML = lastText.replace(/\s/g, NON_BREAKING_SPACE);
    }
    this.valueField = lastText;
    if (isPaste) this.pasteCaretPositionUpdate();
  }

  private updateComplexValue() {
    const { lockCount, prevContent } = this;
    const info = this.getComplexValueUpdateInfo();
    if (!info) return;
    const value = this.value as FormattedValueType;
    const editElement = this.getEditElement() as HTMLElement;
    const isPaste = !isUndefined(prevContent);
    const pasteString = isPaste
      ? getPasteString(
        prevContent as string,
        Object.keys(info).sort()
          .reduce((acc: string, key: string): string => acc + info[Number(key)], ''),
      )
      : '';
    this.valueField = value.reduce((
      acc: FormattedValueType, item: ValueFragmentType, index: number,
    ): FormattedValueType => {
      if (index < lockCount) {
        acc.push(item);
        return acc;
      }
      if (!info[index]) return acc;
      if (isString(item)) {
        acc.push(isPaste
          ? getPasteProcessedValueItem(item, info[index], pasteString) : info[index]);
      } else {
        item.str = isPaste
          ? getPasteProcessedValueItem(item.str, info[index], pasteString) : info[index];
        acc.push(item);
      }
      return acc;
    }, [] as FormattedValueType);
    if (editElement?.lastChild?.nodeType === TEXT_NODE_TYPE) {
      this.valueField.push(isPaste
        ? getPasteProcessedValueItem(editElement.lastChild.textContent || '', '', pasteString)
        : '');
    }
    if (isPaste) this.pasteCaretPositionUpdate();
  }

  private getComplexValueUpdateInfo(): { [key: number]: string } | undefined {
    const editElement = this.getEditElement() as HTMLElement;
    if (!editElement) return;
    return Array.prototype.reduce.call(
      editElement.querySelectorAll(`span[${DATA_INDEX_ATTRIBUTE_NAME}]`) || [],
      (acc: unknown, item: HTMLElement): { [key: number]: string } => {
        const str = item.innerHTML.replace(NON_BREAKING_SPACE_PATTERN, ' ');
        const dataIndex = item.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
        if (str && dataIndex) (acc as { [key: number]: string })[Number(dataIndex)] = str;
        return acc as { [key: number]: string };
      },
      {} as { [key: number]: string },
    ) as { [key: number]: string };
  }

  private pasteCaretPositionUpdate() {
    const { prevContent, prevCaretPosition } = this;
    this.caretPosition = prevCaretPosition +
      BaseInput.getValueString(this.valueField).length - (prevContent as string).length;
    this.prevCaretPosition = 0;
    this.prevContent = undefined;
  }

  private hideSecretCharacters() {
    if (this.secret) return;
  }
}

export default ContentEditableInput;
