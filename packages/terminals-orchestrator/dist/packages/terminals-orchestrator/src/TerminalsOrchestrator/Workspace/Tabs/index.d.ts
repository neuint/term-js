import { TemplateEngine } from '@term-js/term';
import ITabs from '@TerminalsOrchestrator/Workspace/Tabs/ITabs';
import { EventType, EventHandlerType, TabInfoType, OptionsType } from '@TerminalsOrchestrator/Workspace/Tabs/types';
declare class Tabs extends TemplateEngine implements ITabs {
    private tabsField;
    get tabs(): TabInfoType[];
    set tabs(val: TabInfoType[]);
    private activeTabField;
    get activeTab(): number;
    set activeTab(val: number);
    private visibleListWidth;
    private checkWidth;
    private hiddenList?;
    private options;
    private tabsInfo;
    private readonly ro;
    private handlers;
    private dragInfo?;
    constructor(container: HTMLElement, options?: OptionsType);
    render(): void;
    destroy(): void;
    addEventListener(event: EventType, handler: EventHandlerType): void;
    removeEventListener(event: EventType, handler: EventHandlerType): void;
    private addListeners;
    private removeListeners;
    private renderTabs;
    private observeHandler;
    private updateListView;
    private updateVisibleListWidth;
    private hideTabs;
    private updateTabsInfoSizes;
    private updateTabsInfo;
    private updateLeftMoreView;
    private updateRightMoreView;
    private showTabs;
    private hideLeftMore;
    private showLeftMore;
    private hideRightMore;
    private showRightMore;
    private addClickHandler;
    private tabDragHandler;
    private tabDragEndHandler;
    private updateDragInfo;
    private updateTabsPosition;
    private getDragOverIndex;
    private updateOrder;
    private updateTabsInfoOrder;
    private updateTabsOrder;
    private getTabOffset;
    private updateTabsViewOrder;
    private updateLeftDraggableTabPosition;
    private updateRightDraggableTabPosition;
    private updateLeftTabsViewOrder;
    private updateRightTabsViewOrder;
    private showLeftHiddenTabs;
    private showRightHiddenTabs;
    private closeHiddenTabsHandler;
    private selectHiddenTabHandler;
    private renameTabHandler;
}
export default Tabs;