import ITermInfo from '../../_interfaces/ITermInfo';
import IKeyboardShortcutsManager from '../../KeyboardShortcutsManager/IKeyboardShortcutsManager';
import { BASE_PLUGIN_NAME } from '../constants';
import IPlugin from './IPlugin';
import IPluginManager from '../IPluginManager';

abstract class Plugin implements IPlugin {
  public readonly name: string = BASE_PLUGIN_NAME;

  protected termInfo?: ITermInfo;

  protected keyboardShortcutsManager?: IKeyboardShortcutsManager;

  protected pluginManager: IPluginManager;

  constructor(pluginManager: IPluginManager) {
    this.pluginManager = pluginManager;
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    this.termInfo = termInfo;
    this.keyboardShortcutsManager = keyboardShortcutsManager;
  }

  public updateTermInfo(termInfo: ITermInfo) {
    this.termInfo = termInfo;
  }

  public destroy() {
    this.clear();
  }

  public equal(plugin: IPlugin): boolean {
    return plugin.name === this.name;
  }

  public abstract clear();
}

export default Plugin;
