import React from 'react';
import { IModals } from '@neuint/modals-plugin';
export declare type ActionType = {
    text: string;
    onClick?: (e: Event) => void;
    type?: 'submit' | 'general';
};
declare type ParamsType = {
    overlayHide?: boolean;
    closeButton?: boolean;
    escHide?: boolean;
    title?: string;
    className?: string;
    actions?: ActionType[] | ActionType[][];
    onClose?: () => void;
};
declare type PropsType = {
    children?: React.ReactNode;
    plugin?: IModals;
} & ParamsType;
declare const ModalComponent: (props: PropsType) => any;
export default ModalComponent;
