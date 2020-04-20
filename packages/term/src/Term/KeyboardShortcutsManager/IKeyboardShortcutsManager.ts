import { ActionShortcutType, CallbackInfoType } from '@Term/KeyboardShortcutsManager/types';
import { InfoType } from '@Term/types';

export default interface IKeyboardShortcutsManager {
  activate(): void;
  deactivate(): void;
  addShortcut(action: string, shortcut: ActionShortcutType, info?: InfoType): void;
  removeShortcut(action: string, shortcut?: ActionShortcutType): void;
  destroy(): void;
  addListener(
    action: string,
    callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean,
    info?: InfoType,
  ): void;
  removeListener(
    callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean,
  ): void;
  lock(whiteList?: string[]): (() => void) | undefined;
  unlock(key: string): void;
}
