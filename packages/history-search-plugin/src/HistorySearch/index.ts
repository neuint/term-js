import { uniq } from 'lodash-es';

import '@neuint/autocomplete-plugin/dist/index.css';

import { Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType, IPluginManager } from '@neuint/term-js';
import Autocomplete, { IAutocomplete } from '@neuint/autocomplete-plugin';

import icon from './icon.html';

import IHistorySearch from './IHistorySearch';
import { PLUGIN_NAME, HISTORY_KEY_CODE, IS_MAC } from './constants';

export type { default as IHistorySearch } from './IHistorySearch';

class HistorySearch extends Plugin implements IHistorySearch {
  public readonly name: string = PLUGIN_NAME;

  private autocomplete?: IAutocomplete;

  private removeList?: () => void;

  private history: string[] = [];

  private readonly actionShortcut: ActionShortcutType = {
    code: HISTORY_KEY_CODE, meta: IS_MAC, ctrl: !IS_MAC,
  };

  constructor(pluginManager: IPluginManager, actionShortcut?: ActionShortcutType) {
    super(pluginManager);
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
  }

  public destroy() {
    this.clear();
    super.destroy();
  }

  private setAutocomplete() {
    const { termInfo } = this;
    if (!termInfo) return;
    const autocomplete = this.pluginManager.getPlugin(Autocomplete);
    if (autocomplete) {
      this.autocomplete = autocomplete as IAutocomplete;
    } else {
      this.autocomplete = new Autocomplete(this.pluginManager);
      this.pluginManager.register(this.autocomplete);
    }
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
