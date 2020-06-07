import ResizeObserver from 'resize-observer-polyfill';

import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import ITabs from '@TerminalsOrchestrator/Workspace/Tabs/ITabs';
import ITab from '@TerminalsOrchestrator/Workspace/Tab/ITab';
import Tab from '@TerminalsOrchestrator/Workspace/Tab';
import {
  EventType,
  EventHandlerType,
  TabEventType, TabEventHandlerType, DragEndEventHandlerType, TabInfoType,
} from '@TerminalsOrchestrator/Workspace/Tabs/types';
import {
  ADD_EVENT_TYPE,
  CLICK_EVENT_TYPE,
  CLOSE_EVENT_TYPE,
  DRAG_END_EVENT_TYPE,
  DRAG_EVENT_TYPE,
  FOCUS_EVENT_TYPE,
  TAB_EVENTS,
} from '@TerminalsOrchestrator/Workspace/Tabs/constants';
import HiddenList from '@TerminalsOrchestrator/Workspace/HiddenList';
import IHiddenList from '@TerminalsOrchestrator/Workspace/HiddenList/IHiddenList';
import { IS_MAC } from '@general/utils/browser';

class Tabs extends TemplateEngine implements ITabs {
  private tabsField: TabInfoType[] = [];
  public get tabs(): TabInfoType[] {
    return this.tabsField;
  }
  public set tabs(val: TabInfoType[]) {
    const { tabsInfo } = this;
    this.tabsField = val;
    tabsInfo.forEach(item => item.tab.destroy());
    this.tabsInfo = [];
    this.activeTabField = 0;
    this.renderTabs();
    this.updateListView();
  }

  private activeTabField: number = 0;
  public get activeTab(): number {
    return this.activeTabField;
  }
  public set activeTab(val: number) {
    const { tabsField, tabsInfo, activeTabField } = this;
    if (val >= 0 && val <= tabsField.length - 1) {
      if (tabsInfo[activeTabField]) tabsInfo[activeTabField].tab.active = false;
      const tabInfo = tabsInfo[val];
      this.activeTabField = val;
      if (tabInfo) tabInfo.tab.active = true;
      if (!tabInfo.isVisible) this.updateListView();
    }
  }

  private visibleListWidth: number = 0;
  private checkWidth: number = 0;
  private hiddenList?: IHiddenList;
  private tabsInfo: { isVisible: boolean; width: number; tab: ITab }[] = [];
  private readonly ro: ResizeObserver;
  private handlers: {
    focus: EventHandlerType[];
    close: EventHandlerType[];
    add: EventHandlerType[];
    dragend: EventHandlerType[];
  } = { focus: [], close: [], add: [], dragend: [] };
  private dragInfo?: {
    left: number;
    index: number;
    replaceIndex: number;
  };

  constructor(container: HTMLElement) {
    super(template, container);
    this.ro = new ResizeObserver(this.observeHandler);
    this.render();
  }

  public render() {
    super.render({ css });
    this.checkWidth = (this.getRef('checkContainer') as  HTMLElement).offsetWidth;
    this.addListeners();
    const addButton = this.getRef('add') as HTMLElement;
    addButton.setAttribute('title', IS_MAC ? '⌘ + shift + E' : 'ctrl + shift + E');
  }

  public destroy() {
    this.removeListeners();
    super.destroy();
  }

  public addEventListener(event: EventType, handler: EventHandlerType) {
    const { handlers, tabsInfo } = this;
    const list = handlers[event];
    if (!list) return;
    list.push(handler);
    if (TAB_EVENTS.includes(event)) {
      tabsInfo.forEach((tabInfo) => {
        const tabEvent = event === FOCUS_EVENT_TYPE ? CLICK_EVENT_TYPE : event;
        tabInfo.tab.addEventListener(tabEvent as TabEventType, handler as TabEventHandlerType);
      });
    }
  }

