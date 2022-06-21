import { TemplateEngine, ITemplateEngine } from '@neuint/term-js';
import './index.scss';
declare class ContextMenuView extends TemplateEngine implements ITemplateEngine {
    private reRender;
    constructor(container: HTMLElement);
    render(): void;
}
export default ContextMenuView;
