import { IPlugin } from '@neuint/term-js';
import { ShowOptionsType } from './types';

export default interface IContextMenu extends IPlugin {
  show(content: HTMLElement | string, options: ShowOptionsType): void;
  hide(): void;
}
