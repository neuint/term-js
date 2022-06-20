import { TemplateEngine } from '@neuint/term-js';
import './index.scss';
import IStatusView from './IStatusView';
declare class StatusView extends TemplateEngine implements IStatusView {
    private iconField;
    set icon(val: string);
    get icon(): string;
    private textField;
    set text(val: string);
    get text(): string;
    private isRendered;
    constructor(container: HTMLElement);
    render(): void;
}
export default StatusView;
