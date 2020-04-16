import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@term-js/term';
import { ContextMenu, IContextMenu, END_OF_LINE_TYPE } from '@term-js/context-menu-plugin';
import '@term-js/context-menu-plugin/dist/index.css';

import './theme.scss';

import {
  DOWN_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE, ENTER_KEY_CODE,
} from '@Autocomplete/constants/keyCodes';
import {
  AUTOCOMPLETE_ACTION,
  AUTOCOMPLETE_NEXT_ACTION,
  AUTOCOMPLETE_DOWN_ACTION,
  AUTOCOMPLETE_UP_ACTION,
  AUTOCOMPLETE_SUBMIT_ACTION,
} from '@Autocomplete/constants/actions';
import IAutocomplete from '@Autocomplete/IAutocomplete';
import List from '@Autocomplete/List';
import IList from '@Autocomplete/List/IList';

class Autocomplete extends Plugin implements IAutocomplete {
  private activeSuggestions: string[] = [];
  private activeSuggestion: string = '';
  private list?: IList;
  private contextMenuPlugin?: IContextMenu;
  private unlockCallback?: () => void;
  private isActive: boolean = false;
  private readonly container: HTMLElement;

  private commandList: string[] = [];
  public get commands(): string[] {
    return this.commandList;
  }
  public set commands(commandList: string[]) {
    this.commandList = commandList;
  }

