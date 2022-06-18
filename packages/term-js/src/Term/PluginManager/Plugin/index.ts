/* tslint:disable:no-empty */
import ITermInfo from '../../_interfaces/ITermInfo';
import IKeyboardShortcutsManager from '../../KeyboardShortcutsManager/IKeyboardShortcutsManager';
import { BASE_PLUGIN_NAME } from '../constants';
import IPlugin from './IPlugin';

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
