import './index.scss';
import { ValueType } from '../types';
import TemplateEngine from '../TemplateEngine';
import ILine from './ILine';
import IInput from './Input/IInput';
import { ParamsType } from './types';
import ILabel from './Label/ILabel';
declare class Line extends TemplateEngine implements ILine {
    static getHeight(params: {
        delimiter?: string;
        label?: string;
        value: ValueType;
        width: number;
        itemSize: {
            width: number;
            height: number;
        };
    }): number;
    private static cf;
    private static itemVerticalPadding;
    private static itemHorizontalPadding;
    label?: ILabel;
    get value(): ValueType;
    set value(val: ValueType);
    get disabled(): boolean;
    set disabled(value: boolean);
    get focused(): boolean;
    private isVisible;
    get visible(): boolean;
    set visible(value: boolean);
    get hidden(): boolean;
    private heightField;
    get height(): number;
    private get characterSize();
    private inputField?;
    get input(): IInput | undefined;
    private secretField;
    get secret(): boolean;
    set secret(secret: boolean);
    get caretOffset(): {
        left: number;
        top: number;
    };
    get endOffset(): {
        left: number;
        top: number;
    };
    private get labelWidth();
    private get contentPadding();
    private initialValue;
    private caret?;
    private className;
    private editable;
    private onSubmit;
    private onChange;
    private onUpdateCaretPosition;
    private lockTimeout?;
    private caretPosition?;
    constructor(container: Element, params?: ParamsType);
    stopEdit(): void;
    focus(): void;
    blur(): void;
    submit(): void;
    render(params: {
        label?: string;
        delimiter?: string;
    }): void;
    setCaret(name?: string): void;
    updateViewport(): void;
    destroy(): void;
    moveCaretToEnd(isForce?: boolean): void;
    clear(): void;
    private setParams;
    private addEventListeners;
    private removeEventListeners;
    private updateHeight;
    private setupEditing;
    private keyDownHandler;
    private submitHandler;
    private changeHandler;
    private updateInputSize;
    private updateRowsCount;
    private updateCaretData;
    private showCaret;
    private hideCaret;
    private removeCaret;
    private lockCaret;
    private getInputRootOffset;
}
export default Line;
