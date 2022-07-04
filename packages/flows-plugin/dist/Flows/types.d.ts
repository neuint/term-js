import { FormattedValueFragmentType } from '@neuint/term-js';
export declare type StepResultType = {
    to?: string;
    data?: string | FormattedValueFragmentType;
    duration?: number;
    withSubmit?: boolean;
};
export declare type FlowType = Array<{
    onEnter?: (data: {
        [key: string]: string;
    }) => void;
    write: {
        data: string | FormattedValueFragmentType;
        duration?: number;
        withSubmit?: boolean;
    };
    variableName: string;
    secret?: boolean;
    handler: (data: {
        [key: string]: string;
    }) => Promise<StepResultType | undefined>;
}>;
export declare type FlowsType = {
    [key: string]: FlowType;
};
