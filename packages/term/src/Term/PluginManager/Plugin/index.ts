/* tslint:disable:no-empty */

import IPlugin from './IPlugin';
import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';

class Plugin implements IPlugin {
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
}

export default Plugin;
