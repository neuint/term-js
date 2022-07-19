import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import IContextMenu from './IContextMenu';
import { ShowOptionsType } from './types';
export { default as IContextMenu } from './IContextMenu';
export { ShowOptionsType } from './types';
export { CLOSE_ACTION } from './constants';
declare class ContextMenu extends Plugin implements IContextMenu {
    readonly name: string;
    private contextMenuView?;
    private isVisible;
    private escHide;
    private aroundClickHide;
    private onHide?;
    show(content: HTMLElement | string, options?: ShowOptionsType): void;
    hide(): void;
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    destroy(): void;
    clear(): void;
    private escHandler;
    private rootClickHandler;
    private render;
    private updatePosition;
    private updateEndOfLinePosition;
    private setVisible;
    private normalizedPosition;
}
export default ContextMenu;
