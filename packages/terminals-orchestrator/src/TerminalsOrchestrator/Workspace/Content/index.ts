import { uniq } from 'lodash-es';

import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import { MoveInfoType, OptionsType, AnchorPointType } from '@TerminalsOrchestrator/Workspace/Content/types';
import ContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow';
import IContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow/IContentWindow';
import { MoveType } from '@TerminalsOrchestrator/Workspace/Content/ContentWindow/types';
import IContent from '@TerminalsOrchestrator/Workspace/Content/IContent';
import {
  ANCHOR_SIZE,
  BOTTOM_MOVE_TYPE, HEADER_MOVE_TYPE,
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
import { IS_MAC } from '@general/utils/browser';

class Content extends TemplateEngine implements IContent {
  public readonly id: number;

  private hiddenField: boolean = false;
  public get hidden(): boolean {
    return this.hiddenField;
  }
  public set hidden(val: boolean) {
    const { hiddenField } = this;
    this.hiddenField = val;
    if (hiddenField === val) return;
    if (val) (this.getRef('root') as HTMLElement).classList.add(css.hidden);
    else (this.getRef('root') as HTMLElement).classList.remove(css.hidden);
  }

  private readonly options: OptionsType;
  private contentWindows: IContentWindow[] = [];
  private moveInfo?: MoveInfoType;

  private get relativeAnchorSize(): number {
    const root = this.getRef('root') as HTMLElement;
    const { offsetWidth } = root;
    return ANCHOR_SIZE / offsetWidth * 100;
  }

  private get nextZIndex(): number {
    const { contentWindows } = this;
    return contentWindows.length
      ? contentWindows.sort((f, s) => s.zIndex - f.zIndex)[0].zIndex + 1
      : 0;
  }

  constructor(container: HTMLElement, options: OptionsType = { id: -1 }) {
    super(template, container);
    this.options = options;
    this.id = options.id;
    this.hiddenField = options.hidden || false;
    this.render();
  }

  public addContentWindow = () => {
    const cn = new ContentWindow(this.getRef('contentContainer') as HTMLElement, {
      position: { left: 20, right: 20, top: 20, bottom: 20 },
      onStartMove: this.onStartMove,
      onEndMove: this.onEndMove,
      onMove: this.onMove,
      onFocus: this.onFocus,
      title: this.options?.localization?.untitledTerm,
      zIndex: this.nextZIndex,
    });
    this.contentWindows.push(cn);
    this.onFocus(cn);
    return cn;
  }

  public render() {
    const { className = '', hidden } = this.options;
    super.render({ css, className, hidden: hidden ? css.hidden : '' });
    const addWindowShortcutText = this.getRef('addWindowShortcutText') as HTMLElement;
    addWindowShortcutText.innerHTML = IS_MAC ? '⌘E' : 'ctrl E';
    this.addListeners();
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  private addListeners() {
    const addWindowButton = this.getRef('addWindowButton') as HTMLElement;
    addWindowButton.addEventListener('click', this.addContentWindow);
  }

  private removeListeners() {
    const addWindowButton = this.getRef('addWindowButton') as HTMLElement;
    addWindowButton.removeEventListener('click', this.addContentWindow);
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

    if (HEADER_MOVE_TYPE === type) this.onWindowMove(e);
  }

  private onFocus = (contentWindow: IContentWindow) => {
    const sortedWindows = this.contentWindows.sort((f, s) => f.zIndex - s.zIndex);
    const zIndexMax = sortedWindows.length - 1;
    contentWindow.zIndex = zIndexMax;
    let isUpdating = false;
    sortedWindows.forEach((item) => {
      if (isUpdating) item.zIndex -= 1;
      if (item === contentWindow) isUpdating = true;
    });
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

  private getFilteredContentWindows(skip: IContentWindow): IContentWindow[] {
    const { contentWindows } = this;
    return contentWindows.filter(item => item !== skip);
  }

  private getHorizontalAnchorPoints(contentWindow: IContentWindow): AnchorPointType[] {
    const { relativeAnchorSize } = this;
    return uniq(this.getFilteredContentWindows(contentWindow).reduce((
      acc: number[], item: IContentWindow,
    ): number[] => {
      const { left, right } = item.position;
      acc.push(left);
      acc.push(100 - right);
      return acc;
    }, [] as number[])).filter((item: number): boolean => 0 !== item && 100 !== item).sort((
      first, second,
    ): number => {
      return first - second;
    }).reduce((
      acc: AnchorPointType[], position: number, index: number, arr: number[],
    ): AnchorPointType[] => {
      const prevPosition = arr[index - 1] || -1;
      const nextPosition = arr[index + 1] || -1;
      if (position <= 0) return acc;
      acc.push({
        position,
        startOffset: prevPosition >= 0 ? Math.min(relativeAnchorSize, (position - prevPosition) / 2)
          : relativeAnchorSize,
        endOffset: nextPosition >= 0 ? Math.min(relativeAnchorSize, (position + nextPosition) / 2)
          : relativeAnchorSize,
      });
      return acc;
    }, [] as AnchorPointType[]);
  }

  private getVerticalAnchorPoints(contentWindow: IContentWindow): AnchorPointType[] {
    const { relativeAnchorSize } = this;
    return uniq(this.getFilteredContentWindows(contentWindow).reduce((
      acc: number[], item: IContentWindow,
    ): number[] => {
      const { top, bottom } = item.position;
      acc.push(top);
      acc.push(100 - bottom);
      return acc;
    }, [] as number[])).filter((item: number): boolean => 0 !== item && 100 !== item).sort((
      first, second,
    ): number => {
      return first - second;
    }).reduce((
      acc: AnchorPointType[], position: number, index: number, arr: number[],
    ): AnchorPointType[] => {
      const prevPosition = arr[index - 1] || -1;
      const nextPosition = arr[index + 1] || -1;
      if (position <= 0) return acc;
      acc.push({
        position,
        startOffset: prevPosition >= 0 ? Math.min(relativeAnchorSize, (position - prevPosition) / 2)
          : relativeAnchorSize,
        endOffset: nextPosition >= 0 ? Math.min(relativeAnchorSize, (position + nextPosition) / 2)
          : relativeAnchorSize,
      });
      return acc;
    }, [] as AnchorPointType[]);
  }

  private onLeftSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { left, right },
    } = this.moveInfo as MoveInfoType;
    const horizontalAnchorPoints = this.getHorizontalAnchorPoints(contentWindow);
    const root = this.getRef('root') as HTMLElement;
    const rootWidth = root.offsetWidth;
    const offset = e.clientX - startPosition.left;
    const relativeOffset = offset / rootWidth * 100;
    let newLeft = left + relativeOffset;
    horizontalAnchorPoints.some((item: AnchorPointType): boolean => {
      const { startOffset, position, endOffset } = item;
      const anchorMin = position - startOffset;
      const anchorMax = position + endOffset;
      if (newLeft < anchorMin || newLeft > anchorMax) return false;
      newLeft = position;
      return true;
    });
    const maxLeft = Math.max(100 - right - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, left: Math.max(0, Math.min(newLeft, maxLeft)),
    };
  }

  private onRightSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { left, right },
    } = this.moveInfo as MoveInfoType;
    const horizontalAnchorPoints = this.getHorizontalAnchorPoints(contentWindow);
    const root = this.getRef('root') as HTMLElement;
    const rootWidth = root.offsetWidth;
    const offset = e.clientX - startPosition.left;
    const relativeOffset = offset / rootWidth * 100;
    let newRight = right - relativeOffset;
    horizontalAnchorPoints.some((item: AnchorPointType): boolean => {
      const { startOffset, position, endOffset } = item;
      const rightPosition = 100 - position;
      const anchorMin = rightPosition - endOffset;
      const anchorMax = 100 - position + startOffset;
      if (newRight < anchorMin || newRight > anchorMax) return false;
      newRight = rightPosition;
      return true;
    });
    const maxRight = Math.max(100 - left - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, right: Math.max(0, Math.min(newRight, maxRight)),
    };
  }

  private onTopSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { top, bottom },
    } = this.moveInfo as MoveInfoType;
    const verticalAnchorPoints = this.getVerticalAnchorPoints(contentWindow);
    const root = this.getRef('root') as HTMLElement;
    const rootHeight = root.offsetHeight;
    const offset = e.clientY - startPosition.top;
    const relativeOffset = offset / rootHeight * 100;
    let newTop = top + relativeOffset;
    verticalAnchorPoints.some((item: AnchorPointType): boolean => {
      const { startOffset, position, endOffset } = item;
      const anchorMin = position - startOffset;
      const anchorMax = position + endOffset;
      if (newTop < anchorMin || newTop > anchorMax) return false;
      newTop = position;
      return true;
    });
    const maxTop = Math.max(100 - bottom - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, top: Math.max(0, Math.min(newTop, maxTop)),
    };
  }

  private onBottomSideMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { top, bottom },
    } = this.moveInfo as MoveInfoType;
    const verticalAnchorPoints = this.getVerticalAnchorPoints(contentWindow);
    const root = this.getRef('root') as HTMLElement;
    const rootHeight = root.offsetHeight;
    const offset = e.clientY - startPosition.top;
    const relativeOffset = offset / rootHeight * 100;
    let newBottom = bottom - relativeOffset;
    verticalAnchorPoints.some((item: AnchorPointType): boolean => {
      const { startOffset, position, endOffset } = item;
      const bottomPosition = 100 - position;
      const anchorMin = bottomPosition - endOffset;
      const anchorMax = 100 - position + startOffset;
      if (newBottom < anchorMin || newBottom > anchorMax) return false;
      newBottom = bottomPosition;
      return true;
    });
    const maxBottom = Math.max(100 - top - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
    contentWindow.position = {
      ...contentWindow.position, bottom: Math.max(0, Math.min(newBottom, maxBottom)),
    };
  }

  private onWindowMove(e: MouseEvent) {
    const {
      contentWindow, startPosition, startOffsets: { left, right, top, bottom },
    } = this.moveInfo as MoveInfoType;
    const root = this.getRef('root') as HTMLElement;
    const verticalOffset = e.clientY - startPosition.top;
    const horizontalOffset = e.clientX - startPosition.left;
    const { offsetHeight: rootHeight, offsetWidth: rootWidth } = root;
    const relativeVerticalOffset = verticalOffset / rootHeight * 100;
    const relativeHorizontalOffset = horizontalOffset / rootWidth * 100;
    const relativeWidth = 100 - left - right;
    const relativeHeight = 100 - top - bottom;

    let newLeft = Math.max(left + relativeHorizontalOffset, 0);
    let newRight = 100 - relativeWidth - newLeft;
    let newTop = Math.max(top + relativeVerticalOffset, 0);
    let newBottom = 100 - relativeHeight - newTop;
    if (newRight < 0) {
      newRight = 0;
      newLeft = 100 - relativeWidth;
    }
    if (newBottom < 0) {
      newBottom = 0;
      newTop = 100 - relativeHeight;
    }
    contentWindow.position = { left: newLeft, right: newRight, top: newTop, bottom: newBottom };
  }
}

export default Content;
