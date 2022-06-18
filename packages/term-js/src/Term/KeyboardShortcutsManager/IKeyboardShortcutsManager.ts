import { ActionShortcutType, CallbackInfoType } from './types';
import { InfoType } from '../types';

export default interface IKeyboardShortcutsManager {
  layer: number;
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
