import { Plugin, ITermInfo, IKeyboardShortcutsManager, ITemplateEngine } from '@term-js/term';
import { isString, noop } from 'lodash-es';

import './theme.scss';

import IContextMenu from '@ContextMenu/IContextMenu';
import ContextMenuView from '@ContextMenu/ContextMenuView';
import { PositionType, ShowOptionsType, TargetType } from '@ContextMenu/types';
import {
  CLOSE_ACTION,
  END_OF_LINE_TYPE,
  ESC_KEY_CODE,
  PLUGIN_NAME,
  POSITION_TARGET_TYPE,
} from '@ContextMenu/constants';
import { getRelativePosition } from '@general/utils/viewport';
import { stopPropagation } from '@general/utils/event';

class ContextMenu extends Plugin implements IContextMenu {
  public readonly name: string = PLUGIN_NAME;
  private contextMenuView?: ITemplateEngine;
  private target?: TargetType;
  private position?: PositionType;
  private isVisible: boolean = false;
  private escHide: boolean = false;
  private aroundClickHide: boolean = false;
  private onHide?: () => void;

  public show(
    content: HTMLElement | string, target: TargetType, options: ShowOptionsType = {},
  ) {
    this.hide();
    const { position, escHide = false, aroundClickHide = false, onHide } = options;
    if (target === POSITION_TARGET_TYPE && !position) return;
    this.target = target;
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
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    const { root } = termInfo.elements;
    root?.addEventListener('click', this.rootClickHandler);
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
    super.destroy();
  }

  public clear() {
    this.hide();
    super.clear();
  }

  private escHandler = () => {
    if (this.escHide) this.hide();
  }

  private rootClickHandler = () => {
    if (this.aroundClickHide) this.hide();
  }

  private render(content: HTMLElement | string) {
    const { termInfo, target } = this;
    const edit = target === END_OF_LINE_TYPE ? termInfo?.elements?.edit : termInfo?.elements?.root;
    if (!edit) return;
    const contextMenuView = new ContextMenuView(edit as HTMLElement);
    contextMenuView.render();
    const root = contextMenuView.getRef('root');
    if (!root) return;
    root.addEventListener('click', stopPropagation);
    this.contextMenuView = contextMenuView;
    this.isVisible = false;
    return isString(content) ? root.innerHTML = content : root.appendChild(content);
  }

  private updatePosition() {
    const { target, isVisible } = this;
    (({
      [END_OF_LINE_TYPE]: () => this.updateEndOfLinePosition(),
      [POSITION_TARGET_TYPE]: () => this.updateFixedPosition(),
    } as { [key: string]: () => void })[target || ''] || noop)();
    if (!isVisible) this.setVisible();
  }

  private updateEndOfLinePosition() {
    const { termInfo, contextMenuView } = this;
    if (!termInfo || !contextMenuView) return;
    const { size: { height } } = termInfo.caret;
    const { endOffset: { left, top: offsetTop } } = termInfo.edit;
    const root = contextMenuView.getRef('root');
    if (!root) return;
    const top = offsetTop + height;
    (root as HTMLElement).style.left = `${left}px`;
    (root as HTMLElement).style.top = `${top}px`;
    this.normalizedPosition(left, top);
  }

  private updateFixedPosition() {
    const { position, contextMenuView } = this;
    if (!position || !contextMenuView) return;
    const root = contextMenuView.getRef('root');
    if (!root) return;
    (root as HTMLElement).style.left = `${position.left}px`;
    (root as HTMLElement).style.top = `${position.top}px`;
    this.normalizedPosition(position.left, position.top);
  }

  private setVisible() {
    const { contextMenuView } = this;
    if (!contextMenuView) return;
    const root = contextMenuView.getRef('root');
    if (!root) return;
    (root as HTMLElement).style.visibility = 'visible';
    this.isVisible = true;
  }

  private normalizedPosition(left: number, top: number) {
    const { contextMenuView, target, termInfo } = this;
    const root = this.termInfo?.elements?.root;
    if (!contextMenuView || !root) return;
    const contextMenuRoot = contextMenuView.getRef('root');
    if (!contextMenuRoot) return;
    const {
      right, bottom,
    } = getRelativePosition(contextMenuRoot as HTMLElement, root as HTMLElement);
    if (right < 0) (contextMenuRoot as HTMLElement).style.left = `${left + right}px`;
    if (bottom < 0) {
      const updatedTop = top - (contextMenuRoot as HTMLElement).offsetHeight
        - (target === END_OF_LINE_TYPE ? termInfo?.caret.size.height || 0 : 0);
      (contextMenuRoot as HTMLElement).style.top = `${updatedTop}px`;
    }
  }
}

export default ContextMenu;
