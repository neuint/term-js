import { isUndefined } from 'lodash-es';
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
  private itemGetter: (index: number) => T | null;
  private heightGetter: (index: number) => number;
  private height: number = 0;
  private readonly topOffset: number = 100;
  private readonly bottomOffset: number = 100;
  private itemsCache: { [key: number]: T } = {};
  private viewportItems: number[] = [];
  private offset: number = 0;

  private static checkViewportItem(
    params: { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd },
  ): boolean {

  }

  constructor(
    container: Element,
    params: {
      length: number;
      itemGetter: (index: number) => T | null;
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
    replace?: Element | Element[] | null,
  ) {
    super.render(params, replace);
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

  private renderViewportItems() {
    const { length, heightGetter, topOffset, bottomOffset } = this;
    const root = this.getRef('root');
    if (!root) return;
    const viewportStart = Math.max(root.scrollTop - topOffset, 0);
    const viewportEnd = viewportStart + root.scrollHeight + bottomOffset;
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
    const { viewportItems, offset, itemsCache, itemGetter } = this;
    const itemsContainer = this.getRef('itemsContainer') as HTMLElement;
    // if (itemsContainer) {
    //   viewportItems.forEach((index: number) => {
    //     itemsCache[index] = itemsCache[index] || itemGetter(index);
    //   });
    // }
    itemsContainer.style.top  = `${Math.round(offset)}px`;
  }
}

export default VirtualizedList;
