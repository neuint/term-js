import { TemplateEngine } from '@term-js/term';
import '@term-js/term/dist/index.css';
import { OptionsType } from './types';
import IContentWindow from './IContentWindow';
declare class ContentWindow extends TemplateEngine implements IContentWindow {
    get title(): string;
    private isDisabled;
    get disabled(): boolean;
    set disabled(val: boolean);
    private zIndexField;
    get zIndex(): number;
    set zIndex(val: number);
    private lockSelectionField;
    get lockSelection(): boolean;
    set lockSelection(val: boolean);
    get position(): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    set position(val: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    });
    private get dragElements();
    private readonly options;
    private readonly termHeaderPlugin;
    private term;
    private moveType?;
    constructor(container: HTMLElement, options: OptionsType);
    render(): void;
    destroy(): void;
    private addListeners;
    private removeListeners;
    private onMouseDown;
    private onEndMove;
    private onMove;
    private onFocus;
    private onRename;
    private onClose;
}
export default ContentWindow;
