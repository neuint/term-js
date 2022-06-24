import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import { v1 } from 'uuid';
import { last, noop } from 'lodash-es';

import { getRelativePosition } from '@general/utils/viewport';
import { ESC_KEY_CODE } from '@general/constants/keyCodes';

import IModals from './IModals';
import { EDIT_CENTER_POSITION, HIDE_ACTION, PLUGIN_NAME } from './constants';
import { ModalOptionsType, PositionType } from './types';
import IModalView from './ModalView/IModalView';
import ModalView from './ModalView';

export { default as IModals } from './IModals';
export {
  EDIT_CENTER_POSITION, TERMINAL_CENTER_POSITION, GENERAL_BUTTON_TYPE, PRIMARY_BUTTON_TYPE,
} from './constants';

class Modals extends Plugin implements IModals {
  public readonly name: string = PLUGIN_NAME;

  private modalStack: {
    uuid: string; options: ModalOptionsType; view: IModalView;
  }[] = [];

  private unlockCallback?: () => void;

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    keyboardShortcutsManager.addShortcut(HIDE_ACTION, { code: ESC_KEY_CODE });
    keyboardShortcutsManager.addListener(HIDE_ACTION, this.hideLast);
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
  }

  public clear() {
    const { modalStack } = this;
    modalStack.forEach(({ uuid }) => this.hide(uuid));
  }

  public destroy() {
    this.clear();
    super.destroy();
  }

  public show(options: ModalOptionsType): () => void {
    const { termInfo, unlockCallback, keyboardShortcutsManager } = this;
    if (!termInfo || !termInfo.elements.root) return noop;
    const container = termInfo.elements.root.parentElement;
    const {
      content, onClose: closeHandler, title, overlayHide, closeButton, actions, className, position,
    } = options;
    termInfo.edit.blur();
    const uuid = v1();
    const onClose = () => {
      this.hide(uuid);
      if (closeHandler) closeHandler();
    };
    const isAbsolute = position === EDIT_CENTER_POSITION;
    const view = new ModalView(container as HTMLElement, {
      onClose, content, title, overlayHide, closeButton, actions, className, isAbsolute,
    });
    if (isAbsolute) this.updatePosition(view, position);
    this.modalStack.push({ uuid, options, view });
    if (!unlockCallback && keyboardShortcutsManager) {
      this.unlockCallback = keyboardShortcutsManager.lock([HIDE_ACTION]);
    }
    return onClose;
  }

  public hide(uuid: string) {
    const { termInfo, unlockCallback } = this;
    const { modalStack } = this;
    const index = modalStack.findIndex((item) => item.uuid === uuid);
    if (index >= 0) {
      modalStack[index].view.destroy();
      modalStack.splice(index, 1);
    }
    if (!modalStack.length) {
      if (unlockCallback) unlockCallback();
      delete this.unlockCallback;
      termInfo?.edit.focus();
    }
  }

  private hideLast = () => {
    const { modalStack } = this;
    const lastModal = last(modalStack);
    if (lastModal && lastModal.options.escHide) {
      this.hide(lastModal.uuid);
      if (lastModal.options.onClose) lastModal.options.onClose();
    }
  };

  private updatePosition(view: IModalView, position?: PositionType) {
    const { termInfo } = this;
    const modal = view.getModalView();
    if (!modal || !termInfo || position !== EDIT_CENTER_POSITION) return;
    const { edit, root } = termInfo.elements;
    if (!edit || !root) return;
    const { top, bottom } = getRelativePosition(edit as HTMLElement, root as HTMLElement);
    if (top <= bottom) {
      modal.style.top = `${Math.max(0, top)}px`;
    } else if (bottom >= -1 * (edit as HTMLElement).offsetHeight) {
      modal.style.bottom = `${Math.max(0, bottom)}px`;
    } else {
      modal.style.top = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
    }
  }
}

export default Modals;
