import ITermEventMap from './_interfaces/ITermEventMap';
import IKeyboardShortcutsManager from './KeyboardShortcutsManager/IKeyboardShortcutsManager';
import IPluginManager from './PluginManager/IPluginManager';
import { FormattedValueFragmentType } from './types';
export default interface ITerm {
    keyboardShortcutsManager: IKeyboardShortcutsManager;
    pluginManager: IPluginManager;
    header: string;
    disabled: boolean;
    write(data: string | FormattedValueFragmentType, options?: {
        withSubmit?: boolean;
        duration?: number;
    }): Promise<boolean> | boolean;
    blur(): void;
    setCaret(caret: string): void;
    addEventListener<K extends keyof ITermEventMap>(type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions): void;
    removeEventListener<K extends keyof ITermEventMap>(type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions): void;
    destroy(): void;
    setLabel(params?: {
        label?: string;
        delimiter?: string;
    }): void;
}
