import { Plugin, ITermInfo, IKeyboardShortcutsManager, IPluginManager } from '@neuint/term-js';
import ContextMenu, {
  IContextMenu, END_OF_LINE_TYPE, CLOSE_ACTION,
} from '@neuint/context-menu-plugin';
import '@neuint/context-menu-plugin/dist/index.css';

import './theme.scss';

import IDropdown from './IDropdown';
import IList from './List/IList';
import List from './List';
import { NEXT_ACTION, DOWN_ACTION, UP_ACTION, SUBMIT_ACTION } from './constants/actions';
import {
  DOWN_KEY_CODE,
  ENTER_KEY_CODE,
  TAB_KEY_CODE,
  UP_KEY_CODE,
} from './constants/keyCodes';
import { PLUGIN_NAME } from './constants/general';

export { default as IDropdown } from './IDropdown';

class Dropdown extends Plugin implements IDropdown {
  public readonly name: string = PLUGIN_NAME;

  public isActionsLock = false;

  private itemsList: string[] = [];

  public get items(): string[] {
    return this.itemsList;
  }

  public set items(val: string[]) {
    const { itemsList, append, container } = this;
    if (itemsList.length !== val.length || itemsList.some((item, i) => item !== val[i])) {
      this.itemsList = val;
      this.renderList({ append, className: container.className });
    }
  }

  private highlightField = '';

  public get highlight(): string {
    return this.highlightField;
  }

  public set highlight(val: string) {
    const { append, container } = this;
    if (val !== this.highlightField) {
      this.highlightField = val;
      this.renderList({ append, className: container.className });
    }
  }

  private list?: IList;

  private contextMenuPlugin?: IContextMenu;

  private unlockCallback?: () => void;

  private isActive = false;

  private onSelect?: (text: string, index: number) => void;

  private onClose?: () => void;

  private readonly container: HTMLElement;

  private append?: HTMLElement;

  constructor(pluginManager: IPluginManager) {
    super(pluginManager);
    this.container = document.createElement('div');
  }

