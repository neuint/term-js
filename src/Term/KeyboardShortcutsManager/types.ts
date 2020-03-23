export type KeyCodeType = number | number[];

export type NormalizedActionShortcutType = {
  codes: number[];
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

export type ActionShortcutType = KeyCodeType | {
  code: KeyCodeType;
  ctrl?: boolean;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
};
