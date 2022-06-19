import IPlugin from './Plugin/IPlugin';
import ITermInfo from '../_interfaces/ITermInfo';
export default interface IPluginManager {
    updateTermInfo(termInfo: ITermInfo): void;
    register(plugin: IPlugin, name?: string): void;
    unregister(descriptor: string | IPlugin): void;
    getPlugin(descriptor: string | (new () => IPlugin)): IPlugin | null;
    destroy(): void;
}
