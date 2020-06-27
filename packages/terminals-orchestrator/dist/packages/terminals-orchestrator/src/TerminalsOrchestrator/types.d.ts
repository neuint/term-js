import { TermConstructorParamsType } from '@term-js/term';
export declare type TermParamsType = TermConstructorParamsType & {
    rename?: boolean;
    focused?: boolean;
};
export declare type TabType = {
    terminals: TermParamsType[];
    creating?: boolean;
    name?: string;
    rename?: boolean;
    focused?: boolean;
};
export declare type OptionsType = {
    localization?: {
        [key: string]: string;
    };
    tabs: TabType[];
};
