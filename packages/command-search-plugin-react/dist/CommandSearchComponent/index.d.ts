import { FC } from 'react';
import { ITerm } from '@neuint/term-js';
import '@neuint/command-search-plugin/dist/index.css';
declare type PropsType = {
    commands: string[];
    term?: ITerm;
};
declare const CommandSearchComponent: FC<PropsType>;
export default CommandSearchComponent;
