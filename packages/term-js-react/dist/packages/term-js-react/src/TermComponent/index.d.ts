import React, { FC } from 'react';
import { ValueType } from '@neuint/term-js';
import { WriteType } from '@general/types/write';
import '@neuint/term-js/dist/index.css';
declare type HandlersType = {
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (e: InputEvent) => void;
};
export type { WriteType, FullWriteType, WriteItemType } from '@general/types/write';
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
    disabled?: boolean;
} & HandlersType;
declare const TermComponent: FC<PropsType>;
export default TermComponent;
