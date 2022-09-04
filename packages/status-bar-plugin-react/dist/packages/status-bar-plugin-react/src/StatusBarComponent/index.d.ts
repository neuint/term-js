import { FC } from 'react';
import type { ITerm } from '@neuint/term-js';
import '@neuint/status-bar-plugin/dist/index.css';
declare type PropsType = {
    text?: string;
    icon?: string;
    term?: ITerm;
};
declare const StatusBarComponent: FC<PropsType>;
export default StatusBarComponent;
