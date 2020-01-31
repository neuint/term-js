import ITerm from './ITerm';
import ITermEventMap from './ITermEventMap';

class Term implements ITerm {
  private readonly container: Element;
  constructor(container: Element) {
    this.container = container;
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
}

export default Term;
