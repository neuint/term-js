import template from './template.html';
import css from './index.scss';

import { TemplateEngine, Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import { OptionsType } from './types';
import IContentWindow from '@TerminalsOrchestrator/Workspace/Content/ContentWindow/IContentWindow';

class ContentWindow extends TemplateEngine implements IContentWindow {
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
  private term: ITerm;
  constructor(container: HTMLElement, options: OptionsType) {
    super(template, container);
    this.options = options;
    this.render();
    this.term = new Term(this.getRef('content') as HTMLElement, {
      lines: [],
    });
  }

  public render() {
    super.render({ css, ...this.options.position });
    this.addListeners();
  }

  public destroy() {
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
  }

  onMouseDown = (e: Event) => {

  }
}

export default ContentWindow;
