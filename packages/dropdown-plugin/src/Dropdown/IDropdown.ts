import { IPlugin } from '@neuint/term-js';

export default interface IDropdown extends IPlugin {
  items: string[];
  highlight: string;
  isActionsLock: boolean;
  show(
    items: string[],
    params?: {
      className?: string;
      append?: string | HTMLElement;
      onSelect?: (text: string, index: number) => void;
      onClose?: () => void
    },
  ): void;
  hide(): void;
}
