import { ActionShortcutType } from '@term-js/term';

export type ListInfoType = {
  items: string[];
  actionShortcut: ActionShortcutType;
  isRegistered: boolean;
  uuid: string;
  icon?: string;
};
