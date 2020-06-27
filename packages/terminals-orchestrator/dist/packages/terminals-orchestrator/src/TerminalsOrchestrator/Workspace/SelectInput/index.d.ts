import { TemplateEngine } from '@term-js/term';
import ISelectInput from '@TerminalsOrchestrator/Workspace/SelectInput/ISelectInput';
import { OptionsType } from '@TerminalsOrchestrator/Workspace/SelectInput/types';
declare class SelectInput extends TemplateEngine implements ISelectInput {
    private isDisabled;
    get disabled(): boolean;
    set disabled(val: boolean);
    get value(): string;
    set value(val: string);
    private options;
    constructor(container: HTMLElement, options?: OptionsType);
    render(): void;
    select(): void;
    focus(): void;
    blur(): void;
    destroy(): void;
    private addListeners;
    private removeListeners;
    private keyDownHandler;
}
export default SelectInput;
