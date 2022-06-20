import { ITemplateEngine } from '@neuint/term-js';
export default interface IStatusView extends ITemplateEngine {
    text: string;
    icon: string;
}
