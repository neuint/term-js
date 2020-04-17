export declare type FormattedValueFragmentType = {
    str: string;
    clickHandler?: (e: Event, id?: string | number) => void;
    id?: string | number;
    lock?: boolean;
    className?: string;
};
export declare type ValueFragmentType = string | FormattedValueFragmentType;
export declare type FormattedValueType = ValueFragmentType[];
export declare type ValueType = string | FormattedValueType;
export declare type EditLineParamsType = ValueType | {
    value: ValueType;
    secret?: boolean;
};
export declare type SizeType = {
    width: number;
    height: number;
};
export declare type TermConstructorParamsType = {
    lines: ValueType[];
    editLine?: EditLineParamsType;
    header?: string;
    onSubmit?: (line: string, lines: string[]) => void;
    onChange?: (line: string) => void;
    caret?: string;
    label?: string;
    delimiter?: string;
    virtualizedTopOffset?: number;
    virtualizedBottomOffset?: number;
};
export declare type TermParamsType = {
    label: string;
    delimiter: string;
    header: string;
    caret: string;
    scrollbarSize: number;
    size: SizeType;
};
export declare type TermInfoElementsType = {
    root?: Element;
    edit?: Element;
    title?: Element;
};
export declare type TermInfoLabelType = {
    label?: string;
    delimiter?: string;
    set(params?: {
        label?: string;
        delimiter?: string;
    }): void;
};
export declare type TermInfoCaretType = {
    position: number;
    offset: {
        left: number;
        top: number;
    };
    size: {
        width: number;
        height: number;
    };
    setCaretPosition: (position: number) => void;
};
export declare type TermInfoEditType = {
    value: string;
    parameterizedValue: EditLineParamsType;
    update: (params: EditLineParamsType) => void;
    endOffset: {
        left: number;
        top: number;
    };
    focus: () => void;
    write: (data: string | FormattedValueFragmentType, duration?: number) => Promise<boolean> | boolean;
};
export declare type TermInfoLinesTypes = {
    list: string[];
    parameterizedList: ValueType[];
    update: (lines: ValueType[]) => void;
};
export declare type InfoType = {
    [key: string]: boolean | string | number;
} | boolean | string | number;