  constructor() {
    super();
    this.container = document.createElement('div');
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.registerShortcut();
    this.setContextMenuPlugin();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    const { isActive, termInfo: termInfoPrev } = this;
    const prevValue = termInfoPrev?.edit.value;
    const currentValue = termInfo.edit.value;
    super.updateTermInfo(termInfo);
    if (currentValue && prevValue !== currentValue && isActive) {
      this.setSuggestions();
      this.showSuggestions();
    } else if (isActive && !currentValue) {
      this.clear();
    }
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

  public clear(): void {
    this.hideSuggestionsList();
    this.activeSuggestions = [];
    this.activeSuggestion = '';
    this.isActive = false;
    this.contextMenuPlugin?.hide();
    super.clear();
  }

  public destroy() {
    this.unregisterShortcut();
    super.destroy();
  }

  private unregisterShortcut() {
    const { keyboardShortcutsManager } = this;
    if (keyboardShortcutsManager) {
      keyboardShortcutsManager.removeShortcut(AUTOCOMPLETE_NEXT_ACTION);
      keyboardShortcutsManager.removeShortcut(AUTOCOMPLETE_DOWN_ACTION);
      keyboardShortcutsManager.removeShortcut(AUTOCOMPLETE_UP_ACTION);
      keyboardShortcutsManager.removeShortcut(AUTOCOMPLETE_SUBMIT_ACTION);
      keyboardShortcutsManager.removeShortcut(AUTOCOMPLETE_ACTION);
    }
  }

  private registerShortcut() {
    const { keyboardShortcutsManager } = this;
    if (keyboardShortcutsManager) {
      keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_NEXT_ACTION, { code: TAB_KEY_CODE });
      keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_DOWN_ACTION, { code: DOWN_KEY_CODE });
      keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_UP_ACTION, { code: UP_KEY_CODE });
      keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_SUBMIT_ACTION, { code: ENTER_KEY_CODE });
      keyboardShortcutsManager.addShortcut(AUTOCOMPLETE_ACTION, { code: TAB_KEY_CODE });
      keyboardShortcutsManager.addListener(AUTOCOMPLETE_NEXT_ACTION, this.onNext);
      keyboardShortcutsManager.addListener(AUTOCOMPLETE_DOWN_ACTION, this.onDown);
      keyboardShortcutsManager.addListener(AUTOCOMPLETE_UP_ACTION, this.onUp);
      keyboardShortcutsManager.addListener(AUTOCOMPLETE_SUBMIT_ACTION, this.onSubmit);
      keyboardShortcutsManager.addListener(AUTOCOMPLETE_ACTION, this.onAutocomplete);
    }
  }

  private setContextMenuPlugin() {
    const { termInfo } = this;
    if (!termInfo) return;
    const contextMenuPlugin = termInfo.pluginManager.getPlugin(ContextMenu);
    if (contextMenuPlugin) {
      this.contextMenuPlugin = contextMenuPlugin as IContextMenu;
    } else {
      this.contextMenuPlugin = new ContextMenu();
      termInfo.pluginManager.register(this.contextMenuPlugin);
    }
  }

  private onAutocomplete = (action: string, e: Event) => {
    if (!this.isActive) {
      e.preventDefault();
      this.setSuggestions();
      this.showSuggestions();
    }
  }

  private onNext = (action: string, e: Event) => {
    const { isActive, list } = this;
    if (isActive && list) {
      e.stopPropagation();
      e.preventDefault();
      const nextIndex = list.index + 1;
      list.index = nextIndex >= list.items.length ? 0 : nextIndex;
    }
  }

  private onDown = (action: string, e: Event) => {
    const { isActive, list } = this;
    if (isActive && list) {
      e.stopPropagation();
      e.preventDefault();
      list.index = Math.min(list.index + 1, list.items.length - 1);
    }
  }

  private onUp = (action: string, e: Event) => {
    const { isActive, list } = this;
    if (isActive && list) {
      e.stopPropagation();
      e.preventDefault();
      list.index = Math.max(list.index - 1, 0);
    }
  }

  private setSuggestions() {
    const { termInfo, commandList } = this;
    if (!termInfo) return [];
    const { caret: { position }, edit: { value } } = termInfo;
    if (position !== value.length) return [];
    const activeSuggestions = commandList
      .filter(command => command.indexOf(value) === 0 && command !== value);
    if (activeSuggestions.length) this.activeSuggestion = activeSuggestions[0];
    this.activeSuggestions = activeSuggestions;
  }

  private showSuggestions() {
    const { activeSuggestions } = this;
    if (activeSuggestions.length) {
      this.isActive = true;
      this.renderSuggestionsList();
    } else {
      this.clear();
    }
  }

  private renderSuggestionsList() {
    const {
      contextMenuPlugin, container, activeSuggestions, keyboardShortcutsManager, unlockCallback,
      termInfo,
    } = this;
    const value = termInfo?.edit.value;
    if (!contextMenuPlugin || !keyboardShortcutsManager || !value) return;
    if (!this.list) this.list = new List(container, this.onSelect);
    if (!unlockCallback) {
      this.unlockCallback = keyboardShortcutsManager.lock([
        AUTOCOMPLETE_NEXT_ACTION,
        AUTOCOMPLETE_DOWN_ACTION,
        AUTOCOMPLETE_UP_ACTION,
        AUTOCOMPLETE_SUBMIT_ACTION,
      ]);
    }
    const list = this.list as IList;
    list.items = activeSuggestions;
    list.value = value.trim();
    contextMenuPlugin.show(container, END_OF_LINE_TYPE, {
      escHide: true, aroundClickHide: true, onHide: this.onHideContextMenu,
    });
  }

  private hideSuggestionsList() {
    const { list, unlockCallback } = this;
    if (unlockCallback) {
      unlockCallback();
      delete this.unlockCallback;
    }
    if (list) {
      list.destroy();
      delete this.list;
    }
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

  private onSubmit = (action: string, e: Event) => {
    const { termInfo, isActive, list } = this;
    if (termInfo && isActive && list) {
      e.stopPropagation();
      e.preventDefault();
      const { edit } = termInfo;
      const text = list.items[list.index];
      edit.focus();
      edit.write(text.replace(edit.value, ''));
    }
    this.clear();
  }

  private onHideContextMenu = () => {
    const { isActive } = this;
    if (isActive) this.clear();
  }
}

export default Autocomplete;
