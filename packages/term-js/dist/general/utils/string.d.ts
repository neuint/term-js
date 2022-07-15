import { ValueType } from '../types/value';
export declare const escapeString: (str: string) => string;
export declare const safeTemplate: (template: string, data: {
    [key: string]: string;
}) => string;
export declare const getNotLockedString: (data: ValueType) => string;
