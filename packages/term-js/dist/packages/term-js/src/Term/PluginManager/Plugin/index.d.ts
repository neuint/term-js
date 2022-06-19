import ITermInfo from '../../_interfaces/ITermInfo';
import IKeyboardShortcutsManager from '../../KeyboardShortcutsManager/IKeyboardShortcutsManager';
import IPlugin from './IPlugin';
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
