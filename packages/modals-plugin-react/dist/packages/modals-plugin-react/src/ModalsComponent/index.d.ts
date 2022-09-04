import React, { FC } from 'react';
import { ITerm } from '@neuint/term-js';
import '@neuint/modals-plugin/dist/index.css';
export { default as ModalComponent } from '../ModalComponent';
declare type PropsType = {
    term?: ITerm;
    children?: React.ReactNode;
};
declare const ModalsComponent: FC<PropsType>;
export default ModalsComponent;
