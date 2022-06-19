import ITermInfo from '../../_interfaces/ITermInfo';
import IKeyboardShortcutsManager from '../../KeyboardShortcutsManager/IKeyboardShortcutsManager';
export default interface IPlugin {
    name: string;
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    destroy(): void;
    equal(plugin: IPlugin): boolean;
    clear(): void;
}
