import { ITemplateEngine } from '@term-js/term';
export default interface IList extends ITemplateEngine {
    items: string[];
    value: string;
    index: number;
}
