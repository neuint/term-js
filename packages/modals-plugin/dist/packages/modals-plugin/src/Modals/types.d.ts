import { ActionType } from './ModalView/types';
export declare type PositionType = 'terminal-center' | 'edit-center';
export declare type ModalOptionsType = {
    position?: PositionType;
    overlayHide?: boolean;
    closeButton?: boolean;
    escHide?: boolean;
    title?: string;
    className?: string;
    content: string | HTMLElement;
    actions?: ActionType[] | ActionType[][];
    onClose?: () => void;
};
