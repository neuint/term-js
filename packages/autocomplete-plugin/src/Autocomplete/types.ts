import { ActionShortcutType } from '@neuint/term-js';

export type ListInfoType = {
  items: string[];
  actionShortcut: ActionShortcutType;
  isRegistered: boolean;
  emptyOpen: boolean;
  uuid: string;
  icon?: string;
};
