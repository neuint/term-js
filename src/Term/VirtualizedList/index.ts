import IVirtualizedList from '@Term/VirtualizedList/IVirtualizedList';
import TemplateEngine from '@Term/TemplateEngine';
import IVirtualizedItem from '@Term/VirtualizedList/IVirtualizedItem';

import template from './template.html';
import css from './index.scss';
import { isUndefined } from 'lodash-es';

class VirtualizedList<T extends IVirtualizedItem> extends TemplateEngine
  implements IVirtualizedList<T> {
  private generalItems: T[] = [];
  private virtualItems: T[] = [];
  private scrollTimeout?: ReturnType<typeof setTimeout>;

  constructor(container: Element) {
    super(template, container);
    this.render({ css });
    this.addListeners();
  }

  public append(item: T, virtual: boolean = true) {
    return virtual ? this.virtualItems.push(item) : this.generalItems.push(item);
  }

  public remove(item: T) {
    if (this.generalItems.includes(item)) {
      return this.generalItems = this.generalItems.filter(checkItem => checkItem === item);
    }
    if (this.virtualItems.includes(item)) {
      return this.virtualItems = this.virtualItems.filter(checkItem => checkItem === item);
    }
  }

  public getGeneralItemsContainer(): Element | undefined {
    return this.getRef('generalList');
  }

  public getVirtualItemsContainer(): Element | undefined {
    return this.getRef('virtualizedList');
  }

  public getItems(): T[] {
    return [...this.generalItems, ...this.virtualItems];
  }

  public getGeneralItems(): T[] {
    return this.generalItems;
  }

  public getVirtualItems(): T[] {
    return this.virtualItems;
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

  private addListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.addEventListener('scroll', this.scrollHandler);
  }

  private removeListeners() {
    const root = this.getRef('root') as HTMLElement;
    if (root) root.removeEventListener('scroll', this.scrollHandler);
  }

  private scrollHandler = (e: Event) => {
    console.log('e', e);
  }
}

export default VirtualizedList;
