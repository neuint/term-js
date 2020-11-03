import template from './template.html';
import css from './index.scss';

import { identity, isString, isUndefined, unescape } from 'lodash-es';

import IInput from '@Term/Line/Input/IInput';
import { FormattedValueType, ValueFragmentType, ValueType } from '@Term/types';
import BaseInput from '@Term/Line/Input/BaseInput';
import { NON_BREAKING_SPACE_PATTERN } from './patterns';
import { CHANGE_EVENT_TYPE, TEXT_NODE_TYPE } from './constants';
import { SECRET_CHARACTER } from '@Term/Line/Input/constants';

class ContentEditableInput extends BaseInput implements IInput {
  private static getStyledValueTemplate(val: ValueType, params: { secret?: boolean } = {}): string {
    return BaseInput.getValueTemplate(val, params);
  }

  private static getLastTextNode(root: HTMLElement): Node | null {
    const { lastChild } = root;
    if (!lastChild) return null;
    if (lastChild.nodeType === TEXT_NODE_TYPE) return lastChild;
    return ContentEditableInput.getLastTextNode(lastChild as HTMLElement);
  }

  private static checkChildNode(root: HTMLElement, checkNode: HTMLElement | Node): boolean {
    if (root === checkNode) return true;
    const { parentNode } = checkNode;
    return parentNode ? ContentEditableInput.checkChildNode(root, parentNode) : false;
  }

  private static getHtmlStringifyValue(html: string): string {
    return html.replace(NON_BREAKING_SPACE_PATTERN, ' ');
  }

  private static getNodeOffset(
    root: HTMLElement, target: HTMLElement | Node, baseOffset: number = 0,
  ): number {
    const { parentNode } = target;
    if (!parentNode || root === target) return 0;
    let isFound = false;
    const prevNodes = Array.prototype.filter.call(parentNode.childNodes, (
      childNode: HTMLElement | Node,
    ): boolean => {
      const isTarget = childNode === target;
      if (isTarget && !isFound) isFound = true;
      return !isTarget && !isFound;
    });
    const offset = prevNodes.reduce((acc: number, node: HTMLElement | Node): number => {
      const value = node.nodeType === TEXT_NODE_TYPE
        ? node.nodeValue
        : ContentEditableInput.getHtmlStringifyValue((node as HTMLElement).innerHTML);
      return acc + (value ? value.length : 0);
    }, 0);
    return root === parentNode
      ? baseOffset + offset
      : ContentEditableInput.getNodeOffset(root, parentNode, baseOffset + offset);
  }

  private externalChangeListeners: (
    (this: HTMLElement, ev: HTMLElementEventMap['change']) => any
  )[] = [];
  public set hiddenCaret(isCaretHidden: boolean) {
    if (this.isCaretHidden === isCaretHidden) return;
    const root = this.getRef('input') as HTMLElement;
    if (isCaretHidden) {
      root.classList.add(css.hiddenCaret);
    } else {
      root.classList.remove(css.hiddenCaret);
    }
    this.isCaretHidden = isCaretHidden;
  }

  public set value(val: ValueType) {
    this.valueField = val;
    this.updateContent();
  }

  public get value(): ValueType {
    return this.valueField;
  }

  public set secret(secret: boolean) {
    this.secretField = secret;
    this.updateContent();
  }

  public get caretPosition(): number {
    const root = this.getRef('input') as HTMLElement;
    const selection = window.getSelection();
    if (!selection || !selection.isCollapsed || !selection.anchorNode) return -1;
    const { anchorNode } = selection;
    if (!ContentEditableInput.checkChildNode(root, selection.anchorNode)) return -1;
    return ContentEditableInput.getNodeOffset(
      root,
      anchorNode as Node,
      anchorNode.nodeType === TEXT_NODE_TYPE ? selection.anchorOffset : 0,
    );
  }

