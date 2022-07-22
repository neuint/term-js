import React, { FC } from 'react';
import type { ITerm } from '@neuint/term-js';
import '@neuint/context-menu-plugin/dist/index.css';
declare type ParamsType = {
    escHide?: boolean;
    aroundClickHide?: boolean;
    onHide?: () => void;
};
declare type PropsType = {
    term?: ITerm;
    children?: React.ReactNode;
} & ParamsType;
declare const ContextMenuComponent: FC<PropsType>;
export default ContextMenuComponent;
