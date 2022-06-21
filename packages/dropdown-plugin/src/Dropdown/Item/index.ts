import { TemplateEngine } from '@neuint/term-js';
import IItem from './IItem';

import template from './template.html';
import './index.scss';

class Item extends TemplateEngine implements IItem {
  public readonly index: number;

  private isActive = false;

  public get active(): boolean {
    return this.isActive;
  }

  public set active(val: boolean) {
    const root = this.getRef('root');
    if (val !== this.isActive && root) {
      if (val) {
        root.classList.add('Item__active');
      } else {
        root.classList.remove('Item__active');
      }
    }
    this.isActive = val;
  }

  private readonly match: string;

  private readonly text: string;

  private readonly suggestion: string;

  private readonly onHover?: (text: string, item: IItem) => void;

  private readonly onClick?: (text: string, item: IItem) => void;

  private isRendered = false;

  constructor(
    container: HTMLElement,
    params: {
      value: string;
      text: string;
      index: number;
      onHover?: (text: string, item: IItem) => void;
      onClick?: (text: string, item: IItem) => void;
    },
  ) {
    super(template, container);
    const { value, text, index, onHover, onClick } = params;
    this.text = text;
    this.index = index;
    this.match = value;
    this.onHover = onHover;
    this.onClick = onClick;
    this.suggestion = text.replace(value, '');
  }

  public render() {
    const { match, suggestion, isActive, isRendered } = this;
    this.removeListeners();
    super.render(
      { match, suggestion, active: isActive ? 'Item__active' : '' },
      isRendered ? { replace: this } : {},
    );
    this.addListeners();
    this.isRendered = true;
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  private clickHandler = () => {
    const { text, onClick } = this;
    if (onClick) onClick(text, this);
  };

  private hoverHandler = () => {
    const { text, onHover } = this;
    if (onHover) onHover(text, this);
  };

  private addListeners() {
    const root = this.getRef('root');
    if (root) {
      (root as HTMLElement).addEventListener('click', this.clickHandler);
      (root as HTMLElement).addEventListener('mousemove', this.hoverHandler);
    }
  }

  private removeListeners() {
    const root = this.getRef('root');
    if (root) {
      (root as HTMLElement).removeEventListener('click', this.clickHandler);
      (root as HTMLElement).removeEventListener('mousemove', this.hoverHandler);
    }
  }
}

export default Item;
