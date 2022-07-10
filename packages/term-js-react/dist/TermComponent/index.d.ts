import React, { FC } from 'react';
import { ValueType, FormattedValueFragmentType } from '@neuint/term-js';
import '@neuint/term-js/dist/index.css';
declare type HandlersType = {
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (e: InputEvent) => void;
};
declare type ComplexWriteItemType = {
    withSubmit?: boolean;
    value: string | FormattedValueFragmentType;
};
declare type WriteItemType = string | FormattedValueFragmentType | ComplexWriteItemType;
declare type FullWriteType = {
    data: WriteItemType | WriteItemType[];
    duration?: number;
};
export declare type WriteType = WriteItemType | FullWriteType;
declare type PropsType = {
    className?: string;
    header?: string;
    label?: string;
    delimiter?: string;
    secret?: boolean;
    initLines?: ValueType[];
    initValue?: ValueType;
    write?: WriteType;
    onWritten?: () => void;
    children?: React.ReactNode;
} & HandlersType;
declare const TermComponent: FC<PropsType>;
export default TermComponent;
