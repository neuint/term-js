import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';

import css from './index.scss';
import './theme.scss';

class Term implements ITerm {
  private readonly container: Element;
  private header: string = '';

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

  public setHeader(text: string) {
    const { main, header, headerText } = this.containers;
    this.header = text;
    if (text) {
      headerText.innerHTML = text;
      main.appendChild(header);
    } else {
      main.removeChild(header);
    }
  }

  protected addElements() {
    const { container, containers } = this;
    const main = document.createElement('div');
    main.className = css.term;
    containers.main = main;
    this.addHeader();
    container.appendChild(main);
  }

  protected addHeader() {
    const { containers } = this;
    const header = document.createElement('div');
    const headerText = document.createElement('span');
    header.className = css.header;
    headerText.className = css.headerText;
    containers.header = header;
    containers.headerText = headerText;
    header.appendChild(headerText);
  }
}

export default Term;
