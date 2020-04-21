import '@term-js/autocomplete-plugin/dist/index.css';
import { Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType } from '@term-js/term';
import IHistorySearch from '@HistorySearch/IHistorySearch';
declare class HistorySearch extends Plugin implements IHistorySearch {
    readonly name: string;
    private autocomplete?;
    private removeList?;
    private history;
    private readonly actionShortcut;
    constructor(actionShortcut?: ActionShortcutType);
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    clear(): void;
    destroy(): void;
    private setAutocomplete;
    private setHistoryList;
    private checkUpdateHistoryList;
}
export default HistorySearch;
