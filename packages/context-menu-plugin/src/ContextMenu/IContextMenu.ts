import { IPlugin } from '@neuint/term-js';
import { ShowOptionsType, TargetType } from './types';

export default interface IContextMenu extends IPlugin {
  show(content: HTMLElement | string, target: TargetType, options: ShowOptionsType): void;
  hide(): void;
}
