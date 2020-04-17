import { IPlugin, ActionShortcutType } from '@term-js/term';

export default interface IAutocomplete extends IPlugin {
  addList(items: string[], actionShortcut: ActionShortcutType, icon?: string): () => void;
  removeList(uuid: string): void;
}
