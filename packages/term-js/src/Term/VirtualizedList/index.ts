import { isUndefined, last } from 'lodash-es';

import template from './template.html';
import css from './index.scss';

import IVirtualizedList from './IVirtualizedList';
import TemplateEngine from '../TemplateEngine';
import IVirtualizedItem from './IVirtualizedItem';

class VirtualizedList<T extends IVirtualizedItem<any>> extends TemplateEngine
  implements IVirtualizedList<T> {

  private lengthValue = 0;

  public set length(value: number) {
    this.lengthValue = value;
    this.updateHeight();
    this.renderViewportItems();
  }

  public get length(): number {
    return this.lengthValue;
  }

  private scrollTimeout?: ReturnType<typeof setTimeout>;

  private itemGetter: (
    index: number,
    params?: { container?: HTMLElement, ref?: T, append?: boolean },
  ) => T | null;

  private heightGetter: (index: number) => number;

  private height = 0;

  private readonly topOffset: number;

  private readonly bottomOffset: number;

  private itemsCache: { [key: number]: T } = {};

  private viewportItems: number[] = [];

  private renderedItems: number[] = [];

  private offset = 0;

  private restoreParams: {
    index: number;
    bottomOffset: number;
    width: number;
    height: number;
  } = { index: -1, bottomOffset: -1, width: -1, height: -1 };

  private static checkFullViewportItem(
    params: {
      viewportStart: number; viewportEnd: number; itemOffsetStart: number; itemOffsetEnd: number;
    },
  ): boolean {
    const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;

    return viewportStart <= itemOffsetStart && viewportEnd >= itemOffsetEnd;
  }

  private static checkViewportItem(
    params: {
      viewportStart: number; viewportEnd: number; itemOffsetStart: number; itemOffsetEnd: number;
    },
  ): boolean {
    const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;

    return (viewportStart <= itemOffsetStart && viewportEnd >= itemOffsetEnd)
      || (viewportStart > itemOffsetStart && viewportStart < itemOffsetEnd)
      || (viewportEnd > itemOffsetStart && viewportEnd < itemOffsetEnd);
  }

  constructor(
    container: Element,
    params: {
      length: number;
      itemGetter: (
        index: number,
        params?: { container?: HTMLElement, ref?: T, append?: boolean },
      ) => T | null;
      heightGetter: (index: number) => number;
      topOffset?: number;
      bottomOffset?: number;
      className?: string;
    },
  ) {
    super(template, container);
    (window as unknown as { vl: IVirtualizedList<any> }).vl = this;
    this.lengthValue = params.length;
    this.itemGetter = params.itemGetter;
    this.heightGetter = params.heightGetter;
    this.topOffset = params.topOffset || this.topOffset;
    this.bottomOffset = params.bottomOffset || this.bottomOffset;
    this.render({
      css: { ...css, className: params.className || '' },
    });
    this.renderViewportItems();
    this.frameHandler = this.renderViewportItems;
    this.registerFrameHandler();
  }

  public scrollBottom() {
    if (!isUndefined(this.scrollTimeout)) clearTimeout(this.scrollTimeout);
    const root = this.getRef('root') as HTMLElement;
    if (!root) return;
    this.scrollTimeout = setTimeout(() => {
      root.scrollTop = root.scrollHeight - root.offsetHeight;
    }, 0);
  }

  public destroy() {
    if (!isUndefined(this.scrollTimeout)) clearTimeout(this.scrollTimeout);
    super.destroy();
  }

  public getGeneralItemsContainer(): Element | undefined {
    return this.getRef('generalList');
  }

  public getVirtualItemsContainer(): Element | undefined {
    return this.getRef('itemsContainer');
  }

  public render(
    params?: {
      css?: { [p: string]: string };
      [p: string]: string | number | boolean | { [p: string]: string } | undefined },
  ) {
    super.render(params);
    this.updateHeight();
  }

  public updateViewport() {
    this.removeAllItems();
    this.updateHeight();
    this.renderItems();
  }

  public clearCache() {
    this.itemsCache = {};
  }

  private updateHeight() {
    const { length, heightGetter } = this;
    const virtualizedList = this.getRef('virtualizedList') as HTMLElement;
    let height = 0;
    for (let i = 0; i < length; i += 1) {
      height += heightGetter(i);
    }
    if (this.height !== height) virtualizedList.style.height = `${height}px`;
    this.height = height;
  }

  private renderViewportItems = () => {
    const { length, heightGetter, topOffset, bottomOffset } = this;
    const root = this.getRef('root') as HTMLElement;
    if (!root) return;
    this.restoreScrollTop();
    const viewportStart = Math.max(root.scrollTop - topOffset, 0);
    const visibleViewportEnd = viewportStart + root.offsetHeight + topOffset;
    const viewportEnd = visibleViewportEnd + bottomOffset;
    let itemOffsetStart = 0;
    let itemOffsetEnd = 0;
    let isFound = false;
    let isVisibleFound = false;
    let offset;
    let lastItemOffset = 0;
    let lastItemHeight = 0;
    let lastItemIndex = -1;
    let isVisibleLastNotFound = true;
    const items = [];
    for (let i = 0; i < length; i += 1) {
      const itemHeight = heightGetter(i);
      itemOffsetStart = itemOffsetEnd;
      itemOffsetEnd = itemOffsetStart + itemHeight;
      const isViewportItem = VirtualizedList.checkViewportItem({
        viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd,
      });
      const isVisibleViewportItem = isVisibleLastNotFound ? VirtualizedList.checkFullViewportItem({
        viewportStart, itemOffsetStart, itemOffsetEnd, viewportEnd: visibleViewportEnd,
      }) : isVisibleLastNotFound;
      isFound = isViewportItem || isFound;
      isVisibleFound = isVisibleViewportItem || isVisibleFound;
      if (isVisibleFound && !isVisibleViewportItem) isVisibleLastNotFound = false;
      if (isVisibleLastNotFound) {
        lastItemOffset += lastItemHeight;
        lastItemHeight = itemHeight;
        lastItemIndex = i;
      }
      if (isFound && !isViewportItem) break;
      if (isViewportItem) {
        items.push(i);
        offset = isUndefined(offset) ? itemOffsetStart : offset;
      }
    }
    this.viewportItems = items;
    this.offset = offset || 0;
    this.updateRestoreParams(lastItemIndex, lastItemOffset, lastItemHeight);
    this.renderItems();
  };

  private renderItems() {
    const { viewportItems, offset, renderedItems } = this;
    const itemsContainer = this.getRef('itemsContainer') as HTMLElement;
    const rerenderRequired = itemsContainer
      && (viewportItems.length !== renderedItems.length
      || renderedItems.some((index, i): boolean => index !== viewportItems[i]));
    if (rerenderRequired) {
      if (!viewportItems.length) this.removeAllItems();
      this.removeStartItems();
      this.removeEndItems();
      viewportItems.forEach((index: number) => {
        this.renderItem(index);
      });
      itemsContainer.style.top = `${Math.round(offset)}px`;
    }
  }

  // TODO: simplify method
  private renderItem(index: number) {
    const { itemsCache, renderedItems, itemGetter } = this;
    let beforeRenderArrayIndex = -1;
    const beforeIndex = renderedItems.find((checkIndex: number, i: number): boolean => {
      if (checkIndex > index) {
        beforeRenderArrayIndex = i;
        return true;
      }
      return false;
    });
    const container = this.getRef('itemsContainer') as HTMLElement;
    if (!container) return;
    if (isUndefined(beforeIndex)) {
      if (itemsCache[index]) {
        itemsCache[index].show();
        if (!renderedItems.includes(index)) renderedItems.push(index);
      }
      const item = itemGetter(index, { container });
      if (item) itemsCache[index] = item;
      if (!renderedItems.includes(index)) renderedItems.push(index);
    } else {
      const beforeCacheItem = itemsCache[beforeIndex];
      const renderCacheItem = itemsCache[index];
      if (!beforeCacheItem) return;
      if (renderCacheItem) {
        renderCacheItem.show(false, beforeCacheItem);
        if (!renderedItems.includes(index)) renderedItems.splice(beforeRenderArrayIndex, 0, index);
      }
      const item = itemGetter(index, { container, append: false, ref: beforeCacheItem });
      if (item) itemsCache[index] = item;
      if (!renderedItems.includes(index)) renderedItems.splice(beforeRenderArrayIndex, 0, index);
    }
  }

  private removeStartItems() {
    const { viewportItems, renderedItems } = this;
    if (viewportItems.length) {
      const firstItem = viewportItems[0];
      let removeCount = 0;
      renderedItems.some((itemIndex: number) => {
        if (itemIndex >= firstItem) return true;
        removeCount += 1;
        this.removeItem(itemIndex);
        return false;
      });
      renderedItems.splice(0, removeCount);
    }
  }

  private removeEndItems() {
    const { viewportItems, renderedItems } = this;
    if (viewportItems.length) {
      let removeCount = 0;
      const lastItem = last(viewportItems) as number;
      renderedItems.reverse().some((itemIndex: number) => {
        if (itemIndex <= lastItem) return true;
        removeCount += 1;
        this.removeItem(itemIndex);
        return false;
      });
      renderedItems.splice(0, removeCount);
      renderedItems.reverse();
    }
  }

  private removeAllItems() {
    const { renderedItems } = this;
    renderedItems.forEach((itemIndex: number) => this.removeItem(itemIndex));
    this.renderedItems = [];
  }

  private removeItem(index: number) {
    const { itemsCache } = this;
    if (itemsCache[index]) itemsCache[index].hide();
  }

  private restoreScrollTop() {
    const { index, height, width } = this.restoreParams;
    if (index >= 0 && height >= 0 && width >= 0) this.updateScrollTop();
  }

  private updateScrollTop() {
    const { length, heightGetter } = this;
    const { width, index, bottomOffset } = this.restoreParams;
    const root = this.getRef('root') as HTMLElement;
    if (!root || width === root.offsetWidth) return;
    const { offsetHeight } = root;
    let itemOffset = 0;
    let height = 0;
    for (let i = 0; i < length; i += 1) {
      if (i === index) {
        height = heightGetter(i);
        break;
      } else {
        itemOffset += heightGetter(i);
      }
    }
    root.scrollTop = Math.max(0, itemOffset + height + bottomOffset - offsetHeight);
  }

  private updateRestoreParams(
    lastItemIndex: number, lastItemOffset: number, lastItemHeight: number,
  ) {
    const root = this.getRef('root') as HTMLElement;
    if (!root) return;
    const { offsetHeight, offsetWidth, scrollTop } = root;
    this.restoreParams = {
      index: lastItemIndex,
      width: offsetWidth,
      height: offsetHeight,
      bottomOffset: scrollTop + offsetHeight - lastItemOffset - lastItemHeight,
    };
  }
}

export default VirtualizedList;
