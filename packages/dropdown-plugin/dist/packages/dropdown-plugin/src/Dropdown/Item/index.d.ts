import { TemplateEngine } from '@neuint/term-js';
import IItem from './IItem';
import './index.scss';
declare class Item extends TemplateEngine implements IItem {
    readonly index: number;
    private isActive;
    get active(): boolean;
    set active(val: boolean);
    private readonly match;
    private readonly text;
    private readonly suggestion;
    private readonly onHover?;
    private readonly onClick?;
    private isRendered;
    constructor(container: HTMLElement, params: {
        value: string;
        text: string;
        index: number;
        onHover?: (text: string, item: IItem) => void;
        onClick?: (text: string, item: IItem) => void;
    });
    render(): void;
    destroy(): void;
    private clickHandler;
    private hoverHandler;
    private addListeners;
    private removeListeners;
}
export default Item;
