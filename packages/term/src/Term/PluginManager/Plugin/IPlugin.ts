import ITermInfo from '@Term/ITermInfo';
import IKeyboardShortcutsManager from '@Term/KeyboardShortcutsManager/IKeyboardShortcutsManager';

export default interface IPlugin {
  name: string;
  setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
  updateTermInfo(termInfo: ITermInfo): void;
  destroy(): void;
  equal(plugin: IPlugin): boolean;
  clear(): void;
}
