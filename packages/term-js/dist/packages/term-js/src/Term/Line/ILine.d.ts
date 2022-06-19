import ITemplateEngine from '../TemplateEngine/ITemplateEngine';
import IVirtualizedItem from '../VirtualizedList/IVirtualizedItem';
import { ValueType } from '../types';
import IInput from './Input/IInput';
import ILabel from './Label/ILabel';
export default interface ILine extends ITemplateEngine, IVirtualizedItem<ITemplateEngine> {
    label?: ILabel;
    input?: IInput;
    value: ValueType;
    secret: boolean;
    disabled: boolean;
    visible: boolean;
    caretOffset: {
        left: number;
        top: number;
    };
    endOffset: {
        left: number;
        top: number;
    };
    stopEdit(): void;
    focus(): void;
    blur(): void;
    submit(): void;
    updateViewport(): void;
    setCaret(name: string): void;
    destroy(): void;
    moveCaretToEnd(isForce?: boolean): void;
    clear(): void;
}
