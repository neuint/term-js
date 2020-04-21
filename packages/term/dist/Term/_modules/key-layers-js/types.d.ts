import { Emitter } from './KeyLayers';
export declare type ListenerOptions = {
    code?: number;
    codes?: number[];
    altKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
    skipInput?: boolean;
};
export declare type ListenerType = {
    callback: (e: KeyboardEvent) => void;
    options: ListenerOptions;
};
export declare type ListenersTarget = ListenersTargetItem[];
export declare type ListenersTargetItem = {
    id: string;
    instance: Emitter;
    onPress: (e: KeyboardEvent) => void;
    onDown: (e: KeyboardEvent) => void;
    onUp: (e: KeyboardEvent) => void;
};
