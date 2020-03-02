import template from './template.html';
import css from './index.scss';

import { isString } from 'lodash-es';

import IInput from '@Term/Line/Input/IInput';
import { ValueType } from '@Term/types';
import BaseInput from '@Term/Line/Input/BaseInput';
import {
  NON_BREAKING_SPACE_PATTERN,
  STRINGIFY_HTML_PATTERN,
} from './patterns';
import { TEXT_NODE_TYPE } from './constants';

class ContentEditableInput extends BaseInput implements IInput {
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
    return html.replace(NON_BREAKING_SPACE_PATTERN, ' ').replace(STRINGIFY_HTML_PATTERN, '');
  }

  private static getNodeOffset(
    root: HTMLElement, target: HTMLElement | Node, baseOffset: number = 0,
  ): number {
    const { parentNode } = target;
    if (!parentNode) return 0;
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
    const root = this.getRef('input') as HTMLElement;
    if (root) root.innerHTML = BaseInput.getValueTemplate(this.valueField);
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

  constructor(container?: Element) {
    super(template, container);
    this.addEventListener('input', this.changeHandler);
    this.addEventListener('cut', this.changeHandler);
    this.addEventListener('paste', this.changeHandler);
  }

  public write(value: ValueType, delay?: number): Promise<boolean> {
    throw new Error('Needs implementation');
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
    if (type === 'change') {
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
    if (type === 'change') {
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
    this.removeEventListener('paste', this.changeHandler);
  }

  private changeHandler = (e: Event) => {
    this.updateValueField();
    this.externalChangeListeners.forEach(handler => handler.call(e.target as HTMLElement, e));
  }

  private getInputValue(): string {
    const root = this.getRef('input') as HTMLElement;
    return ContentEditableInput.getHtmlStringifyValue(root.innerHTML);
  }

  private updateValueField() {
    if (this.preventLockUpdate()) return;
    this.valueField = BaseInput.getUpdatedValueField(this.getInputValue(), this.valueField);
  }

  private preventLockUpdate(): boolean {
    const { valueField } = this;
    if (isString(valueField)) return false;
    const input = this.getRef('input') as HTMLElement;
    const value = this.getInputValue();
    const lockStr = BaseInput.getLockString(valueField);
    if (lockStr && value.indexOf(lockStr) !== 0) {
      input.innerHTML = BaseInput.getValueTemplate(this.valueField);
      this.moveCaretToEnd();
      return true;
    }
    return false;
  }
}

export default ContentEditableInput;
