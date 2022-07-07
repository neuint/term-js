import React, { FC } from 'react';
import { ITerm } from '@neuint/term-js';
declare type ParamsType = {
    className?: string;
    onSelect?: (text: string, index: number) => void;
    onClose?: () => void;
};
declare type PropsType = {
    term?: ITerm;
    children?: React.ReactNode;
    items: string[];
} & ParamsType;
declare const DropdownComponent: FC<PropsType>;
export default DropdownComponent;
