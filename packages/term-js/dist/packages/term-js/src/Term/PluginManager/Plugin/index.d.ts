import ITermInfo from '../../_interfaces/ITermInfo';
import IKeyboardShortcutsManager from '../../KeyboardShortcutsManager/IKeyboardShortcutsManager';
import IPlugin from './IPlugin';
import IPluginManager from '../IPluginManager';
declare abstract class Plugin implements IPlugin {
    readonly name: string;
    protected termInfo?: ITermInfo;
    protected keyboardShortcutsManager?: IKeyboardShortcutsManager;
    protected pluginManager: IPluginManager;
    constructor(pluginManager: IPluginManager);
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    destroy(): void;
    equal(plugin: IPlugin): boolean;
    abstract clear(): any;
}
export default Plugin;
