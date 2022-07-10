import { FC } from 'react';
import { ITerm } from '@neuint/term-js';
import '@neuint/history-search-plugin/dist/index.css';
declare type PropsType = {
    term?: ITerm;
};
declare const HistorySearchComponent: FC<PropsType>;
export default HistorySearchComponent;
