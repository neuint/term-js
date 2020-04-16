import { ActionShortcutType } from '@Term/KeyboardShortcutsManager/types';

export default interface IKeyboardShortcutsManager {
  shortcutsMap: {
    [action: string]: ActionShortcutType | ActionShortcutType[];
  };

  activate(): void;
  deactivate(): void;
  addShortcut(action: string, shortcut: ActionShortcutType): void;
  removeShortcut(action: string, shortcut?: ActionShortcutType): void;
  destroy(): void;
  addListener(action: string, callback: (action: string, e: Event) => void | boolean): void;
  removeListener(callback: (action: string, e: Event) => void | boolean): void;
  lock(whiteList?: string[]): (() => void) | undefined;
  unlock(key: string): void;
}
