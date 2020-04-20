import { ITemplateEngine } from '@term-js/term';
export default interface IItem extends ITemplateEngine {
    index: number;
    active: boolean;
}
