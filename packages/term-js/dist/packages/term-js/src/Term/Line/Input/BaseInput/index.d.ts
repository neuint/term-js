import './index.scss';
import TemplateEngine from '../../../TemplateEngine';
import IInput from '../IInput';
import { ValueFragmentType, ValueType } from '../../../types';
declare abstract class BaseInput extends TemplateEngine implements IInput {
    static getValueString(value: ValueType, params?: {
        secret?: boolean;
    }): string;
    protected static getFragmentTemplate(str: string, params: {
        className?: string;
        index: number;
        secret?: boolean;
    }): string;
    protected static getNormalizedTemplateString(str: string): string;
    protected static getValueFragmentTemplate(valueFragment: ValueFragmentType, index: number, params?: {
        secret?: boolean;
    }): string;
    protected static getValueTemplate(value: ValueType, params?: {
        secret?: boolean;
    }): string;
    protected static getUpdatedValueField(value: string, prevValue: ValueType): ValueType;
    protected static getLockString(value: ValueType): string;
    private static convertSecret;
    protected characterWidth: number;
    protected characterHeight: number;
    get characterSize(): {
        width: number;
        height: number;
    };
    get caretPosition(): number;
    get selectedRange(): {
        from: number;
        to: number;
    };
    get disabled(): boolean;
    protected valueField: ValueType;
    get value(): ValueType;
    set value(val: ValueType);
    get lockString(): string;
    protected isCaretHidden: boolean;
    get hiddenCaret(): boolean;
    set hiddenCaret(isCaretHidden: boolean);
    protected secretField: boolean;
    get secret(): boolean;
    set secret(secret: boolean);
    get isFocused(): boolean;
    private characterContainer?;
    protected constructor(template: string, container?: Element, cssData?: {
        [key: string]: string;
    });
    protected addHandlers(): void;
    protected removeHandlers(): void;
    protected mouseDownHandler: (e: Event) => void;
    protected clickHandler: (e: Event) => void;
    protected getValueItemString(index: number): string;
    protected abstract getRootElement(): Element | undefined;
    getSimpleValue(showSecret?: boolean): string;
    moveCaretToEnd(isForce?: boolean): void;
    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    focus(): void;
    blur(): void;
    destroy(): void;
    getCaretOffset(): {
        left: number;
        top: number;
    };
    getEndOffset(): {
        left: number;
        top: number;
    };
    private getRowCharactersCount;
    private getEventFormattedValueFragment;
    private getElementFormattedValueFragment;
    private setCharacterContainer;
}
export default BaseInput;
