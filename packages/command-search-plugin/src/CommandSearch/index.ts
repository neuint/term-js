import '@term-js/autocomplete-plugin/dist/index.css';

import { Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType } from '@term-js/term';
import { Autocomplete, IAutocomplete } from '@term-js/autocomplete-plugin';

import icon from './icon.html';

import ICommandSearch from '@CommandSearch/ICommandSearch';
import { PLUGIN_NAME, SHOW_KEY_CODE } from '@CommandSearch/constants';

class CommandSearch extends Plugin implements ICommandSearch {
  public readonly name: string = PLUGIN_NAME;

  private commandList: string[] = [];
  public set commands(list: string[]) {
    this.commandList = list;
    this.setList();
  }
  public get commands(): string[] {
    return this.commandList;
  }

  private autocomplete?: IAutocomplete;
  private removeList?: () => void;
  private readonly actionShortcut: ActionShortcutType = { code: SHOW_KEY_CODE };

  constructor(actionShortcut?: ActionShortcutType) {
    super();
    if (actionShortcut) this.actionShortcut = actionShortcut;
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.setAutocomplete();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
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

  private setList() {
    const { termInfo, removeList, autocomplete } = this;
    if (!termInfo || !autocomplete) return;
    if (removeList) removeList();
    this.removeList = autocomplete.addList(this.commandList, this.actionShortcut, icon);
  }
}

export default CommandSearch;
