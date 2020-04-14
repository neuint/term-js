import { Plugin, ITermInfo, IKeyboardShortcutsManager, ITemplateEngine } from '@term-js/term';
import { isString, noop } from 'lodash-es';

import './theme.scss';

import IContextMenu from '@ContextMenu/IContextMenu';
import ContextMenuView from '@ContextMenu/ContextMenuView';
import { PositionType, TargetType } from '@ContextMenu/types';
import { END_OF_LINE_TYPE, POSITION_TARGET_TYPE } from '@ContextMenu/constants';
import { getRelativePosition } from '@ContextMenu/utils/viewport';

class ContextMenu extends Plugin implements IContextMenu {
  private contextMenuView?: ITemplateEngine;
  private target?: TargetType;
  private position?: PositionType;
  private isVisible: boolean = false;
  public show(
    content: HTMLElement | string, target: TargetType, position?: PositionType,
  ) {
    if (target === POSITION_TARGET_TYPE && !position) return;
    this.target = target;
    this.position = position;
    this.render(content);
    this.updatePosition();
  }

  public hide() {
    const { contextMenuView } = this;
    if (contextMenuView) {
      contextMenuView.destroy();
      delete this.contextMenuView;
    }
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.updatePosition();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
    this.updatePosition();
  }

  private render(content: HTMLElement | string) {
    const { termInfo, target } = this;
    const edit = target === END_OF_LINE_TYPE ? termInfo?.elements?.edit : termInfo?.elements?.root;
    if (!edit) return;
    const contextMenuView = new ContextMenuView(edit as HTMLElement);
    contextMenuView.render();
    const root = contextMenuView.getRef('root');
    if (!root) return;
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
