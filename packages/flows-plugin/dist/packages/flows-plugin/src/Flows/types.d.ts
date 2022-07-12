import { WriteType } from '@general/types/write';
export declare type StepResultType = {
    to?: string;
    write?: WriteType;
};
export declare type FlowType = Array<{
    autostart?: boolean;
    onEnter?: (data: {
        [key: string]: string;
    }) => void;
    write?: WriteType;
    variableName?: string;
    secret?: boolean;
    handler?: (data: {
        [key: string]: string;
    }) => Promise<StepResultType | undefined>;
}>;
export declare type FlowsType = {
    [key: string]: FlowType;
};
