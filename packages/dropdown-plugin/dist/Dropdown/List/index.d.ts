import { TemplateEngine } from '@neuint/term-js';
import './index.scss';
import IList from './IList';
declare class List extends TemplateEngine implements IList {
    private reRender;
    private listItems;
    private itemsField;
    get items(): string[];
    set items(val: string[]);
    private valueField;
    get value(): string;
    set value(val: string);
    private indexField;
    get index(): number;
    set index(val: number);
    private onSelect?;
    constructor(container: HTMLElement, onSelect?: (text: string, index: number) => void);
    render(): void;
    private onItemHover;
    private onItemClick;
    private renderItems;
    private destroyItems;
}
export default List;
