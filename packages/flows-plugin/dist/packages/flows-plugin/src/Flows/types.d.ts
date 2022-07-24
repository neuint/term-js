import { WriteType } from '@general/types/write';
export declare type StepResultType = {
    to?: string;
    write?: WriteType;
};
export declare type StepType = {
    autostart?: boolean;
    onEnter?: (data: {
        [key: string]: string;
    }) => void;
    write?: WriteType | ((data: {
        [key: string]: string;
    }) => WriteType);
    onWrite?: (data: {
        [key: string]: string;
    }) => void;
    variableName?: string;
    secret?: boolean;
    handler?: (data: {
        [key: string]: string;
    }) => Promise<StepResultType | undefined>;
    onExit?: (data: {
        [key: string]: string;
    }) => void;
};
export declare type FlowType = StepType[];
export declare type FlowsType = {
    [key: string]: FlowType;
};
