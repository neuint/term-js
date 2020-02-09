import { isUndefined, last, throttle } from 'lodash-es';
import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import TemplateEngine from '@Term/TemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';

import template from './template.html';
import css from './index.scss';

class VirtualizedList<T extends IVirtualizedItem> extends TemplateEngine
  implements IVirtualizedList<T> {
  private static checkVisibleItem(
    data: { item: IVirtualizedItem, offset: number }, startOffset: number, endOffset: number,
  ): boolean {
    const itemStartOffset = data.offset;
    const itemEndOffset = data.offset + data.item.height;
    return (itemStartOffset >= startOffset && itemStartOffset < endOffset)
      || (itemEndOffset >= startOffset && itemEndOffset < endOffset);
  }

  private generalItems: T[] = [];
  private virtualItems: { item: T, offset: number }[] = [];
  private scrollTimeout?: ReturnType<typeof setTimeout>;

  constructor(container: Element) {
    super(template, container);
    this.render({ css });
    this.addListeners();
    this.updateVirtualization();
  }

  public append(item: T, virtual: boolean = true) {
    const { virtualItems } = this;
    if (virtual) {
      const lastItem = last(virtualItems);
      virtualItems.push({ item, offset: lastItem ? lastItem.offset + lastItem.item.height : 0 });
      this.updateVirtualization();
      return;
    }
    this.generalItems.push(item);
  }

  public remove(item: T) {
    if (this.generalItems.includes(item)) {
      return this.generalItems = this.generalItems.filter(checkItem => checkItem === item);
    }
    const virtualIndex = this.virtualItems.findIndex((
      virtualItem,
    ): boolean => virtualItem.item === item);
    if (virtualIndex >= 0) {
      return this.virtualItems.splice(virtualIndex, 1);
    }
  }

  public getGeneralItemsContainer(): Element | undefined {
    return this.getRef('generalList');
  }

  public getVirtualItemsContainer(): Element | undefined {
    return this.getRef('virtualizedList');
  }

  public getItems(): T[] {
    return [...this.generalItems, ...this.getVirtualItems()];
  }

  public getGeneralItems(): T[] {
    return this.generalItems;
  }

  public getVirtualItems(): T[] {
    return this.virtualItems.map((virtualItem): T => virtualItem.item);
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
    this.removeListeners();
    super.destroy();
  }

  public updatePositions() {
    const { virtualItems } = this;
    virtualItems.forEach((virtualItem, index: number) => {
      if (index) {
        const prevVirtualItem = virtualItems[index - 1] as { item: T; offset: number };
        virtualItem.offset = prevVirtualItem.offset + prevVirtualItem.item.height;
      }
    });
    this.updateVirtualization();
  }

  private addListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.addEventListener('scroll', this.scrollHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.removeEventListener('scroll', this.scrollHandler);
  }

  private scrollHandler = (e: Event) => {
    this.updateVirtualization();
  }

  private updateVirtualization() {
    const { virtualItems } = this;
    const root = this.getRef('root') as HTMLElement;
    const virtualizedList = this.getRef('virtualizedList') as HTMLElement;
    const startOffset = root.scrollTop;
    const endOffset = startOffset + root.offsetHeight;
    if (!root || !virtualizedList || !virtualItems.length) return;
    virtualItems.forEach((virtualItem: { item: T; offset: number }) => {
      const { item } = virtualItem;
      return VirtualizedList.checkVisibleItem(virtualItem, startOffset, endOffset)
        ? item.show() : item.hide();
    });
  }
}

export default VirtualizedList;
