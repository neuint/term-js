import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@term-js/term';
import './theme.scss';
import IStatusBar from '@StatusBar/IStatusBar';
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
    private setView;
}
export default StatusBar;
