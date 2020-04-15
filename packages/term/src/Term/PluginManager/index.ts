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

  public register(name: string, plugin: IPlugin) {
    const { pluginList, termInfo } = this;
    if (this.getPluginIndex(name, plugin) >= 0) return;
    pluginList.push({ name, inst: plugin });
    plugin.setTermInfo(termInfo, this.keyboardShortcutsManager);
  }

  public unregister(name: string) {
    const { pluginList } = this;
    const index = this.getPluginIndex(name);
    if (index < 0) return;
    pluginList.splice(index, 1);
    const item = pluginList[index];
    if (!item) return;
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
}

export default PluginManager;
