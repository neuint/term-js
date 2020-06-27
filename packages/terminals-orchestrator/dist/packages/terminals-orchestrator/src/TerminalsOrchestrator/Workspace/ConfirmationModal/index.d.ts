import { TemplateEngine } from '@term-js/term';
import IConfirmationModal from './IConfirmationModal';
import { OptionsType } from './types';
declare class ConfirmationModal extends TemplateEngine implements IConfirmationModal {
    private readonly options;
    private readonly emitter;
    constructor(container: HTMLElement, options: OptionsType);
    render(): void;
    destroy(): void;
    private addListeners;
    private removeListeners;
}
export default ConfirmationModal;
