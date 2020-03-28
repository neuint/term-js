import IPluginManager from '@Term/PluginManager/IPluginManager';
import IPlugin from '@Term/PluginManager/Plugin/IPlugin';
import ITermInfo from '@Term/ITermInfo';

class PluginManager implements IPluginManager {
  private pluginList: { name: string; inst: IPlugin }[] = [];
  private termInfo: ITermInfo;

  constructor(termInfo: ITermInfo) {
    this.termInfo = termInfo;
  }

  public updateTermInfo(termInfo: ITermInfo) {
    this.termInfo = termInfo;
    this.pluginList.forEach(({ inst }) => {
      inst.updateTermInfo(termInfo);
    });
  }

  public register(name: string, plugin: IPlugin) {
    const { pluginList, termInfo } = this;
    if (this.getPluginIndex(name) >= 0) return;
    pluginList.push({ name, inst: plugin });
    plugin.setTermInfo(termInfo);
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

  private getPluginIndex(name: string): number {
    const { pluginList } = this;
    return pluginList.findIndex(item => item.name === name);
  }
}

export default PluginManager;
