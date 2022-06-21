import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import './theme.scss';
import IContextMenu from './IContextMenu';
import { ShowOptionsType, TargetType } from './types';
export { default as IContextMenu } from './IContextMenu';
export { PositionType, ShowOptionsType, TargetType } from './types';
declare class ContextMenu extends Plugin implements IContextMenu {
    readonly name: string;
    private contextMenuView?;
    private target?;
    private position?;
    private isVisible;
    private escHide;
    private aroundClickHide;
    private onHide?;
    show(content: HTMLElement | string, target: TargetType, options?: ShowOptionsType): void;
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
    private updateFixedPosition;
    private setVisible;
    private normalizedPosition;
}
export default ContextMenu;
