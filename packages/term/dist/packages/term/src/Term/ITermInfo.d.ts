import { TermInfoCaretType, TermInfoEditType, TermInfoElementsType, TermInfoLabelType, TermInfoLinesTypes } from '@Term/types';
import ITermEventMap from '@Term/ITermEventMap';
import IPluginManager from '@Term/PluginManager/IPluginManager';
export default interface ITermInfo {
    title: string;
    elements: TermInfoElementsType;
    label: TermInfoLabelType;
    caret: TermInfoCaretType;
    edit: TermInfoEditType;
    lines: TermInfoLinesTypes;
    history: string[];
    pluginManager: IPluginManager;
    addEventListener<K extends keyof ITermEventMap>(type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions): void;
    removeEventListener<K extends keyof ITermEventMap>(type: K, handler: (e: ITermEventMap[K]) => void, options?: EventListenerOptions): void;
}
