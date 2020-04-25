import { ActionType } from '@Modals/ModalView/types';

export type ModalOptionsType = {
  position?: 'terminal-center' | 'edit-center';
  overlayHide?: boolean;
  closeButton?: boolean;
  escHide?: boolean;
  title?: string;
  content: string | HTMLElement;
  actions?: ActionType[] | ActionType[][];
  onClose?: () => void;
};
