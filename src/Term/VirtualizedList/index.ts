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
  }
  public get length(): number {
    return this.lengthValue;
  }

  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private itemGetter: (index: number) => T | null;
  private heightGetter: (index: number) => number;
  private height: number = 0;

  constructor(
    container: Element,
    params: {
      length: number;
      itemGetter: (index: number) => T | null;
      heightGetter: (index: number) => number;
    },
  ) {
    super(template, container);
    this.lengthValue = params.length;
    this.itemGetter = params.itemGetter;
    this.heightGetter = params.heightGetter;
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
}

export default VirtualizedList;
