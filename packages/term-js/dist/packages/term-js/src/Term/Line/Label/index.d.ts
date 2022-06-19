import TemplateEngine from '../../TemplateEngine';
import ITemplateEngine from '../../TemplateEngine/ITemplateEngine';
declare class Label extends TemplateEngine implements ITemplateEngine {
    private label;
    private delimiter;
    private reRender;
    set params(params: {
        label?: string;
        delimiter?: string;
    });
    get params(): {
        label?: string;
        delimiter?: string;
    };
    constructor(container: Element, params?: {
        label?: string;
        delimiter?: string;
    });
    render(): void;
}
export default Label;
