import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';

import css from './index.scss';
import './theme.scss';

class Term implements ITerm {
  private readonly container: Element;

  private readonly containers: {
    [key: string]: Element;
  } = {};

  constructor(container: Element) {
    this.container = container;
    this.addElements();
  }

  public addEventListener<K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) {
    throw new Error('No implementation');
  }

  public removeEventListener<K extends keyof ITermEventMap>(
    type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions,
  ) {
    throw new Error('No implementation');
  }

  public write(data: string | string[], duration?: number) {
    throw new Error('No implementation');
  }

  protected addElements() {
    const { container, containers } = this;
    const main = document.createElement('div');
    main.className = css.term;
    containers.main = main;
    container.appendChild(main);
  }
}

export default Term;
