import { ITemplateEngine } from '@neuint/term-js';
export default interface IList extends ITemplateEngine {
    items: string[];
    value: string;
    index: number;
}
