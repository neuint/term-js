import React, { FC } from 'react';
import { ITerm } from '@neuint/term-js';
export { default as ModalComponent } from '../ModalComponent';
declare type PropsType = {
    term: ITerm;
    children?: React.ReactNode;
};
declare const ModalsComponent: FC<PropsType>;
export default ModalsComponent;
