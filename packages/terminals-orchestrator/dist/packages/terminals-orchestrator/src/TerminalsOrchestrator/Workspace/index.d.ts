import { TemplateEngine } from '@term-js/term';
import { IWorkspace } from '@TerminalsOrchestrator/Workspace/IWorkspace';
import { TabInfoType } from '@TerminalsOrchestrator/Workspace/Tabs/types';
import { OptionsType } from '@TerminalsOrchestrator/Workspace/types';
declare class Workspace extends TemplateEngine implements IWorkspace {
    set tabs(val: (string | TabInfoType)[]);
    get tabs(): (string | TabInfoType)[];
    set activeTab(val: number);
    get activeTab(): number;
    private cm?;
    private nextTabId;
    private options;
    private readonly tabsView;
    private readonly contentList;
    private readonly emitter;
    private get activeContent();
    private getTabContent;
    constructor(container: HTMLElement, options?: OptionsType);
    render(): void;
    destroy(): void;
    private addContentWindow;
    private newContentWindowHandler;
    private focusTabHandler;
    private closeTabHandler;
    private addTabHandler;
}
export default Workspace;
