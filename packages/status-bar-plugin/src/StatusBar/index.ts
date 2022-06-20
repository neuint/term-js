import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@term-js/term';

import './theme.scss';

import IStatusBar from '@StatusBar/IStatusBar';
import StatusView from '@StatusBar/StatusView';
import IStatusView from '@StatusBar/StatusView/IStatusView';
import { PLUGIN_NAME } from '@StatusBar/constants';

class StatusBar extends Plugin implements IStatusBar {
  public readonly name: string = PLUGIN_NAME;

  private text: string = '';
  private icon: string = '';
  private view?: IStatusView;
  public set status(val: { text: string; icon?: string }) {
    const { view } = this;
    this.text = val.text;
    this.icon = val.icon || '';
    if (view) {
      view.icon = this.icon;
      view.text = this.text;
    }
  }
  public get status(): { text: string; icon?: string } {
    const { text, icon } = this;
    return { text, icon };
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.setView();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
    this.setView();
  }

  public destroy() {
    const { view } = this;
    if (view) view.destroy();
    super.destroy();
  }

  private setView() {
    const { termInfo, text, icon, view } = this;
    if (!termInfo) return;
    const { root } = termInfo.elements;
    if (!root || view) return;
    this.view = new StatusView(root as HTMLElement);
    this.view.text = text;
    this.view.icon = icon;
    this.view.render();
  }
}

export default StatusBar;
