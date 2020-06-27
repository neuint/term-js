import { TemplateEngine } from '@term-js/term';
import IHiddenListItem from './IHiddenListItem';
declare class HiddenListItem extends TemplateEngine implements IHiddenListItem {
    private text;
    private index;
    constructor(container: HTMLElement, options: {
        text: string;
        index: number;
    });
    render(): void;
}
export default HiddenListItem;
