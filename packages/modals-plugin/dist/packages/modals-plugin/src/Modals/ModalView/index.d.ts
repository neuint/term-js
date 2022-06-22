import { TemplateEngine } from '@neuint/term-js';
import './index.scss';
import IModalView from './IModalView';
import { OptionsType } from './types';
declare class ModalView extends TemplateEngine implements IModalView {
    private static stopPropagation;
    private readonly options;
    private isRendered;
    private get normalizedActions();
    constructor(container: HTMLElement, options: OptionsType);
    render(): void;
    destroy(): void;
    getModalView(): HTMLElement | undefined;
    private renderActions;
    private addEventListeners;
    private addOverlayEventListeners;
    private addCloseButtonListener;
    private addActionsListeners;
    private onActionClick;
    private onOverlayClick;
    private removeEventListeners;
    private removeOverlayEventListeners;
    private removeCloseButtonListener;
    private removeActionsListeners;
}
export default ModalView;
