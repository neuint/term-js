/* tslint:disable:no-empty */
import { v1 as guid } from 'uuid';

import IPlugin from './IPlugin';
import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';

class Plugin implements IPlugin {
  public static readonly guid: string = guid();
  public get guid(): string {
    return Plugin.guid;
  }

  protected termInfo?: ITermInfo;
  protected keyboardShortcutsManager?: IKeyboardShortcutsManager;

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    this.termInfo = termInfo;
    this.keyboardShortcutsManager = keyboardShortcutsManager;
  }

  public updateTermInfo(termInfo: ITermInfo) {
    this.termInfo = termInfo;
  }

  public destroy() {}

  public equal(plugin: IPlugin): boolean {
    return plugin.guid === this.guid;
  }
}

export default Plugin;
