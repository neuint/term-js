import template from './template.html';
import css from './index.scss';

import { ITemplateEngine, TemplateEngine } from '@term-js/term';
import IHiddenList from '@TerminalsOrchestrator/Workspace/HiddenList/IHiddenList';
import { HiddenListOptionsType } from '@TerminalsOrchestrator/Workspace/HiddenList/types';
import HiddenListItem from '@TerminalsOrchestrator/Workspace/HiddenList/HiddenListItem';
import IHiddenListItem from '@TerminalsOrchestrator/Workspace/HiddenList/HiddenListItem/IHiddenListItem';

class HiddenList extends TemplateEngine implements IHiddenList {
  private readonly options: HiddenListOptionsType = { items: [] };
  private items: IHiddenListItem[] = [];
  constructor(container: HTMLElement, options: HiddenListOptionsType = { items: [] }) {
    super(template, container);
    this.options = options;
    this.render();
  }

  public render() {
    super.render({ css, className: this.options.className || '' });
    this.renderItems();
    this.updatePosition();
    this.addListeners();
  }

  public destroy() {
    this.removeListeners();
    this.items.forEach(item => item.destroy());
    super.destroy();
  }

  private renderItems() {
    const { items } = this.options;
    const list = this.getRef('list') as HTMLElement;
    this.items = items.map(({ text, id }): ITemplateEngine => {
      return new HiddenListItem(list, { text, index: id });
    });
  }

  private updatePosition() {
    const { position = {} } = this.options;
    const root = this.getRef('root') as HTMLElement;
    root.style.left = position.left ? `${position.left || 0}px` : '';
    root.style.right = position.right ? `${position.right || 0}px` : '';
    root.style.top = position.top ? `${position.top || 0}px` : '';
    root.style.bottom = position.bottom ? `${position.bottom || 0}px` : '';
  }

  private addListeners() {
    const { onClose } = this.options;
    if (onClose) {
      (this.getRef('root') as HTMLElement).addEventListener('click', onClose);
      (this.getRef('list') as HTMLElement).addEventListener('click', this.onListClick);
    }
  }

  private removeListeners() {
    const { onClose } = this.options;
    if (onClose) {
      (this.getRef('root') as HTMLElement).removeEventListener('click', onClose);
      (this.getRef('list') as HTMLElement).removeEventListener('click', this.onListClick);
    }
  }

  private onListClick = (e: Event) => {
    const { onSelect } = this.options;
    e.stopPropagation();
    const dataIndex = (e.target as HTMLElement).getAttribute('data-index');
    if (dataIndex && onSelect) onSelect(Number(dataIndex), e);
  }
}

export default HiddenList;
