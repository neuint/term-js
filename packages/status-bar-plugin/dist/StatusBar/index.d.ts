import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import IStatusBar from './IStatusBar';
export { default as IStatusBar } from './IStatusBar';
declare class StatusBar extends Plugin implements IStatusBar {
    readonly name: string;
    private text;
    private icon;
    private view?;
    set status(val: {
        text: string;
        icon?: string;
    });
    get status(): {
        text: string;
        icon?: string;
    };
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    destroy(): void;
    clear: (...args: any[]) => void;
    private setView;
}
export default StatusBar;
