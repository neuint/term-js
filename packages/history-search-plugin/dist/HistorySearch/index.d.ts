import '@neuint/autocomplete-plugin/dist/index.css';
import { Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType, IPluginManager } from '@neuint/term-js';
import IHistorySearch from './IHistorySearch';
export type { default as IHistorySearch } from './IHistorySearch';
declare class HistorySearch extends Plugin implements IHistorySearch {
    readonly name: string;
    private autocomplete?;
    private removeList?;
    private history;
    private readonly actionShortcut;
    constructor(pluginManager: IPluginManager, actionShortcut?: ActionShortcutType);
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    clear(): void;
    destroy(): void;
    private setAutocomplete;
    private setHistoryList;
    private checkUpdateHistoryList;
}
export default HistorySearch;
