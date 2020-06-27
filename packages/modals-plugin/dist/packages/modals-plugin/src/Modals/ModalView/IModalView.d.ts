import { ITemplateEngine } from '@term-js/term';
export default interface IModalView extends ITemplateEngine {
    getModalView(): HTMLElement | undefined;
}
