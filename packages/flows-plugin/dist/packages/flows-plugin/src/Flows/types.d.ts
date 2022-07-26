import { WriteType } from '@general/types/write';
export declare type StepResultType = {
    to?: string;
    write?: WriteType;
};
export declare type StepType = {
    autostart?: boolean;
    before?: (data: {
        [key: string]: string;
    }) => undefined | WriteType;
    onEnter?: (data: {
        [key: string]: string;
    }) => undefined | WriteType;
    write?: WriteType | ((data: {
        [key: string]: string;
    }) => WriteType);
    onWrite?: (data: {
        [key: string]: string;
    }) => void | Promise<StepResultType | undefined>;
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