  public removeEventListener(event: EventType, handler: EventHandlerType) {
    const { handlers, tabsInfo } = this;
    const list = handlers[event];
    if (!list) return;
    const index = list.indexOf(handler);
    if (index < 0) return;
    list.splice(index, 1);
    if (TAB_EVENTS.includes(event)) {
      tabsInfo.forEach((tabInfo) => {
        const tabEvent = event === FOCUS_EVENT_TYPE ? CLICK_EVENT_TYPE : event;
        tabInfo.tab.removeEventListener(tabEvent as TabEventType, handler as TabEventHandlerType);
      });
    }
  }

  private addListeners() {
    (this.getRef('add') as HTMLElement).addEventListener('click', this.addClickHandler);
    (this.getRef('left-more') as HTMLElement).addEventListener('click', this.showLeftHiddenTabs);
    (this.getRef('right-more') as HTMLElement).addEventListener('click', this.showRightHiddenTabs);
    this.ro.observe(this.getRef('root') as HTMLElement);
    this.ro.observe(this.getRef('checkContainer') as HTMLElement);
  }

  private removeListeners() {
    this.ro.unobserve(this.getRef('root') as HTMLElement);
    this.ro.unobserve(this.getRef('checkContainer') as HTMLElement);
    (this.getRef('add') as HTMLElement).removeEventListener('click', this.addClickHandler);
    (this.getRef('left-more') as HTMLElement).removeEventListener('click', this.showLeftHiddenTabs);
    (this.getRef('right-more') as HTMLElement)
      .removeEventListener('click', this.showRightHiddenTabs);
  }

  private renderTabs() {
    const { activeTab, tabs, handlers: { close, focus } } = this;
    const list = this.getRef('list');
    if (list) {
      this.tabsInfo = tabs.map(({ title }, index: number) => {
        const tab = new Tab(list as HTMLElement, {
          title, index, active: index === activeTab, invisible: true,
        });
        if (close.length) {
          close.forEach(handler => tab.addEventListener(
            CLOSE_EVENT_TYPE, handler as TabEventHandlerType,
          ));
        }
        if (focus.length) {
          focus.forEach(handler => tab.addEventListener(
            CLICK_EVENT_TYPE, handler as TabEventHandlerType,
          ));
        }
        tab.addEventListener(DRAG_EVENT_TYPE, this.tabDragHandler);
        tab.addEventListener(DRAG_END_EVENT_TYPE, this.tabDragEndHandler);
        return { tab, isVisible: true, width: tab.width };
      });
    }
  }

  private observeHandler = (entries: ResizeObserverEntry[]) => {
    const checkContainer = this.getRef('checkContainer') as HTMLElement;
    const checkContainerEntry = entries.find(item => item.target === checkContainer);
    if (checkContainerEntry && checkContainerEntry?.contentRect.width !== this.checkWidth) {
      this.updateTabsInfoSizes();
    }
    this.closeHiddenTabsHandler();
    this.updateListView();
  }

  private updateListView = () => {
    this.updateVisibleListWidth();
    const { visibleListWidth, tabsInfo } = this;
    const width = tabsInfo.reduce((acc, item) => acc + item.width, 0);
    if (width > visibleListWidth) {
      this.hideTabs();
    } else {
      this.showTabs();
    }
  }

  private updateVisibleListWidth() {
    const root = this.getRef('root') as  HTMLElement;
    const leftMore = this.getRef('left-more') as  HTMLElement;
    const rightMore = this.getRef('right-more') as  HTMLElement;
    const add = this.getRef('add') as  HTMLElement;
    this.visibleListWidth = root.offsetWidth - leftMore.offsetWidth - rightMore.offsetWidth
      - add.offsetWidth;
  }

  private hideTabs() {
    this.updateTabsInfo();
    const { tabsInfo } = this;
    let shortcutIndex = 1;
    tabsInfo.forEach((item) => {
      if (item.isVisible) {
        item.tab.hidden = false;
        item.tab.invisible = false;
        item.tab.shortcutIndex = shortcutIndex < 10 ? shortcutIndex : 0;
        shortcutIndex += 1;
      } else {
        item.tab.shortcutIndex = 0;
        item.tab.hidden = true;
      }
    });
    this.updateLeftMoreView();
    this.updateRightMoreView();
  }

