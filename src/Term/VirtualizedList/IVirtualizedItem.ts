export default interface IVirtualizedItem {
  hidden: boolean;
  height: number;
  show(): void;
  hide(): void;
}