  public setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.registerShortcut();
    this.setContextMenuPlugin();
  }

  public updateTermInfo(termInfo: ITermInfo) {
    super.updateTermInfo(termInfo);
  }

  public clear() {
    this.hideList();
    delete this.onSelect;
    delete this.onClose;
  }

  public destroy() {
    this.clear();
    this.unregisterShortcut();
    super.destroy();
  }

  public show(
    items: string[] = [],
    params: {
      className?: string;
      append?: string | HTMLElement;
      onSelect?: (text: string, index: number) => void;
      onClose?: () => void
    } = {},
  ) {
    if (items) this.itemsList = items;
    const { itemsList } = this;
    const { onSelect, onClose } = params;
    if (itemsList.length) {
      this.onSelect = onSelect;
      this.onClose = onClose;
      this.isActive = true;
      this.renderList(params);
    } else {
      this.clear();
      if (onClose) onClose();
    }
  }

  public hide() {
    this.clear();
  }

  private unregisterShortcut() {
    const { keyboardShortcutsManager } = this;
    if (keyboardShortcutsManager) {
      keyboardShortcutsManager.removeShortcut(NEXT_ACTION);
      keyboardShortcutsManager.removeShortcut(DOWN_ACTION);
      keyboardShortcutsManager.removeShortcut(UP_ACTION);
      keyboardShortcutsManager.removeShortcut(SUBMIT_ACTION);
    }
  }

  private registerShortcut() {
    const { keyboardShortcutsManager } = this;
    if (keyboardShortcutsManager) {
      keyboardShortcutsManager.addShortcut(NEXT_ACTION, { code: TAB_KEY_CODE });
      keyboardShortcutsManager.addShortcut(DOWN_ACTION, { code: DOWN_KEY_CODE });
      keyboardShortcutsManager.addShortcut(UP_ACTION, { code: UP_KEY_CODE });
      keyboardShortcutsManager.addShortcut(SUBMIT_ACTION, { code: ENTER_KEY_CODE });
      keyboardShortcutsManager.addListener(NEXT_ACTION, this.onNext);
      keyboardShortcutsManager.addListener(DOWN_ACTION, this.onDown);
      keyboardShortcutsManager.addListener(UP_ACTION, this.onUp);
      keyboardShortcutsManager.addListener(SUBMIT_ACTION, this.onSubmit);
    }
  }

  private setContextMenuPlugin() {
    const { termInfo } = this;
    if (!termInfo) return;
    const contextMenuPlugin = this.pluginManager.getPlugin(ContextMenu);
    if (contextMenuPlugin) {
      this.contextMenuPlugin = contextMenuPlugin as IContextMenu;
    } else {
      this.contextMenuPlugin = new ContextMenu();
      this.pluginManager.register(this.contextMenuPlugin);
    }
  }

  private onNext = (action: string, e: Event) => {
    const { isActive, list, isActionsLock } = this;
    if (isActive && list && !isActionsLock) {
      e.stopPropagation();
      e.preventDefault();
      const nextIndex = list.index + 1;
      list.index = nextIndex >= list.items.length ? 0 : nextIndex;
    }
  };

  private onDown = (action: string, e: Event) => {
    const { isActive, list, isActionsLock } = this;
    if (isActive && list && !isActionsLock) {
      e.stopPropagation();
      e.preventDefault();
      list.index = Math.min(list.index + 1, list.items.length - 1);
    }
  };

  private onUp = (action: string, e: Event) => {
    const { isActive, list, isActionsLock } = this;
    if (isActive && list && !isActionsLock) {
      e.stopPropagation();
      e.preventDefault();
      list.index = Math.max(list.index - 1, 0);
    }
  };

  private onSubmit = (action: string, e: Event) => {
    const { onSelect, isActive, list } = this;
    if (isActive && list) {
      e.stopPropagation();
      e.preventDefault();
      if (onSelect) onSelect(list.items[list.index], list.index);
    }
    this.clear();
  };

  private renderList(params: { className?: string; append?: string | HTMLElement }) {
    const {
      contextMenuPlugin, container, itemsList, keyboardShortcutsManager, unlockCallback,
      highlightField,
    } = this;
    const { className = '', append } = params;
    if (!contextMenuPlugin || !keyboardShortcutsManager) return;
    container.className = className;
    if (!this.list) this.list = new List(container, this.selectHandler);
    this.renderAppend(append);
    if (!unlockCallback) {
      this.unlockCallback = keyboardShortcutsManager.lock([
        NEXT_ACTION, DOWN_ACTION, UP_ACTION, SUBMIT_ACTION, CLOSE_ACTION,
      ]);
    }
    const list = this.list as IList;
    list.items = itemsList;
    list.value = highlightField.trim();
    this.isActive = false;
    contextMenuPlugin.show(container, END_OF_LINE_TYPE, {
      escHide: true, aroundClickHide: true, onHide: this.hideContextMenuHandler,
    });
    this.isActive = true;
  }

  private renderAppend(append?: string | HTMLElement) {
    const { container } = this;
    this.clearAppend();
    if (!append) return;
    if (typeof append === 'string') {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = append.replace(/^[\n\t\s]+/, '');
      const appendNode = tempContainer.firstChild;
      if (!appendNode) return;
      container.appendChild(appendNode);
      this.append = appendNode as HTMLElement;
    } else {
      container.appendChild(append);
      this.append = append;
    }
  }

  private clearAppend() {
    const { container, append } = this;
    if (append) container.removeChild(append);
    delete this.append;
  }

  private selectHandler = (text: string, index: number) => {
    const { onSelect } = this;
    this.hide();
    if (onSelect) onSelect(text, index);
  };

  private hideContextMenuHandler = () => {
    const { isActive } = this;
    if (isActive) this.clear();
  };

  private hideList() {
    const { list, unlockCallback, contextMenuPlugin, onClose } = this;
    this.clearAppend();
    this.isActive = false;
    if (unlockCallback) {
      unlockCallback();
      delete this.unlockCallback;
    }
    if (list) {
      list.destroy();
      delete this.list;
    }
    contextMenuPlugin?.hide();
    if (onClose) onClose();
  }
}

export default Dropdown;
