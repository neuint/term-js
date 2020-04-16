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
