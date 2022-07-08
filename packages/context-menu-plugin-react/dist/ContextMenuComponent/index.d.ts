import React, { FC } from 'react';
import { TargetType } from '@neuint/context-menu-plugin';
import type { ITerm } from '@neuint/term-js';
declare type ParamsType = {
    target?: TargetType;
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
