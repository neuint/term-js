import { ShowOptionsType, TargetType } from '@ContextMenu/types';
import { IPlugin } from '@term-js/term';
export default interface IContextMenu extends IPlugin {
    show(content: HTMLElement | string, target: TargetType, options: ShowOptionsType): void;
    hide(): void;
}
