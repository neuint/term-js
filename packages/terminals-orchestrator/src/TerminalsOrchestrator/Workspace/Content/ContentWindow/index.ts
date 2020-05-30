import template from './template.html';
import css from './index.scss';

import { TemplateEngine, Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import { MoveType, OptionsType } from './types';
import IContentWindow from './IContentWindow';
import { MOVE_TYPES } from '../constants';
import TermHeaderPlugin from './TermHeaderPlugin';
import ITermHeaderPlugin from './TermHeaderPlugin/ITermHeaderPlugin';

class ContentWindow extends TemplateEngine implements IContentWindow {
  private lockSelectionField: boolean = false;
  public get lockSelection(): boolean {
    return this.lockSelectionField;
  }
  public set lockSelection(val: boolean) {
    const { lockSelectionField } = this;
    this.lockSelectionField = val;
    const root = this.getRef('root') as HTMLElement;
    if (!root || lockSelectionField === val) return;
    if (val) root.classList.add(css.lockSelection);
    else root.classList.remove(css.lockSelection);
  }

  public get position(): { left: number; right: number; top: number; bottom: number } {
    const { left, right, top, bottom } = this.options.position;
    return { left, right, top, bottom };
  }

  public set position(val: { left: number; right: number; top: number; bottom: number }) {
    const { left, right, top, bottom } = val;
    const { position } = this.options;
    this.options.position = { left, right, top, bottom };
    const root = this.getRef('root') as HTMLElement;
    if (position.left !== left) root.style.left = `${left}%`;
    if (position.right !== right) root.style.right = `${right}%`;
    if (position.top !== top) root.style.top = `${top}%`;
    if (position.bottom !== bottom) root.style.bottom = `${bottom}%`;
  }

  private get dragElements(): {
    leftTop: HTMLElement;
    rightTop: HTMLElement;
    leftBottom: HTMLElement;
    rightBottom: HTMLElement;
    left: HTMLElement;
    right: HTMLElement;
    top: HTMLElement;
    bottom: HTMLElement;
  } {
    return {
      leftTop: this.getRef('leftTop') as HTMLElement,
      rightTop: this.getRef('rightTop') as HTMLElement,
      leftBottom: this.getRef('leftBottom') as HTMLElement,
      rightBottom: this.getRef('rightBottom') as HTMLElement,
      left: this.getRef('left') as HTMLElement,
      right: this.getRef('right') as HTMLElement,
      top: this.getRef('top') as HTMLElement,
      bottom: this.getRef('bottom') as HTMLElement,
    };
  }

  private readonly options: OptionsType;
  private readonly termHeaderPlugin: ITermHeaderPlugin;
  private term: ITerm;
  private moveType?: MoveType;
  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.options = options;
    this.render();
    this.term = new Term(this.getRef('content') as HTMLElement, {
      lines: [],
      header: 'Untitled',
    });
    this.termHeaderPlugin = new TermHeaderPlugin({ onStartMove: this.onMouseDown });
    this.term.pluginManager.register(this.termHeaderPlugin);
  }

  public render() {
    super.render({ css, ...this.options.position });
    this.addListeners();
  }

  public destroy() {
    this.termHeaderPlugin.destroy();
    this.term.destroy();
    this.removeListeners();
    super.destroy();
  }

  private addListeners() {
    const {
      leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom,
    } = this.dragElements;

    leftTop.addEventListener('mousedown', this.onMouseDown);
    rightTop.addEventListener('mousedown', this.onMouseDown);
    leftBottom.addEventListener('mousedown', this.onMouseDown);
    rightBottom.addEventListener('mousedown', this.onMouseDown);

    left.addEventListener('mousedown', this.onMouseDown);
    right.addEventListener('mousedown', this.onMouseDown);
    top.addEventListener('mousedown', this.onMouseDown);
    bottom.addEventListener('mousedown', this.onMouseDown);

    window.addEventListener('mouseup', this.onEndMove);
    window.addEventListener('mouseleave', this.onEndMove);
    window.addEventListener('mousemove', this.onMove);
  }

  private removeListeners() {
    const {
      leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom,
    } = this.dragElements;

    leftTop.removeEventListener('mousedown', this.onMouseDown);
    rightTop.removeEventListener('mousedown', this.onMouseDown);
    leftBottom.removeEventListener('mousedown', this.onMouseDown);
    rightBottom.removeEventListener('mousedown', this.onMouseDown);

    left.removeEventListener('mousedown', this.onMouseDown);
    right.removeEventListener('mousedown', this.onMouseDown);
    top.removeEventListener('mousedown', this.onMouseDown);
    bottom.removeEventListener('mousedown', this.onMouseDown);

    window.removeEventListener('mouseup', this.onEndMove);
    window.removeEventListener('mouseleave', this.onEndMove);
    window.removeEventListener('mousemove', this.onMove);
  }

  private onMouseDown = (e: MouseEvent) => {
    const { onStartMove } = this.options;
    const { target } = e;
    if (!target || !onStartMove) return;
    const dataType = (target as HTMLElement).getAttribute('data-type');
    if (dataType && MOVE_TYPES.includes(dataType)) {
      this.moveType = dataType as MoveType;
      onStartMove(dataType as MoveType, this, e);
    }
  }

  private onEndMove = (e: MouseEvent) => {
    const { moveType, options: { onEndMove } } = this;
    if (!moveType) return;
    delete this.moveType;
    if (onEndMove) onEndMove(moveType, this, e);
  }

  private onMove = (e: MouseEvent) => {
    const { moveType, options: { onMove } } = this;
    if (moveType && onMove) onMove(moveType, this, e);
  }
}

export default ContentWindow;
