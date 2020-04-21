import '@term-js/autocomplete-plugin/dist/index.css';
import { Plugin, ITermInfo, IKeyboardShortcutsManager, ActionShortcutType } from '@term-js/term';
import ICommandSearch from '@CommandSearch/ICommandSearch';
declare class CommandSearch extends Plugin implements ICommandSearch {
    readonly name: string;
    private commandList;
    set commands(list: string[]);
    get commands(): string[];
    private autocomplete?;
    private removeList?;
    private readonly actionShortcut;
    constructor(actionShortcut?: ActionShortcutType);
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    clear(): void;
    destroy(): void;
    private setAutocomplete;
    private setList;
}
export default CommandSearch;
