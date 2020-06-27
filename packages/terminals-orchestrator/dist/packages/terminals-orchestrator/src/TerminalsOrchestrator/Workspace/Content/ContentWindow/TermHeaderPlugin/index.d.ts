import { IKeyboardShortcutsManager, ITermInfo, Plugin } from '@term-js/term';
import ITermHeaderPlugin from './ITermHeaderPlugin';
import { OptionsType } from './types';
declare class TermHeaderPlugin extends Plugin implements ITermHeaderPlugin {
    private termHeader?;
    private options;
    constructor(options: OptionsType);
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    destroy(): void;
    private addListeners;
    private removeListeners;
    private addTermHeader;
    private onStartRenaming;
    private onRename;
}
export default TermHeaderPlugin;
