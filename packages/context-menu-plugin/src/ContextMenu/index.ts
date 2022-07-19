import { Plugin, ITermInfo, IKeyboardShortcutsManager, ITemplateEngine } from '@neuint/term-js';
import { isString } from 'lodash-es';

import { getRelativePosition } from '@general/utils/viewport';
import { stopPropagation } from '@general/utils/event';
import { ESC_KEY_CODE } from '@general/constants/keyCodes';

import IContextMenu from './IContextMenu';
import ContextMenuView from './ContextMenuView';
import { ShowOptionsType } from './types';
import { CLOSE_ACTION, PLUGIN_NAME } from './constants';

export { default as IContextMenu } from './IContextMenu';
export { ShowOptionsType } from './types';
export { CLOSE_ACTION } from './constants';

class ContextMenu extends Plugin implements IContextMenu {
  public readonly name: string = PLUGIN_NAME;

  private contextMenuView?: ITemplateEngine;

  private isVisible = false;

  private escHide = false;

  private aroundClickHide = false;

  private onHide?: () => void;

  public show(
    content: HTMLElement | string, options: ShowOptionsType = {},
  ) {
    this.hide();
    const { escHide = false, aroundClickHide = false, onHide } = options;
    this.escHide = escHide;
    this.onHide = onHide;
    this.aroundClickHide = aroundClickHide;
    this.render(content);
    this.updatePosition();
  }

  public hide() {
    const { contextMenuView, onHide } = this;
    if (contextMenuView) {
      const root = contextMenuView.getRef('root');
      if (root) root.removeEventListener('click', stopPropagation);
      contextMenuView.destroy();
      delete this.contextMenuView;
      if (onHide) onHide();
    }
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    this.termInfo?.elements?.root?.removeEventListener('click', this.rootClickHandler);
    this.termInfo?.elements?.root?.querySelector('.VirtualizedList__root')
      ?.removeEventListener('scroll', this.updatePosition);
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    const { root } = termInfo.elements;
    root?.addEventListener('click', this.rootClickHandler);
    this.termInfo?.elements?.root?.querySelector('.VirtualizedList__root')
      ?.addEventListener('scroll', this.updatePosition);
    keyboardShortcutsManager.addShortcut(CLOSE_ACTION, { code: ESC_KEY_CODE });
    keyboardShortcutsManager.addListener(CLOSE_ACTION, this.escHandler);
    this.updatePosition();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
    this.updatePosition();
  }

  public destroy() {
    const { keyboardShortcutsManager, termInfo } = this;
    const root = termInfo?.elements.root;
    if (keyboardShortcutsManager) {
      keyboardShortcutsManager.removeListener(this.escHandler);
      keyboardShortcutsManager.removeShortcut(CLOSE_ACTION);
    }
    if (root) root.removeEventListener('click', this.rootClickHandler);
    termInfo?.elements?.root?.querySelector('.VirtualizedList__root')
      ?.removeEventListener('scroll', this.updatePosition);
    super.destroy();
  }

  public clear() {
    this.hide();
  }

  private escHandler = () => {
    if (this.escHide) this.hide();
  };

  private rootClickHandler = () => {
    if (this.aroundClickHide) this.hide();
  };

  private render(content: HTMLElement | string) {
    const { termInfo } = this;
    if (!termInfo?.elements?.root) return;
    const contextMenuView = new ContextMenuView(termInfo?.elements?.root as HTMLElement);
    contextMenuView.render();
    const root = contextMenuView.getRef('root');
    if (!root) return;
    root.addEventListener('click', stopPropagation);
    this.contextMenuView = contextMenuView;
    this.isVisible = false;
    if (isString(content)) {
      root.innerHTML = content;
    } else {
      root.appendChild(content);
    }
  }

  private updatePosition = () => {
    const { isVisible } = this;
    this.updateEndOfLinePosition();
    if (!isVisible) this.setVisible();
  };

  private updateEndOfLinePosition() {
    const { termInfo, contextMenuView } = this;
    if (!termInfo || !contextMenuView) return;
    const contextMenuRoot = contextMenuView.getRef('root');
    if (!contextMenuRoot) return;
    const { elements: { root, edit }, edit: { endOffset } } = termInfo;
    if (!edit || !root) return;
    const editPositionInfo = getRelativePosition(edit as HTMLElement, root as HTMLElement);
    const top = editPositionInfo.top + editPositionInfo.height - endOffset.top;
    const left = editPositionInfo.left + endOffset.left;
    (contextMenuRoot as HTMLElement).style.left = `${left}px`;
    (contextMenuRoot as HTMLElement).style.top = `${top}px`;
    this.normalizedPosition(left, top);
  }

  private setVisible() {
    const { contextMenuView } = this;
    if (!contextMenuView) return;
    const root = contextMenuView.getRef('root');
    if (!root) return;
    (root as HTMLElement).style.visibility = 'visible';
    this.isVisible = true;
  }

  private normalizedPosition(mainLeft: number, mainTop: number) {
    const { contextMenuView, termInfo } = this;
    const root = this.termInfo?.elements?.root;
    const { width: caretWidth = 0, height: caretHeight = 0 } = termInfo?.caret?.size || {};
    if (!contextMenuView || !root) return;
    const contextMenuRoot = contextMenuView.getRef('root');
    if (!contextMenuRoot) return;
    (contextMenuRoot as HTMLElement).style.width = '';
    (contextMenuRoot as HTMLElement).style.height = '';
    const {
      left, right, width, bottom, top, height,
    } = getRelativePosition(contextMenuRoot as HTMLElement, root as HTMLElement);
    if (right < 0 && left + caretWidth - width > right) {
      let updatedLeft = mainLeft - width + caretWidth;
      if (updatedLeft < 0) {
        (contextMenuRoot as HTMLElement).style.width = `${width + updatedLeft}px`;
        updatedLeft = 0;
      }
      (contextMenuRoot as HTMLElement).style.left = `${updatedLeft}px`;
    } else if (right < 0) {
      (contextMenuRoot as HTMLElement).style.width = `${width + right}px`;
    }
    if (bottom < 0 && top - caretHeight - height > bottom) {
      let updatedTop = mainTop - height - caretHeight;
      if (updatedTop < 0) {
        (contextMenuRoot as HTMLElement).style.height = `${height + updatedTop}px`;
        updatedTop = 0;
      }
      (contextMenuRoot as HTMLElement).style.top = `${updatedTop}px`;
    } else if (bottom < 0) {
      (contextMenuRoot as HTMLElement).style.height = `${height + bottom}px`;
    }
  }
}

export default ContextMenu;