  private updateTabsInfoSizes() {
    this.tabsInfo.forEach((item) => {
      item.width = item.tab.width;
    });
  }

  private updateTabsInfo() {
    const { visibleListWidth, activeTabField, tabsInfo } = this;
    tabsInfo.forEach(item => item.isVisible = false);
    let usedWidth = 0;
    for (let i = activeTabField; i >= 0; i -= 1) {
      const tabInfo = tabsInfo[i];
      const updatedUsedWidth = usedWidth + tabInfo.width;
      if (activeTabField !== i && updatedUsedWidth > visibleListWidth) break;
      usedWidth = updatedUsedWidth;
      tabInfo.isVisible = true;
    }
    const afterActiveTabIndex = activeTabField + 1;
    const tabsInfoLength = tabsInfo.length;
    if (usedWidth < visibleListWidth && afterActiveTabIndex < tabsInfoLength) {
      for (let i = afterActiveTabIndex; i < tabsInfoLength; i += 1) {
        const tabInfo = tabsInfo[i];
        const updatedUsedWidth = usedWidth + tabInfo.width;
        if (updatedUsedWidth > visibleListWidth) break;
        usedWidth = updatedUsedWidth;
        tabInfo.isVisible = true;
      }
    }
  }

  private updateLeftMoreView() {
    const { tabsInfo } = this;
    let leftMoreCount = 0;
    for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
      const { isVisible } = tabsInfo[i];
      if (isVisible) break;
      else leftMoreCount += 1;
    }
    if (leftMoreCount) this.showLeftMore(leftMoreCount);
    else this.hideLeftMore();
  }

  private updateRightMoreView() {
    const { tabsInfo } = this;
    let rightMoreCount = 0;
    for (let i = tabsInfo.length - 1; i >= 0; i -= 1) {
      const { isVisible } = tabsInfo[i];
      if (isVisible) break;
      else rightMoreCount += 1;
    }

    if (rightMoreCount) this.showRightMore(rightMoreCount);
    else this.hideRightMore();
  }

  private showTabs() {
    const { tabsInfo } = this;
    this.hideLeftMore();
    this.hideRightMore();
    let shortcutIndex = 1;
    tabsInfo.forEach((item) => {
      item.isVisible = true;
      item.tab.hidden = false;
      item.tab.invisible = false;
      item.tab.shortcutIndex = shortcutIndex < 10 ? shortcutIndex : 0;
      shortcutIndex += 1;
    });
  }

  private hideLeftMore() {
    const leftMore = this.getRef('left-more') as HTMLElement;
    const leftAdditional = this.getRef('leftAdditional') as HTMLElement;
    leftMore.classList.add(css.hidden);
    leftAdditional.classList.add(css.hidden);
  }

  private showLeftMore(count: number = 1) {
    const leftMore = this.getRef('left-more') as HTMLElement;
    const leftAdditional = this.getRef('leftAdditional') as HTMLElement;
    leftMore.classList.remove(css.hidden);
    leftAdditional.classList.remove(css.hidden);
    if (count > 1) leftAdditional.classList.add(css.leftTwo);
    else leftAdditional.classList.remove(css.leftTwo);
  }

  private hideRightMore() {
    const rightMore = this.getRef('right-more') as HTMLElement;
    const rightAdditional = this.getRef('rightAdditional') as HTMLElement;
    rightMore.classList.add(css.hidden);
    rightAdditional.classList.add(css.hidden);
  }

  private showRightMore(count: number = 1) {
    const rightMore = this.getRef('right-more') as HTMLElement;
    const rightAdditional = this.getRef('rightAdditional') as HTMLElement;
    rightMore.classList.remove(css.hidden);
    rightAdditional.classList.remove(css.hidden);
    if (count > 1) rightAdditional.classList.add(css.rightTwo);
    else rightAdditional.classList.remove(css.rightTwo);
  }

  private addClickHandler = () => {
    this.handlers[ADD_EVENT_TYPE].forEach(handler => (handler as () => void)());
  }

  private tabDragHandler = (index: number, e: DragEvent) => {
    const { dragInfo, tabsInfo } = this;
    if (dragInfo) {
      this.updateDragInfo(e);
      this.updateTabsPosition();
    } else {
      tabsInfo.forEach(item => item.tab.disabledHover = true);
      const root = this.getRef('root') as HTMLElement;
      root.classList.add(css.draggable);
      const { left } = (this.getRef('list') as HTMLElement).getBoundingClientRect();
      const { clientX } = e;
      this.dragInfo = { index, left: clientX - left, replaceIndex: index };
    }
  }

  private tabDragEndHandler = () => {
    const { tabsInfo, handlers, tabs } = this;
    const root = this.getRef('root') as HTMLElement;
    tabsInfo.forEach(item => item.tab.disabledHover = false);
    root.classList.remove(css.draggable);
    this.updateOrder();
    delete this.dragInfo;
    handlers.dragend.forEach(callback => (callback as DragEndEventHandlerType)(tabs));
  }

  private updateDragInfo(e: DragEvent) {
    const { dragInfo } = this;
    if (!dragInfo) return;
    const { clientX } = e;
    const { width: maxLeft, left } = (this.getRef('list') as HTMLElement).getBoundingClientRect();
    const newLeft = clientX - left;
    if (newLeft < -2) return;
    dragInfo.left = Math.min(maxLeft, Math.max(0, newLeft));
  }

  private updateTabsPosition() {
    const { dragInfo } = this;
    if (!dragInfo) return;
    const { replaceIndex } = dragInfo;
    const dragOverIndex = this.getDragOverIndex();
    if (dragOverIndex < 0) return;
    if (dragOverIndex !== replaceIndex) {
      dragInfo.replaceIndex = dragOverIndex;
      this.updateTabsViewOrder();
    }
  }

  private getDragOverIndex(): number {
    const { tabsInfo, dragInfo } = this;
    if (!dragInfo) return -1;
    const { left } = dragInfo;
    let index = -1;
    let startOffset = 0;
    for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
      const { width, isVisible } = tabsInfo[i];
      if (!isVisible) continue;
      const endOffset = startOffset + width;
      if (left >= 0 && left < endOffset) {
        index = i;
        break;
      }
      startOffset = endOffset;
    }
    return index;
  }

  private updateOrder() {
    this.updateTabsInfoOrder();
    this.updateTabsOrder();
  }

  private updateTabsInfoOrder() {
    const { tabsInfo, dragInfo, activeTab, tabsField } = this;
    if (!dragInfo) return;
    const { index, replaceIndex } = dragInfo;
    const activeTabInfo = tabsInfo[activeTab];
    const spliced = tabsInfo.splice(index, 1);
    const splicedTab = tabsField.splice(index, 1);
    if (!spliced.length) return;
    tabsInfo.splice(replaceIndex, 0, spliced[0]);
    tabsField.splice(replaceIndex, 0, splicedTab[0]);
    this.activeTab = tabsInfo.indexOf(activeTabInfo) || 0;
    dragInfo.index = replaceIndex;
  }

  private updateTabsOrder() {
    const { tabsInfo } = this;
    const list = this.getRef('list');
    if (!list) return;
    let shortcutIndex = 1;
    tabsInfo.forEach(({ tab, isVisible }, index) => {
      const tabRoot = tab.getRef('root') as HTMLElement;
      list.removeChild(tabRoot);
      tab.left = 0;
      list.appendChild(tabRoot);
      tab.index = index;
      if (isVisible) {
        tab.shortcutIndex = shortcutIndex;
        shortcutIndex += 1;
      } else {
        tab.shortcutIndex = 0;
      }
    });
  }

  private getTabOffset(index: number): number {
    const { tabsInfo } = this;
    return tabsInfo.reduce((acc: number, tabInfo, i): number => {
      if (i >= index || !tabInfo.isVisible) return acc;
      return acc + tabInfo.width;
    }, 0);
  }

  private updateTabsViewOrder() {
    const { dragInfo } = this;
    if (!dragInfo) return;
    const { index, replaceIndex } = dragInfo;
    if (replaceIndex <= index) {
      this.updateLeftDraggableTabPosition();
      this.updateLeftTabsViewOrder();
    } else {
      this.updateRightDraggableTabPosition();
      this.updateRightTabsViewOrder();
    }
  }

  private updateLeftDraggableTabPosition() {
    const { dragInfo, tabsInfo } = this;
    const { index, replaceIndex } = dragInfo as { index: number; replaceIndex: number };
    const targetLeft = this.getTabOffset(index) - tabsInfo.reduce((
      acc: number, tabInfo, i,
    ): number => {
      return !tabInfo.isVisible || i >= replaceIndex ? acc : acc + tabInfo.width;
    }, 0);
    tabsInfo[index].tab.left = -1 * targetLeft;
  }

  private updateRightDraggableTabPosition() {
    const { dragInfo, tabsInfo } = this;
    const { index, replaceIndex } = dragInfo as { index: number; replaceIndex: number };
    tabsInfo[index].tab.left = tabsInfo.reduce((acc: number, tabInfo, i): number => {
      return !tabInfo.isVisible || i < index || i > replaceIndex ? acc : acc + tabInfo.width;
    }, 0) - tabsInfo[index].width;
  }

  private updateLeftTabsViewOrder() {
    const { dragInfo, tabsInfo } = this;
    const { index, replaceIndex } = dragInfo as { index: number; replaceIndex: number };
    const offsetWidth = tabsInfo[index].width;
    for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
      if (i === index) continue;
      tabsInfo[i].tab.left = i < replaceIndex || i > index ? 0 : offsetWidth;
    }
  }

  private updateRightTabsViewOrder() {
    const { dragInfo, tabsInfo } = this;
    const { index, replaceIndex } = dragInfo as { index: number; replaceIndex: number };
    const offsetWidth = tabsInfo[index].width;
    for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
      if (i === index) continue;
      if (i > index && i <= replaceIndex) tabsInfo[i].tab.left = -1 * offsetWidth;
      else tabsInfo[i].tab.left = 0;
    }
  }

  private showLeftHiddenTabs = () => {
    const { tabsInfo } = this;
    let stop = false;
    const leftList = tabsInfo.reduce((
      acc: { text: string; id: number }[], item, index,
    ): { text: string; id: number }[] => {
      if (!item.isVisible && !stop) acc.push({ text: item.tab.title, id: index });
      else stop = true;
      return acc;
    }, [] as { text: string; id: number }[]);
    if (leftList.length) {
      this.hiddenList = new HiddenList(this.container as HTMLElement, {
        items: leftList, className: css.leftList, onClose: this.closeHiddenTabsHandler,
        onSelect: this.selectHiddenTabHandler,
      });
    }
  }

  private showRightHiddenTabs = () => {
    const { tabsInfo } = this;
    let start = false;
    const rightList = tabsInfo.reduce((
      acc: { text: string; id: number }[], item, index,
    ): { text: string; id: number }[] => {
      if (item.isVisible && !start) start = true;
      else if (start && !item.isVisible) acc.push({ text: item.tab.title, id: index });
      return acc;
    }, [] as { text: string; id: number }[]);
    if (rightList.length) {
      this.hiddenList = new HiddenList(this.container as HTMLElement, {
        items: rightList, className: css.rightList, onClose: this.closeHiddenTabsHandler,
        onSelect: this.selectHiddenTabHandler,
      });
    }
  }

  private closeHiddenTabsHandler = () => {
    this.hiddenList?.destroy();
    delete this.hiddenList;
  }

  private selectHiddenTabHandler = (index: number) => {
    this.closeHiddenTabsHandler();
    this.activeTab = index;
  }
}

export default Tabs;
