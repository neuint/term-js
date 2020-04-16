import IPlugin from './IPlugin';
import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
declare class Plugin implements IPlugin {
    readonly name: string;
    protected termInfo?: ITermInfo;
    protected keyboardShortcutsManager?: IKeyboardShortcutsManager;
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    destroy(): void;
    equal(plugin: IPlugin): boolean;
    clear(): void;
}
export default Plugin;
