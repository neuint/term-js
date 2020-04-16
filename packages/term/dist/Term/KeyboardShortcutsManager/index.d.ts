import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';
import { ActionShortcutType } from '@Term/KeyboardShortcutsManager/types';
declare class KeyboardShortcutsManager implements IKeyboardShortcutsManager {
    private static checkShortcutsEqual;
    private static getNormalizedShortcut;
    private emitter?;
    private shortcutsMapField;
    get shortcutsMap(): {
        [action: string]: ActionShortcutType | ActionShortcutType[];
    };
    private listeners;
    private actionHandler?;
    private readonly unlockKey;
    private isLock;
    private lockWhiteList;
    constructor(params?: {
        onAction?: (action: string, e: Event) => void;
    }, unlockKey?: string);
    addListener(action: string, callback: (action: string, e: Event) => void | boolean): void;
    removeListener(callback: (action: string, e: Event) => void | boolean): void;
    addShortcut(action: string, shortcut: ActionShortcutType): void;
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
