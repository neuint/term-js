import { TemplateEngine, ITemplateEngine } from '@term-js/term';
declare class ContextMenuView extends TemplateEngine implements ITemplateEngine {
    private reRender;
    constructor(container: HTMLElement);
    render(): void;
}
export default ContextMenuView;
