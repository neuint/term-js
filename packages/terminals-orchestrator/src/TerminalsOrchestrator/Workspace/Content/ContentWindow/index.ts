import template from './template.html';
import css from './index.scss';

import { TemplateEngine, Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import { MoveType, OptionsType } from './types';
import IContentWindow from './IContentWindow';
import { MOVE_TYPES } from '../constants';
import TermHeaderPlugin from './TermHeaderPlugin';
import ITermHeaderPlugin from './TermHeaderPlugin/ITermHeaderPlugin';
import strings from '@TerminalsOrchestrator/strings';

class ContentWindow extends TemplateEngine implements IContentWindow {
  public get title(): string {
    return this.term.header;
  }

  private isDisabled: boolean = false;
  public get disabled(): boolean {
    return this.isDisabled;
  }
  public set disabled(val: boolean) {
    const { isDisabled, term } = this;
    if (isDisabled === val) return;
    this.isDisabled = val;
    if (val) term.blur();
    term.disabled = val;
  }

  private zIndexField: number = 0;
  public get zIndex(): number {
    return this.zIndexField;
  }
  public set zIndex(val: number) {
    const { zIndexField } = this;
    this.zIndexField = val;
    if (zIndexField !== val) {
      const root = this.getRef('root') as HTMLElement;
      root.style.setProperty('--z-index', String(val));
    }
  }

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
    this.zIndexField = options.zIndex || 0;
    this.render();
    this.term = new Term(this.getRef('content') as HTMLElement, {
      lines: [],
      header: options.title || strings.untitledTerm,
    });
    this.termHeaderPlugin = new TermHeaderPlugin({
      onStartMove: this.onMouseDown, onRename: this.onRename, onClose: this.onClose,
    });
    this.term.pluginManager.register(this.termHeaderPlugin);
    this.addListeners();
  }

  public render() {
    super.render({ css, ...this.options.position, zIndex: this.zIndex });
  }

  public destroy() {
    this.removeListeners();
    this.term.destroy();
    super.destroy();
  }

  private addListeners() {
    const {
      leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom,
    } = this.dragElements;
    const root = this.getRef('root') as HTMLElement;

    leftTop.addEventListener('mousedown', this.onMouseDown);
    rightTop.addEventListener('mousedown', this.onMouseDown);
    leftBottom.addEventListener('mousedown', this.onMouseDown);
    rightBottom.addEventListener('mousedown', this.onMouseDown);

    left.addEventListener('mousedown', this.onMouseDown);
    right.addEventListener('mousedown', this.onMouseDown);
    top.addEventListener('mousedown', this.onMouseDown);
    bottom.addEventListener('mousedown', this.onMouseDown);

    root.addEventListener('focus', this.onFocus);
    this.term.addEventListener('focus', this.onFocus);

    window.addEventListener('mouseup', this.onEndMove);
    window.addEventListener('mouseleave', this.onEndMove);
    window.addEventListener('mousemove', this.onMove);
  }

  private removeListeners() {
    const {
      leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom,
    } = this.dragElements;
    const root = this.getRef('root') as HTMLElement;

    leftTop.removeEventListener('mousedown', this.onMouseDown);
    rightTop.removeEventListener('mousedown', this.onMouseDown);
    leftBottom.removeEventListener('mousedown', this.onMouseDown);
    rightBottom.removeEventListener('mousedown', this.onMouseDown);

    left.removeEventListener('mousedown', this.onMouseDown);
    right.removeEventListener('mousedown', this.onMouseDown);
    top.removeEventListener('mousedown', this.onMouseDown);
    bottom.removeEventListener('mousedown', this.onMouseDown);

    root.removeEventListener('focus', this.onFocus);
    this.term.removeEventListener('focus', this.onFocus);

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

  private onFocus = (e: Event) => {
    const { onFocus } = this.options;
    if (onFocus) onFocus(this, e);
  }

  private onRename = (name: string) => {
    this.term.header = name;
  }

  private onClose = () => {
    const { options: { onClose } } = this;
    if (onClose) onClose(this);
  }
}

export default ContentWindow;
