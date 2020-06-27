import { TemplateEngine } from '@term-js/term';
import IHiddenList from '@TerminalsOrchestrator/Workspace/HiddenList/IHiddenList';
import { HiddenListOptionsType } from '@TerminalsOrchestrator/Workspace/HiddenList/types';
declare class HiddenList extends TemplateEngine implements IHiddenList {
    private readonly options;
    private items;
    private emitter;
    constructor(container: HTMLElement, options?: HiddenListOptionsType);
    render(): void;
    destroy(): void;
    private renderItems;
    private updatePosition;
    private addListeners;
    private removeListeners;
    private onListClick;
}
export default HiddenList;
