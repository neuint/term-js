/* tslint:disable:no-empty */
import IPlugin from './IPlugin';
import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
import { BASE_PLUGIN_NAME } from '@Term/PluginManager/constants';

class Plugin implements IPlugin {
  public readonly name: string = BASE_PLUGIN_NAME;

  protected termInfo?: ITermInfo;
  protected keyboardShortcutsManager?: IKeyboardShortcutsManager;

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

  public clear() {}
}

export default Plugin;
