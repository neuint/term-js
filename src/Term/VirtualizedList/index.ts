import { isNumber, isUndefined, last } from 'lodash-es';
import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import TemplateEngine from '@Term/TemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';

import template from './template.html';
import css from './index.scss';

class VirtualizedList<T extends IVirtualizedItem> extends TemplateEngine
  implements IVirtualizedList<T> {
  private lengthValue: number = 0;
  public set length(value: number) {
    this.lengthValue = value;
    this.updateHeight();
    this.renderViewportItems();
  }
  public get length(): number {
    return this.lengthValue;
  }

  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private itemGetter: (index: number, container?: HTMLElement) => T | null;
  private heightGetter: (index: number) => number;
  private height: number = 0;
  private readonly topOffset: number = 100;
  private readonly bottomOffset: number = 100;
  private itemsCache: { [key: number]: T } = {};
  private viewportItems: number[] = [];
  private renderedItems: number[] = [];
  private offset: number = 0;

  private static checkViewportItem(
    params: {
      viewportStart: number; viewportEnd: number; itemOffsetStart: number; itemOffsetEnd: number;
    },
  ): boolean {
    const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;
    return (viewportStart <= itemOffsetStart && viewportEnd > itemOffsetEnd)
      || (viewportEnd <= itemOffsetStart && viewportEnd > itemOffsetEnd);
  }

  constructor(
    container: Element,
    params: {
      length: number;
      itemGetter: (index: number, container?: HTMLElement) => T | null;
      heightGetter: (index: number) => number;
      topOffset?: number;
      bottomOffset?: number;
    },
  ) {
    super(template, container);
    this.lengthValue = params.length;
    this.itemGetter = params.itemGetter;
    this.heightGetter = params.heightGetter;
    this.topOffset = params.topOffset || this.topOffset;
    this.bottomOffset = params.bottomOffset || this.bottomOffset;
    this.render({ css });
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
    const viewportStart = Math.max(root.scrollTop - topOffset, 0);
    const viewportEnd = viewportStart + root.offsetHeight + bottomOffset;
    let itemOffsetStart = 0;
    let itemOffsetEnd = 0;
    let isFound = false;
    let offset;
    const items = [];
    for (let i = 0; i < length; i += 1) {
      const itemHeight = heightGetter(i);
      itemOffsetStart = itemOffsetEnd;
      itemOffsetEnd = itemOffsetStart + itemHeight;
      const isViewportItem = VirtualizedList.checkViewportItem({
        viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd,
      });
      isFound = isViewportItem || isFound;
      if (isFound && !isViewportItem) break;
      if (isViewportItem) {
        items.push(i);
        offset = isUndefined(offset) ? itemOffsetStart : offset;
      }
    }
    this.viewportItems = items;
    this.offset = offset || 0;
    this.renderItems();
  }

  private renderItems() {
    const { viewportItems, offset } = this;
    const itemsContainer = this.getRef('itemsContainer') as HTMLElement;
    if (itemsContainer && viewportItems.length) {
      if (!viewportItems.length) this.removeAllItems();
      this.removeStartItems();
      this.removeEndItems();
      viewportItems.forEach((index: number) => {
        this.renderItem(index);
      });
    }
    itemsContainer.style.top  = `${Math.round(offset)}px`;
  }

  private renderItem(index: number) {
    const { itemsCache, renderedItems } = this;
    if (renderedItems.includes(index)) return;
    // if (!renderedItems.length) {
    //
    // }
    const firstIndex = renderedItems[0];
    const lastIndex = last(renderedItems) as number;
    // if (itemsCache[index]) return itemsCache[index].show();
  }

  private removeStartItems() {
    const { viewportItems, renderedItems } = this;
    if (viewportItems.length) {
      const firstItem = viewportItems[0];
      renderedItems.some((itemIndex: number) => {
        if (itemIndex >= firstItem) return true;
        this.removeItem(itemIndex);
      });
    }
  }

  private removeEndItems() {
    const { viewportItems, renderedItems } = this;
    if (viewportItems.length) {
      const lastItem = last(viewportItems) as number;
      renderedItems.reverse().some((itemIndex: number) => {
        if (itemIndex <= lastItem) return true;
        this.removeItem(itemIndex);
      });
    }
  }

  private removeAllItems() {
    const { renderedItems } = this;
    renderedItems.forEach((itemIndex: number) => this.removeItem(itemIndex));
    this.renderedItems = [];
  }

  private removeItem(index: number) {
    const { itemsCache, renderedItems } = this;
    const position = renderedItems.indexOf(index);
    if (itemsCache[index]) itemsCache[index].hide();
    if (position >= 0) renderedItems.splice(position, 1);
  }
}

export default VirtualizedList;
