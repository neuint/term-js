import { ActionShortcutType } from '@Term/KeyboardShortcutsManager/types';

export default interface KeyboardShortcutsManager {
  shortcutsMap: {
    [action: string]: ActionShortcutType | ActionShortcutType[];
  };

  activate(): void;
  deactivate(): void;
  addShortcut(action: string, shortcut: ActionShortcutType): void;
  removeShortcut(action: string, shortcut?: ActionShortcutType): void;
  destroy(): void;
  addListener(action: string, callback: (action: string, e: Event) => void): void;
  removeListener(callback: (action: string, e: Event) => void): void;
}
