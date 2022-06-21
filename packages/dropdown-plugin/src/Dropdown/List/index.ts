import { TemplateEngine } from '@neuint/term-js';

import template from './template.html';
import './index.scss';

import IList from './IList';
import Item from '../Item';
import IItem from '../Item/IItem';

class List extends TemplateEngine implements IList {
  private reRender = false;

  private listItems: IItem[] = [];

  private itemsField: string[] = [];

  public get items(): string[] {
    return this.itemsField;
  }

  public set items(val: string[]) {
    this.itemsField = val;
    this.render();
  }

  private valueField = '';

  public get value(): string {
    return this.valueField;
  }

  public set value(val: string) {
    if (this.valueField !== val) {
      this.valueField = val;
      this.render();
    }
  }

  private indexField = 0;

  public get index(): number {
    return this.indexField;
  }

  public set index(val: number) {
    const newIndex = Math.max(0, val);
    if (this.indexField !== newIndex) {
      this.indexField = newIndex;
      this.render();
    }
  }

  private onSelect?: (text: string, index: number) => void;

  constructor(container: HTMLElement, onSelect?: (text: string, index: number) => void) {
    super(template, container);
    this.onSelect = onSelect;
    this.render();
  }

  public render() {
    super.render({}, this.reRender ? { replace: this } : {});
    this.renderItems();
    this.reRender = true;
  }

  private onItemHover = (_: string, line: IItem) => {
    const { listItems } = this;
    listItems.forEach((item, index: number) => {
      if (item === line) {
        this.indexField = index;
        // eslint-disable-next-line no-param-reassign
        item.active = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        item.active = false;
      }
    });
  };

  private onItemClick = (text: string, item: IItem) => {
    const { onSelect } = this;
    if (onSelect) onSelect(text, item.index);
  };

  private renderItems() {
    const root = this.getRef('root');
    const { itemsField, valueField, indexField } = this;
    const listItems: IItem[] = [];
    let isSetActive = false;
    if (root) {
      this.destroyItems();
      itemsField.forEach((item: string, index: number) => {
        if (!valueField || item.includes(valueField)) {
          const isActive = indexField === index;
          isSetActive = isSetActive || isActive;
          const listItem = new Item(root as HTMLElement, {
            index,
            value: valueField,
            text: item,
            onHover: this.onItemHover,
            onClick: this.onItemClick,
          });
          listItem.render();
          listItem.active = isActive;
          listItems.push(listItem);
        }
      });
      this.listItems = listItems;
      if (!isSetActive) {
        this.indexField = 0;
        if (listItems[0]) listItems[0].active = true;
      }
    }
  }

  private destroyItems() {
    this.listItems.forEach((listItem) => listItem.destroy());
    this.listItems = [];
  }
}

export default List;
