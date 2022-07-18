import '@neuint/autocomplete-plugin/dist/index.css';

import {
  Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType, IPluginManager,
} from '@neuint/term-js';
import Autocomplete, { IAutocomplete } from '@neuint/autocomplete-plugin';
import { TAB_KEY_CODE } from '@general/constants/keyCodes';

import icon from './icon.html';

import ICommandSearch from './ICommandSearch';
import { PLUGIN_NAME } from './constants';

export { default as ICommandSearch } from './ICommandSearch';

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

  private autoOpenField = false;

  public set autoOpen(value: boolean) {
    this.autoOpenField = value;
    this.setList();
  }

  public get autoOpen(): boolean {
    return this.autoOpenField;
  }

  private autocomplete?: IAutocomplete;

  private removeList?: () => void;

  private readonly actionShortcut: ActionShortcutType = { code: TAB_KEY_CODE };

  constructor(pluginManager: IPluginManager, actionShortcut?: ActionShortcutType) {
    super(pluginManager);
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

  private setList() {
    const { termInfo, removeList, autocomplete, autoOpen } = this;
    if (!termInfo || !autocomplete) return;
    if (removeList) removeList();
    this.removeList = autoOpen
      ? autocomplete.showList(this.commandList, this.actionShortcut, icon)
      : autocomplete.addList(this.commandList, this.actionShortcut, icon);
  }
}

export default CommandSearch;
