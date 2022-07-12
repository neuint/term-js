import { WriteType, FormattedValueFragmentType } from '../types/write';
declare type TermType = {
    write(data: string | FormattedValueFragmentType, options?: {
        withSubmit?: boolean;
        duration?: number;
        skipHandler?: boolean;
    }): Promise<boolean> | boolean;
};
export declare const writeData: (term: TermType, data: WriteType) => Promise<undefined>;
export {};
