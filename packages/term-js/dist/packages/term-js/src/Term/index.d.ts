import './index.scss';
import TemplateEngine from './TemplateEngine';
import { EditLineParamsType, FormattedValueFragmentType, TermConstructorParamsType, ValueType } from './types';
import ITerm from './ITerm';
import ITermEventMap from './_interfaces/ITermEventMap';
import IKeyboardShortcutsManager from './KeyboardShortcutsManager/IKeyboardShortcutsManager';
import IPluginManager from './PluginManager/IPluginManager';
export { default as ITerm } from './ITerm';
export { default as ITermInfo } from './_interfaces/ITermInfo';
export { default as KeyboardShortcutsManager } from './KeyboardShortcutsManager';
export { default as IKeyboardShortcutsManager } from './KeyboardShortcutsManager/IKeyboardShortcutsManager';
export { ActionShortcutType } from './KeyboardShortcutsManager/types';
export { TermConstructorParamsType, ValueType, InfoType, FormattedValueType, ValueFragmentType, FormattedValueFragmentType, } from './types';
export { default as IPluginManager } from './PluginManager/IPluginManager';
export { default as Plugin } from './PluginManager/Plugin';
export { default as IPlugin } from './PluginManager/Plugin/IPlugin';
export { default as TemplateEngine } from './TemplateEngine';
export { default as ITemplateEngine } from './TemplateEngine/ITemplateEngine';
declare class Term extends TemplateEngine implements ITerm {
    private static processParams;
    private isDisabled;
    get disabled(): boolean;
    set disabled(val: boolean);
    get secret(): boolean;
    set secret(value: boolean);
    private headerField;
    get header(): string;
    set header(val: string);
    get value(): ValueType;
    set value(val: ValueType);
    private readonly ro;
    private readonly vl;
    readonly keyboardShortcutsManager: IKeyboardShortcutsManager;
    readonly pluginManager: IPluginManager;
    private history;
    private params;
    private isEditing;
    private writingInterval?;
    private submitTimeout?;
    private itemSize;
    private heightCache;
    private lines;
    private editLine?;
    private skipHandler;
    private listeners;
    constructor(container: Element, params?: TermConstructorParamsType);
    addEventListener: <K extends keyof ITermEventMap>(type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions) => void;
    removeEventListener: <K extends keyof ITermEventMap>(type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions) => void;
    destroy(): void;
    setLabel: (params?: {
        label?: string;
        delimiter?: string;
    }) => void;
    write: (data: string | FormattedValueFragmentType, options?: {
        withSubmit?: boolean;
        duration?: number;
        skipHandler?: boolean;
    }) => Promise<boolean> | boolean;
    setCaret(caret: string): void;
    setHeader(text: string): void;
    blur(): void;
    private updateEditLine;
    private init;
    private preStart;
    private setParams;
    private characterUpdater;
    private itemGetter;
    private heightGetter;
    private observeHandler;
    private addListeners;
    private removeListeners;
    protected addEditLine(editLineParams: EditLineParamsType): void;
    private clickHandler;
    private lastLineFocus;
    private submitHandler;
    private changeHandler;
    private updateCaretPositionHandler;
    private clearHistoryState;
    private addKeyDownHandler;
    private removeKeyDownHandler;
    private lineKeydownHandler;
    private prevHistory;
    private nextHistory;
    private applyHistory;
    private addKeyboardShortcutsManagerListeners;
    private clearHandler;
    private actionHandler;
    private registerListener;
    private unregisterAllListeners;
    private unregisterListener;
    private setLines;
    private getTermInfo;
    private getTermInfoElements;
    private getTermInfoLabel;
    private getTermInfoCaret;
    private getTermInfoEdit;
    private getTermInfoLines;
    private updateTermInfo;
}
export default Term;
