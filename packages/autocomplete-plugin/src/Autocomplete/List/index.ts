import { TemplateEngine } from '@term-js/term';

import template from './template.html';
import css from './index.scss';

import IList from '@Autocomplete/List/IList';
import { ItemRefListType } from '@Autocomplete/List/types';

class List extends TemplateEngine implements IList {
  private itemRefList: ItemRefListType = {};
  private reRender: boolean = false;

  private itemsField: string[] = [];
  public get items(): string[] {
    return this.itemsField;
  }
  public set items(val: string[]) {
    this.itemsField = val;
    this.setItemRefList();
    this.render();
  }

  private valueField: string = '';
  public get value(): string {
    return this.valueField;
  }
  public set value(val: string) {
    this.valueField = val;
    this.render();
  }

  private indexField: number = 0;
  public get index(): number {
    return this.indexField;
  }
  public set index(val: number) {
    this.indexField = Math.max(0, val);
  }

  constructor(container: HTMLElement) {
    super(template, container);
    this.setItemRefList();
    this.render();
  }

  public render() {
    super.render({ css }, this.reRender ? { replace: this } : {});
    const root = this.getRef('root');
    this.renderItems();
    this.reRender = true;
    if (root) (root as HTMLElement).style.visibility = 'visible';
  }

  private renderItems() {
    const root = this.getRef('root');
    const { itemRefList, itemsField, valueField } = this;
    if (root && valueField) {
      itemsField.forEach((item: string, index: number) => {
        if (item.includes(valueField)) {
          root.appendChild(itemRefList[index].el);
        }
      });
    }
  }

  private setItemRefList() {
    const { itemsField, itemRefList } = this;
    this.itemRefList = itemsField.reduce((
      acc: ItemRefListType, item: string, index: number,
    ): ItemRefListType => {
      if (itemRefList[index]?.val === item) {
        acc[index] = itemRefList[index];
      } else {
        const el = document.createElement('li');
        el.classList.add(css.item);
        el.innerHTML = `<span class="${css.itemText}">${item}</span>`;
        acc[index] = { el, val: item };
      }
      return acc;
    }, {} as ItemRefListType);
  }
}

export default List;
