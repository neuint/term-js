import IPluginManager from '@Term/PluginManager/IPluginManager';
import IPlugin from '@Term/PluginManager/Plugin/IPlugin';
import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
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
