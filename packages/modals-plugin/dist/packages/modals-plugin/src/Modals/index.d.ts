import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import './theme.scss';
import IModals from './IModals';
import { ModalOptionsType } from './types';
declare class Modals extends Plugin implements IModals {
    readonly name: string;
    private modalStack;
    private unlockCallback?;
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    updateTermInfo(termInfo: ITermInfo): void;
    clear(): void;
    destroy(): void;
    show(options: ModalOptionsType): () => void;
    hide(uuid: string): void;
    private hideLast;
    private updatePosition;
}
export default Modals;
