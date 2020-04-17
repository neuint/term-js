import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
import { ActionShortcutType, CallbackInfoType } from '@Term/KeyboardShortcutsManager/types';
import { InfoType } from '@Term/types';
declare class KeyboardShortcutsManager implements IKeyboardShortcutsManager {
    private static checkShortcutsEqual;
    private static getNormalizedShortcut;
    private emitter?;
    private shortcutsMapField;
    private listeners;
    private actionHandler?;
    private readonly unlockKey;
    private isLock;
    private lockWhiteList;
    constructor(params?: {
        onAction?: (action: string, e: Event) => void;
    }, unlockKey?: string);
    addListener(action: string, callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean, info?: InfoType): void;
    removeListener(callback: (action: string, e: Event, info?: CallbackInfoType) => void | boolean): void;
    addShortcut(action: string, shortcut: ActionShortcutType, info?: InfoType): void;
    removeShortcut(action: string, shortcut?: ActionShortcutType): boolean | undefined;
    activate(): void;
    deactivate(): void;
    destroy(): void;
    lock(whiteList?: string[]): (() => void) | undefined;
    unlock(key: string): void;
    private getShortcutIndex;
    private addListeners;
}
export default KeyboardShortcutsManager;
