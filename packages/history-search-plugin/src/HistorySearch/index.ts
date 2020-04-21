import { uniq } from 'lodash-es';

import '@term-js/autocomplete-plugin/dist/index.css';

import { Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType } from '@term-js/term';
import { Autocomplete, IAutocomplete } from '@term-js/autocomplete-plugin';

import icon from './icon.html';

import IHistorySearch from '@HistorySearch/IHistorySearch';
import { PLUGIN_NAME, HISTORY_KEY_CODE, IS_MAC } from '@HistorySearch/constants';

class HistorySearch extends Plugin implements IHistorySearch {
  public readonly name: string = PLUGIN_NAME;

  private autocomplete?: IAutocomplete;
  private removeList?: () => void;
  private history: string[] = [];
  private readonly actionShortcut: ActionShortcutType = {
    code: HISTORY_KEY_CODE, meta: IS_MAC, ctrl: !IS_MAC,
  };

  constructor(actionShortcut?: ActionShortcutType) {
    super();
    if (actionShortcut) this.actionShortcut = actionShortcut;
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.setAutocomplete();
    this.setHistoryList();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
    this.setHistoryList();
  }

  public clear() {
    const { autocomplete } = this;
    if (autocomplete) autocomplete.clear();
    super.clear();
  }

  public destroy() {
    this.clear();
    super.destroy();
  }

  private setAutocomplete() {
    const { termInfo } = this;
    if (!termInfo) return;
    const autocomplete = termInfo.pluginManager.getPlugin(Autocomplete);
    if (autocomplete) return this.autocomplete = autocomplete as IAutocomplete;
    this.autocomplete = new Autocomplete();
    termInfo.pluginManager.register(this.autocomplete);
  }

  private setHistoryList() {
    const { termInfo, removeList, autocomplete } = this;
    if (!termInfo || !autocomplete) return;
    if (this.checkUpdateHistoryList()) {
      if (removeList) removeList();
      this.removeList = autocomplete.addList(this.history, this.actionShortcut, icon);
    }
  }

  private checkUpdateHistoryList(): boolean {
    const { history } = this;
    const newHistory = uniq(this.termInfo?.history || []);
    const isUpdated = newHistory.length && (history.length !== newHistory.length
      || newHistory.some((item, i) => item !== history[i]));
    if (isUpdated) {
      this.history = newHistory;
      return true;
    }
    return false;
  }
}

export default HistorySearch;
