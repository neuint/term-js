import IPluginManager from '@Term/PluginManager/IPluginManager';
import IPlugin from '@Term/PluginManager/Plugin/IPlugin';
import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
import { isString } from 'lodash-es';

class PluginManager implements IPluginManager {
  private pluginList: { name: string; inst: IPlugin }[] = [];
  private termInfo: ITermInfo;
  private readonly keyboardShortcutsManager: IKeyboardShortcutsManager;

  constructor(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    this.termInfo = termInfo;
    this.keyboardShortcutsManager = keyboardShortcutsManager;
  }

  public updateTermInfo(termInfo: ITermInfo) {
    this.termInfo = termInfo;
    this.pluginList.forEach(({ inst }) => {
      inst.updateTermInfo(termInfo);
    });
  }

  public register(plugin: IPlugin, name?: string) {
    const { pluginList, termInfo } = this;
    const pluginName = name || plugin.name;
    if (this.getPluginIndex(pluginName, plugin) >= 0) return;
    pluginList.push({ name: pluginName, inst: plugin });
    this.clearPlugins();
    plugin.setTermInfo(termInfo, this.keyboardShortcutsManager);
  }

  public unregister(descriptor: string | IPlugin) {
    const { pluginList } = this;
    const index = typeof descriptor === 'string'
      ? this.getPluginIndex(descriptor)
      : this.getPluginIndex(descriptor.name, descriptor);
    if (index < 0) return;
    pluginList.splice(index, 1);
    const item = pluginList[index];
    if (!item) return;
    this.clearPlugins();
    item.inst.destroy();
  }

  public destroy() {
    this.pluginList.forEach(({ inst }) => inst.destroy());
    this.pluginList = [];
  }

  public getPlugin(descriptor: string | (new () => IPlugin)): IPlugin | null {
    const { pluginList } = this;
    return isString(descriptor)
      ? pluginList.find(({ name }): boolean => name === descriptor)?.inst || null
      : pluginList.find(({ inst }): boolean => inst instanceof descriptor)?.inst || null;
  }

  private getPluginIndex(name: string, plugin?: IPlugin): number {
    const { pluginList } = this;
    const nameIndex = pluginList.findIndex(item => item.name === name);
    if (nameIndex >= 0 || !plugin) return nameIndex;
    return pluginList.findIndex(item => item.inst.equal(plugin));
  }

  private clearPlugins() {
    this.pluginList.forEach(({ inst }) => inst.clear());
  }
}

export default PluginManager;
