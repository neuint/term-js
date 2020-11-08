import BaseInput from '@Term/Line/Input/BaseInput';
import IInput from '@Term/Line/Input/IInput';
import template from './template.html';
import {
  getContentEditableCaretPosition,
  moveContentEditableCaretToEnd,
  setContentEditableCaretPosition,
} from '@Term/utils/viewport';
import { CHANGE_EVENT_TYPE } from '../constants';
import { ValueType } from '@Term/types';
import { getValueHtmlInfo } from './utils';

import css from './index.scss';

class ContentEditableInput extends BaseInput implements IInput {
  private externalChangeListeners: (
    (this: HTMLElement, ev: HTMLElementEventMap['change']) => any
  )[] = [];

  public get caretPosition(): number {
    const editPart = this.getRef('edit-part');
    if (!editPart) return -1;
    const position = getContentEditableCaretPosition(editPart as HTMLElement);
    console.log(position);
    return position;
  }

  public set caretPosition(position: number) {
    const editPart = this.getRef('edit-part');
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
    const input = this.getRef('input');
    if (this.isCaretHidden === isCaretHidden || !input) return;
    if (isCaretHidden) {
      (input as HTMLElement).classList.add(css.hiddenCaret);
    } else {
      (input as HTMLElement).classList.remove(css.hiddenCaret);
    }
    this.isCaretHidden = isCaretHidden;
  }

  public set value(val: ValueType) {
    this.valueField = val;
    this.updateContent();
  }

  public set secret(secret: boolean) {
    this.secretField = secret;
    this.updateContent();
  }

  constructor(container?: Element) {
    super(template, container, css);
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

  protected getRootElement(): Element | undefined {
    return this.getRef('edit-part');
  }

  private updateContent() {
    this.setString();
  }

  private setString() {
    const { secretField } = this;
    const editPart = this.getRef('edit-part') as HTMLElement;
    const lockPart = this.getRef('lock-part') as HTMLElement;
    if (editPart && lockPart) {
      const { edit, lock } = getValueHtmlInfo(this.valueField, { secret: secretField });
      editPart.innerHTML = edit;
      lockPart.innerHTML = lock;
    }
  }
}

export default ContentEditableInput;
