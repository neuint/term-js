import IPlugin from '@Term/PluginManager/Plugin/IPlugin';
import ITermInfo from '@Term/ITermInfo';
export default interface IPluginManager {
    updateTermInfo(termInfo: ITermInfo): void;
    register(plugin: IPlugin, name?: string): void;
    unregister(descriptor: string | IPlugin): void;
    getPlugin(descriptor: string | (new () => IPlugin)): IPlugin | null;
    destroy(): void;
}
