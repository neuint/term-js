import IPlugin from '@Term/PluginManager/Plugin/IPlugin';
import ITermInfo from '@Term/ITermInfo';

export default interface IPluginManager {
  updateTermInfo(termInfo: ITermInfo): void;
  register(name: string, plugin: IPlugin): void;
  unregister(name: string): void;
  getPlugin(descriptor: string | (new () => IPlugin)): IPlugin | null;
  destroy(): void;
}
