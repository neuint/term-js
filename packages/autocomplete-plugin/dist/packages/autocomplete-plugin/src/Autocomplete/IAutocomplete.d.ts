import { IPlugin, ActionShortcutType } from '@neuint/term-js';
export default interface IAutocomplete extends IPlugin {
    addList(items: string[], actionShortcut: ActionShortcutType, icon?: string): () => void;
    showList(items: string[], actionShortcut: ActionShortcutType, icon?: string): () => void;
    removeList(uuid: string): void;
}
