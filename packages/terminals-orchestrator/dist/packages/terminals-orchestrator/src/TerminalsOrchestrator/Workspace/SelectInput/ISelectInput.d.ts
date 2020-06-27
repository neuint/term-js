import { ITemplateEngine } from '@term-js/term';
export default interface ISelectInput extends ITemplateEngine {
    disabled: boolean;
    select: () => void;
    focus: () => void;
    blur: () => void;
    value: string;
}
