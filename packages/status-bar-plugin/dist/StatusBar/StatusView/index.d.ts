import { TemplateEngine } from '@term-js/term';
import IStatusView from '@StatusBar/StatusView/IStatusView';
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
