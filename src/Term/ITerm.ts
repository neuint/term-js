import ITermEventMap from './ITermEventMap';

export default interface ITerm {
  write(data: string | string [], duration?: number): void;
  setCaret(caret: string): void;
  addEventListener<K extends keyof ITermEventMap>(
    type: K,
    handler: (e: ITermEventMap[K]) => void,
    options?: EventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ITermEventMap>(
    type: K,
    handler: (e: ITermEventMap[K]) => void,
    options?: EventListenerOptions,
  ): void;
  destroy(): void;
}
