import { FC } from 'react';
import { ITerm, ActionShortcutType } from '@neuint/term-js';
import '@neuint/autocomplete-plugin/dist/index.css';
declare type ParamsType = {
    items: string[];
    actionShortcut: ActionShortcutType;
    icon?: string;
};
declare type PropsType = {
    data: ParamsType | ParamsType[];
    term?: ITerm;
} & ParamsType;
declare const AutocompleteComponent: FC<PropsType>;
export default AutocompleteComponent;