  public set caretPosition(position: number) {
    if (position < 0) return;
    const root = this.getRef('input') as HTMLElement;
    let offset = 0;
    let relativeOffset = 0;
    const targetNode = Array.prototype.find.call(root.childNodes, (
      childNode: HTMLElement | Node,
    ): boolean => {
      const length = ((childNode.nodeType === TEXT_NODE_TYPE
        ? childNode.nodeValue
        : ContentEditableInput.getHtmlStringifyValue((childNode as HTMLElement).innerHTML)) || '')
        .length;
      relativeOffset = offset;
      offset += length;
      return position <= offset;
    });
    const selection = window.getSelection();
    if (!selection || !targetNode) return;
    const range = new Range();
    const targetChildNode = targetNode.nodeType === TEXT_NODE_TYPE
      ? targetNode : targetNode.firstChild;
    range.setStart(targetChildNode, position - relativeOffset);
    range.setEnd(targetChildNode, position - relativeOffset);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private isDisabled: boolean = false;
  public get disabled(): boolean {
    return this.isDisabled;
  }
  public set disabled(value: boolean) {
    this.isDisabled = value;
  }

  private prevContent?: string;

  constructor(container?: Element) {
    super(template, container, css);
    this.addEventListener('input', this.changeHandler);
    this.addEventListener('cut', this.changeHandler);
    this.addEventListener('paste', this.pasteHandler);
  }

  public  moveCaretToEnd(isForce: boolean = false) {
    const root = this.getRef('input') as HTMLElement;
    if (isForce) this.focus();
    if (!root || !this.isFocused) return;
    const range = document.createRange();
    const selection = window.getSelection();
    const node = ContentEditableInput.getLastTextNode(root);
    if (!node) return;
    range.selectNodeContents(node);
    range.collapse(false);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
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
    super.destroy();
    this.removeEventListener('input', this.changeHandler);
    this.removeEventListener('cut', this.changeHandler);
    this.removeEventListener('paste', this.pasteHandler);
  }

  protected getRootElement(): Element | undefined {
    return this.getRef('input');
  }

  private pasteHandler = () => {
    this.prevContent = BaseInput.getValueString(this.value);
  }

  private changeHandler = (e: Event) => {
    this.updateValueField();
    this.externalChangeListeners.forEach(handler => handler.call(e.target as HTMLElement, e));
  }

  private getPasteNormalizedData(): string {
    const prevContent = this.prevContent;
    const root = this.getRef('input') as HTMLElement;
    const data = unescape(root.innerHTML).replace(NON_BREAKING_SPACE_PATTERN, ' ');
    if (isUndefined(prevContent)) return data;
    this.prevContent = undefined;
    const startIndex = prevContent.split('').reduce((
      acc: number, char: string, i: number,
    ): number => {
      if (acc >= 0) return acc;
      return data[i] !== char ? i : acc;
    }, -1);
    const prefix = startIndex >= 0 ? prevContent.substring(0, startIndex) : prevContent;
    const suffix = startIndex >= 0 && prefix.length !== prevContent.length
      ? prevContent.substring(startIndex) : '';
    const pasteContent = data.replace(prefix, '').replace(suffix, '');
    const processedPasteContent = pasteContent.replace(/<[a-z]+[^>]*>/g, '')
      .replace(/<[a-z]+[^>]*\/>/g, '').replace(/<\/[a-z]+>/g, '');
    return data.replace(pasteContent, processedPasteContent);
  }

  private getInputValue(): string {
    const data = this.getPasteNormalizedData();
    const items = data.replace(/<\/span>[^<]*</g, '</span><').split('</span>').filter(identity);
    return items.reduce((acc: string, item: string) => {
      const index = (item.match(/data-index="[0-9]+"/)?.[0] || '').replace(/[^0-9]/g, '');
      if (index) {
        const prevValue = this.getValueItemString(Number(index));
        const updatedValue = ContentEditableInput.getHtmlStringifyValue(item)
          .replace(new RegExp(`${SECRET_CHARACTER}+`), prevValue);
        return `${acc}${updatedValue}`;
      }
      return `${acc}${ContentEditableInput.getHtmlStringifyValue(item)}`;
    }, '');
  }

  private updateValueField() {
    if (this.preventLockUpdate()) return;
    const { caretPosition, isDisabled } = this;
    let updatedCaretPosition = caretPosition;
    if (isDisabled) {
      updatedCaretPosition = Math.min(caretPosition,
        BaseInput.getValueString(this.valueField).length);
    } else {
      const inputValue = this.getInputValue();
      this.valueField = BaseInput.getUpdatedValueField(inputValue, this.valueField);
    }
    this.updateContent();
    this.caretPosition = updatedCaretPosition;
  }

  private preventLockUpdate(): boolean {
    const { valueField } = this;
    if (isString(valueField)) return false;
    const value = this.getInputValue();
    const lockStr = BaseInput.getLockString(valueField);
    const deleteUnlockPart = lockStr
      && lockStr.indexOf(value) === 0
      && lockStr.length > value.length;
    if (deleteUnlockPart) {
      const lastLockIndex = (this.valueField as FormattedValueType)
        .reduce((acc: number, item: ValueFragmentType, index: number): number => {
          return !isString(item) && item.lock ? index : acc;
        }, -1);
      this.valueField = (this.valueField as FormattedValueType)
        .filter((_, index: number): boolean => index <= lastLockIndex);
    }
    if ((lockStr && value.indexOf(lockStr) !== 0) || deleteUnlockPart) {
      this.updateContent();
      this.moveCaretToEnd();
      return true;
    }
    return false;
  }

  private updateContent() {
    this.setString();
    this.updateStyles();
  }

  private setString() {
    const { secretField } = this;
    const input = this.getRef('input') as HTMLElement;
    const hidden = this.getRef('hidden') as HTMLElement;
    if (input && hidden) {
      const str = ContentEditableInput.getStyledValueTemplate(this.valueField, {
        secret: secretField,
      });
      input.innerHTML = str;
      hidden.innerHTML = str;
    }
  }

  private updateStyles() {
    const input = this.getRef('input') as HTMLElement;
    const hidden = this.getRef('hidden') as HTMLElement;
    if (input && hidden) {
      Array.prototype.forEach.call(hidden.childNodes, (childNode: HTMLElement, index: number) => {
        if (childNode.nodeType !== TEXT_NODE_TYPE) {
          const { color } = window.getComputedStyle(childNode);
          if (color) (input.childNodes[index] as HTMLElement).style.textShadow = `0 0 0 ${color}`;
        }
      });
    }
  }
}

export default ContentEditableInput;
