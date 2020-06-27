import { TemplateEngine } from '@term-js/term';
import ITermHeader from './ITermHeader';
import { OptionsType } from './types';
declare class TermHeader extends TemplateEngine implements ITermHeader {
    get draggableElement(): HTMLElement;
    private readonly options;
    private selectInput;
    constructor(container: HTMLElement, options: OptionsType);
    render(): void;
    destroy(): void;
    private addListeners;
    private removeListeners;
    private submitTitleHandler;
    private onRename;
}
export default TermHeader;
