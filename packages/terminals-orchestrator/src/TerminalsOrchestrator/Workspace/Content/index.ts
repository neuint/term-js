import template from './template.html';
import css from './index.scss';

import { ITemplateEngine, TemplateEngine } from '@term-js/term';
import { MoveInfoType, OptionsType } from '@TerminalsOrchestrator/Workspace/Content/types';
import ContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow';
import IContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow/IContentWindow';
import { MoveType } from '@TerminalsOrchestrator/Workspace/Content/ContentWindow/types';
import {
  BOTTOM_MOVE_TYPE,
  LEFT_BOTTOM_MOVE_TYPE,
  LEFT_MOVE_TYPE,
  LEFT_TOP_MOVE_TYPE,
  MIN_CONTENT_WINDOW_HEIGHT,
  MIN_CONTENT_WINDOW_WIDTH,
  RIGHT_BOTTOM_MOVE_TYPE,
  RIGHT_MOVE_TYPE,
  RIGHT_TOP_MOVE_TYPE,
  TOP_MOVE_TYPE,
} from '@TerminalsOrchestrator/Workspace/Content/constants';

class Content extends TemplateEngine implements ITemplateEngine {
  private readonly options: OptionsType = {};
  private contentWindows: IContentWindow[] = [];
  private moveInfo?: MoveInfoType;

  constructor(container: HTMLElement, options: OptionsType = {}) {
    super(template, container);
    this.options = options;
    this.render();
  }

  public render() {
    const { className = '' } = this.options;
    super.render({ css, className });
    this.contentWindows.push(new ContentWindow(this.getRef('root') as HTMLElement, {
      position: { left: 20, right: 20, top: 20, bottom: 20 },
      onStartMove: this.onStartMove,
      onEndMove: this.onEndMove,
      onMove: this.onMove,
    }));
  }

  private onStartMove = (type: MoveType, contentWindow: IContentWindow, e: MouseEvent) => {
    this.moveInfo = {
      type, contentWindow, startPosition: { left: e.clientX, top: e.clientY },
      startOffsets: contentWindow.position,
    };
    contentWindow.lockSelection = true;
    this.updateGlobalCursor();
  }

  private onEndMove = () => {
    const { moveInfo } = this;
    if (moveInfo) moveInfo.contentWindow.lockSelection = false;
    this.removeGlobalCursor();
    delete this.moveInfo;
  }

  private onMove = (type: MoveType, contentWindow: IContentWindow, e: MouseEvent) => {
    const { moveInfo } = this;
    if (!moveInfo) return;
    if ([LEFT_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, LEFT_TOP_MOVE_TYPE].includes(type)) {
      this.onLeftSideMove(e);
    }
    if ([RIGHT_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
      this.onRightSideMove(e);
    }
    if ([TOP_MOVE_TYPE, LEFT_TOP_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
      this.onTopSideMove(e);
    }
    if ([BOTTOM_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE].includes(type)) {
      this.onBottomSideMove(e);
    }
  }

  private updateGlobalCursor() {
    const { type } = this.moveInfo as MoveInfoType;
    const root = this.getRef('root') as HTMLElement;
    if ([LEFT_MOVE_TYPE, RIGHT_MOVE_TYPE].includes(type)) root.classList.add(css.horizontalResize);
    if ([TOP_MOVE_TYPE, BOTTOM_MOVE_TYPE].includes(type)) root.classList.add(css.verticalResize);
    if ([LEFT_BOTTOM_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
      root.classList.add(css.leftBottomResize);
    }
    if ([RIGHT_BOTTOM_MOVE_TYPE, LEFT_TOP_MOVE_TYPE].includes(type)) {
      root.classList.add(css.rightBottomResize);
    }
  }

  private removeGlobalCursor() {
    const root = this.getRef('root') as HTMLElement;
    root.classList.remove(css.horizontalResize);
    root.classList.remove(css.verticalResize);
    root.classList.remove(css.leftBottomResize);
    root.classList.remove(css.rightBottomResize);
  }

  private onLeftSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { left, right },
    } = this.moveInfo as MoveInfoType;
    const root = this.getRef('root') as HTMLElement;
    const rootWidth = root.offsetWidth;
    const offset = e.clientX - startPosition.left;
    const relativeOffset = offset / rootWidth * 100;
    const newLeft = left + relativeOffset;
    const maxLeft = Math.max(100 - right - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, left: Math.max(0, Math.min(newLeft, maxLeft)),
    };
  }

  private onRightSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { left, right },
    } = this.moveInfo as MoveInfoType;
    const root = this.getRef('root') as HTMLElement;
    const rootWidth = root.offsetWidth;
    const offset = e.clientX - startPosition.left;
    const relativeOffset = offset / rootWidth * 100;
    const newRight = right - relativeOffset;
    const maxRight = Math.max(100 - left - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, right: Math.max(0, Math.min(newRight, maxRight)),
    };
  }

  private onTopSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { top, bottom },
    } = this.moveInfo as MoveInfoType;
    const root = this.getRef('root') as HTMLElement;
    const rootHeight = root.offsetHeight;
    const offset = e.clientY - startPosition.top;
    const relativeOffset = offset / rootHeight * 100;
    const newTop = top + relativeOffset;
    const maxTop = Math.max(100 - bottom - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, top: Math.max(0, Math.min(newTop, maxTop)),
    };
  }

  private onBottomSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { top, bottom },
    } = this.moveInfo as MoveInfoType;
    const root = this.getRef('root') as HTMLElement;
    const rootHeight = root.offsetHeight;
    const offset = e.clientY - startPosition.top;
    const relativeOffset = offset / rootHeight * 100;
    const newBottom = bottom - relativeOffset;
    const maxBottom = Math.max(100 - top - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, bottom: Math.max(0, Math.min(newBottom, maxBottom)),
    };
  }
}

export default Content;
