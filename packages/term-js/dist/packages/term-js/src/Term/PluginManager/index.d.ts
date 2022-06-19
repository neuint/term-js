import IPluginManager from './IPluginManager';
import IPlugin from './Plugin/IPlugin';
import ITermInfo from '../_interfaces/ITermInfo';
import IKeyboardShortcutsManager from '../KeyboardShortcutsManager/IKeyboardShortcutsManager';
declare class PluginManager implements IPluginManager {
    private pluginList;
    private termInfo;
    private readonly keyboardShortcutsManager;
    constructor(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager);
    updateTermInfo(termInfo: ITermInfo): void;
    register(plugin: IPlugin, name?: string): void;
    unregister(descriptor: string | IPlugin): void;
    destroy(): void;
    getPlugin(descriptor: string | (new () => IPlugin)): IPlugin | null;
    private getPluginIndex;
    private clearPlugins;
}
export default PluginManager;
