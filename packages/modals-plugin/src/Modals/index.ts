import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@term-js/term';
import { v1 } from 'uuid';
import { last, noop } from 'lodash-es';

import './theme.scss';

import IModals from '@Modals/IModals';
import { ESC_KEY_CODE, HIDE_ACTION, PLUGIN_NAME, PRIMARY_BUTTON_TYPE } from '@Modals/constants';
import { ModalOptionsType } from '@Modals/types';
import IModalView from '@Modals/ModalView/IModalView';
import ModalView from '@Modals/ModalView';

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
    super.clear();
  }

  public destroy() {
    super.destroy();
  }

  public show(options: ModalOptionsType): () => void {
    const { termInfo, unlockCallback, keyboardShortcutsManager } = this;
    if (!termInfo || !termInfo.elements.root) return noop;
    const { content, onClose: closeHandler, title, overlayHide, closeButton, actions } = options;
    const uuid = v1();
    const onClose = () => {
      this.hide(uuid);
      if (closeHandler) closeHandler();
    };
    this.modalStack.push({
      uuid, options, view: new ModalView(termInfo.elements.root as HTMLElement, {
        onClose, content, title, overlayHide, closeButton, actions,
      }),
    });
    if (!unlockCallback && keyboardShortcutsManager) {
      this.unlockCallback = keyboardShortcutsManager.lock([HIDE_ACTION]);
    }
    return onClose;
  }

  public hide(uuid: string) {
    const { termInfo, unlockCallback } = this;
    const { modalStack } = this;
    const index = modalStack.findIndex(item => item.uuid === uuid);
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
  }
}

export default Modals;
