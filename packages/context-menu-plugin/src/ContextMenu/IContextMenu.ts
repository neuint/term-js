import { PositionType, TargetType } from '@ContextMenu/types';

export default interface IContextMenu {
  show(content: HTMLElement | string, target: TargetType, positions?: PositionType): void;
  hide(): void;
}
