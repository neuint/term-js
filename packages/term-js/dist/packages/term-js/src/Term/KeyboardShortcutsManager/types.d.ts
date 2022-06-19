import { InfoType } from '../types';
export declare type KeyCodeType = number | number[];
export declare type NormalizedActionShortcutType = {
    codes: number[];
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
};
export declare type ActionShortcutType = KeyCodeType | {
    code: KeyCodeType;
    ctrl?: boolean;
    meta?: boolean;
    alt?: boolean;
    shift?: boolean;
};
export declare type ShortcutMapItemType = {
    actionShortcut: ActionShortcutType;
    info?: InfoType;
};
export declare type CallbackInfoType = {
    shortcut?: InfoType;
    listener?: InfoType;
};
