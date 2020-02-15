export default interface IVirtualizedItem {
  hidden: boolean;
  height: number;
  show(append: boolean, ref?: IVirtualizedItem): void;
  hide(): void;
}
