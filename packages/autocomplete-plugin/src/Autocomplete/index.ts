import { v1 as uuid } from 'uuid';
import {
  Plugin,
  ITermInfo,
  IKeyboardShortcutsManager,
  ActionShortcutType,
  InfoType,
} from '@term-js/term';
import { Dropdown, IDropdown } from '@term-js/dropdown-plugin';
import '@term-js/dropdown-plugin/dist/index.css';

import './theme.scss';
import css from './index.scss';

import { PLUGIN_NAME, SHOW_ACTION } from '@Autocomplete/constants';
import IAutocomplete from '@Autocomplete/IAutocomplete';
import { ListInfoType } from '@Autocomplete/types';

class Autocomplete extends Plugin implements IAutocomplete {
  public readonly name: string = PLUGIN_NAME;
  private listsInfo: ListInfoType[] = [];
  private activeSuggestions: string[] = [];
  private dropdownPlugin?: IDropdown;

  private commandList: string[] = [];
  private active: string = '';
  private isSetShowHandler: boolean = false;

  public addList(items: string[], actionShortcut: ActionShortcutType, icon?: string) {
    const info: ListInfoType = {
      icon, items, actionShortcut, isRegistered: false, uuid: uuid(),
    };
    this.listsInfo.push(info);
    this.registerShortcut(info);
    return () => this.removeList(info.uuid);
  }

  public removeList(uuidValue: string) {
    const { listsInfo, keyboardShortcutsManager } = this;
    const index = listsInfo.findIndex(item => item.uuid === uuidValue);
    if (index < 0) return;
    const listInfo = listsInfo[index];
    listsInfo.splice(index, 1);
    if (keyboardShortcutsManager) {
      keyboardShortcutsManager.removeShortcut(SHOW_ACTION, listInfo.actionShortcut);
    }
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.registerShortcut();
    this.setDropdownPlugin();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    const { termInfo: termInfoPrev, active } = this;
    const prevValue = termInfoPrev?.edit.value;
    const currentValue = termInfo.edit.value;
    super.updateTermInfo(termInfo);
    if (active && currentValue && prevValue !== currentValue) {
      this.setSuggestions();
      this.showSuggestions();
    } else if (active && !currentValue) {
      this.clear();
    }
  }

  public clear() {
    this.hideSuggestionsList();
    this.active = '';
    super.clear();
  }

  public destroy() {
    this.unregisterShortcut();
    this.dropdownPlugin?.hide();
    super.destroy();
  }

  private unregisterShortcut() {
    const { keyboardShortcutsManager } = this;
    if (keyboardShortcutsManager) keyboardShortcutsManager.removeShortcut(SHOW_ACTION);
  }

  private registerShortcut(info?: ListInfoType) {
    const { keyboardShortcutsManager, listsInfo, isSetShowHandler } = this;
    if (!keyboardShortcutsManager || (info && info.isRegistered)) return;
    if (info) {
      keyboardShortcutsManager.addShortcut(SHOW_ACTION, info.actionShortcut, info.uuid);
      info.isRegistered = true;
    } else {
      listsInfo.forEach(item => this.registerShortcut(item));
    }
    if (!isSetShowHandler) {
      keyboardShortcutsManager.addListener(SHOW_ACTION, this.onAutocomplete);
      this.isSetShowHandler = true;
    }
  }

  private setDropdownPlugin() {
    const { termInfo } = this;
    if (!termInfo) return;
    const dropdownPlugin = termInfo.pluginManager.getPlugin(Dropdown);
    if (dropdownPlugin) {
      this.dropdownPlugin = dropdownPlugin as IDropdown;
    } else {
      this.dropdownPlugin = new Dropdown();
      termInfo.pluginManager.register(this.dropdownPlugin);
    }
  }

  private onAutocomplete = (action: string, e: Event, info?: { shortcut?: InfoType }) => {
    const { dropdownPlugin, listsInfo, active } = this;
    const infoUuid = info?.shortcut;
    if (!infoUuid || (active && active !== infoUuid)) return;
    this.commandList = listsInfo.find(item => item.uuid === infoUuid)?.items || [];
    e.preventDefault();
    if (dropdownPlugin && this.setSuggestions()) {
      this.active = infoUuid as string;
      dropdownPlugin.isActionsLock = true;
      this.showSuggestions();
      setTimeout(() => dropdownPlugin.isActionsLock = false, 0);
    }
  }

  private setSuggestions(): boolean {
    const { termInfo, commandList } = this;
    if (!termInfo) return this.setNewSuggestions([]);
    const { caret: { position }, edit: { value } } = termInfo;
    return this.setNewSuggestions(position !== value.length
      ? []
      : commandList
        .filter(command => command.indexOf(value) === 0 && command !== value));
  }

  private setNewSuggestions(newActiveSuggestions: string[]): boolean {
    const { activeSuggestions } = this;
    this.activeSuggestions = newActiveSuggestions;
    return activeSuggestions.length !== newActiveSuggestions.length
      || newActiveSuggestions.some((item, i) => item !== activeSuggestions[i]);
  }

  private showSuggestions() {
    const { activeSuggestions } = this;
    if (activeSuggestions.length) {
      this.renderSuggestionsList();
    } else {
      this.clear();
    }
  }

  private renderSuggestionsList() {
    const { dropdownPlugin, activeSuggestions, termInfo, active, listsInfo } = this;
    const value = termInfo?.edit.value;
    if (!dropdownPlugin || !value) return;
    const icon = listsInfo.find(item => item.uuid === active)?.icon;
    dropdownPlugin.show(activeSuggestions, {
      onSelect: this.onSelect,
      onClose: this.onClose,
      append: icon,
      className: icon ? css.withIcon : '',
    });
    dropdownPlugin.highlight = value.trim();
  }

  private hideSuggestionsList() {
    const { dropdownPlugin } = this;
    if (dropdownPlugin) dropdownPlugin.hide();
    this.activeSuggestions = [];
  }

  private onSelect = (text: string) => {
    const { termInfo } = this;
    if (termInfo) {
      const { edit } = termInfo;
      edit.focus();
      edit.write(text.replace(edit.value, ''));
    }
    this.clear();
  }

  private onClose = () => {
    this.activeSuggestions = [];
    this.active = '';
  }
}

export default Autocomplete;
