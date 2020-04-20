import { IPlugin } from '@term-js/term';
export default interface IDropdown extends IPlugin {
    items: string[];
    highlight: string;
    show(items: string[], params?: {
        className?: string;
        append: string | HTMLElement;
    }): void;
    hide(): void;
}
