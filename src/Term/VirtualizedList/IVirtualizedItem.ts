export default interface IVirtualizedItem<T> {
  hidden: boolean;
  height: number;
  show(append: boolean, ref?: T): void;
  hide(): void;
}
