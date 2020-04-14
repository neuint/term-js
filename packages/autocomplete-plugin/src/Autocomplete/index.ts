import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@term-js/term';

import './theme.scss';

import { DOWN_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE } from '@Autocomplete/constants/keyCodes';
import {
  AUTOCOMPLETE_ACTION,
  AUTOCOMPLETE_DOWN_ACTION,
  AUTOCOMPLETE_UP_ACTION,
} from '@Autocomplete/constants/actions';
import IAutocomplete from '@Autocomplete/IAutocomplete';
import List from '@Autocomplete/List';
import IList from '@Autocomplete/List/IList';

class Autocomplete extends Plugin implements IAutocomplete {
  private activeSuggestions: string[] = [];
  private activeSuggestion: string = '';
  private list?: IList;

  private commandList: string[] = [];
  public get commands(): string[] {
    return this.commandList;
  }
  public set commands(commandList: string[]) {
    this.commandList = commandList;
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_DOWN_ACTION, { code: TAB_KEY_CODE });
    keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_DOWN_ACTION, { code: DOWN_KEY_CODE });
    keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_UP_ACTION, { code: UP_KEY_CODE });
    keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_ACTION, { code: TAB_KEY_CODE });
    keyboardShortcutsManager.addListener(AUTOCOMPLETE_DOWN_ACTION, this.onDown);
    keyboardShortcutsManager.addListener(AUTOCOMPLETE_UP_ACTION, this.onUp);
    keyboardShortcutsManager.addListener(AUTOCOMPLETE_ACTION, this.onAutocomplete);
  }

  public addCommand(command: string) {
    const { commandList } = this;
    if (!commandList.includes(command)) commandList.push(command);
  }

  public removeCommand(command: string) {
    const { commandList } = this;
    const index = commandList.indexOf(command);
    if (index >= 0) commandList.splice(index, 1);
  }

  private onAutocomplete = (action: string, e: Event) => {
    e.preventDefault();
    this.setSuggestions();
    this.showSuggestions();
  }

  private onDown = (action: string, e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }

  private onUp = (action: string, e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }

  private setSuggestions() {
    const { termInfo, commandList } = this;
    if (!termInfo) return [];
    const { caretPosition, editLine } = termInfo;
    if (caretPosition !== editLine.length) return [];
    const activeSuggestions = commandList.filter(command => command.indexOf(editLine) === 0);
    if (activeSuggestions.length) this.activeSuggestion = activeSuggestions[0];
    this.activeSuggestions = activeSuggestions;
  }

  private showSuggestions() {
    const { activeSuggestions } = this;
    return activeSuggestions.length ? this.renderSuggestionsList() : this.hideSuggestionsList();
  }

  private renderSuggestionsList() {
    const { termInfo, activeSuggestions } = this;
    if (!termInfo || !termInfo.elements.edit) return;
    if (!this.list) this.list = new List(termInfo.elements.edit as HTMLElement);
    const { list } = this;
    list.items = activeSuggestions;
    list.value = termInfo.editLine;
  }

  private hideSuggestionsList() {
    const { termInfo, list } = this;
    if (!termInfo || !termInfo.elements.edit || !list) return;
    list.destroy();
    delete this.list;
  }
}

export default Autocomplete;
