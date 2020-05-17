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
  TabEventType,
} from '@TerminalsOrchestrator/Workspace/Tabs/types';
import {
  ADD_EVENT_TYPE,
  CLICK_EVENT_TYPE, CLOSE_EVENT_TYPE, DRAG_END_EVENT_TYPE, DRAG_EVENT_TYPE,
  FOCUS_EVENT_TYPE,
  TAB_EVENTS,
} from '@TerminalsOrchestrator/Workspace/Tabs/constants';

class Tabs extends TemplateEngine implements ITabs {
  private tabsField: string[] = [];
  public get tabs(): string[] {
    return this.tabsField;
  }
  public set tabs(val: string[]) {
    const { tabsInfo, activeTabField } = this;
    this.tabsField = val;
    tabsInfo.forEach(item => item.tab.destroy());
    this.tabsInfo = [];
    this.activeTabField = activeTabField >= val.length ? val.length - 1 : activeTabField;
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
  private tabsInfo: { isVisible: boolean; width: number; tab: ITab }[] = [];
  private readonly ro: ResizeObserver;
  private handlers: {
    focus: EventHandlerType[]; close: EventHandlerType[]; add: EventHandlerType[];
  } = { focus: [], close: [], add: [] };
  private dragInfo?: { left: number; index: number; targetIndex: number; dragTabOffset: number };
  private get lastVisibleIndex(): number {
    const { tabsInfo } = this;
    let isVisibleFound = false;
    const index = tabsInfo.findIndex((item) => {
      isVisibleFound = isVisibleFound || item.isVisible;
      return isVisibleFound && !item.isVisible;
    });
    return Math.max(-1, index - 1);
  }

  constructor(container: HTMLElement) {
    super(template, container);
    this.ro = new ResizeObserver(this.updateListView);
    this.render();
  }

  public render() {
    super.render({ css });
    (this.getRef('add') as HTMLElement).addEventListener('click', this.addClickHandler);
    this.ro.observe(this.getRef('root') as HTMLElement);
  }

  public destroy() {
    this.ro.unobserve(this.getRef('root') as HTMLElement);
    (this.getRef('add') as HTMLElement).removeEventListener('click', this.addClickHandler);
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
        tabInfo.tab.addEventListener(tabEvent as TabEventType, handler);
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
        tabInfo.tab.removeEventListener(tabEvent as TabEventType, handler);
      });
    }
  }

  private renderTabs() {
    const { activeTab, tabs, handlers: { close, focus } } = this;
    const list = this.getRef('list');
    if (list) {
      this.tabsInfo = tabs.map((title: string, index: number) => {
        const tab = new Tab(list as HTMLElement, {
          title, index, active: index === activeTab, invisible: true,
        });
        if (close.length) close.forEach(handler => tab.addEventListener(CLOSE_EVENT_TYPE, handler));
        if (focus.length) focus.forEach(handler => tab.addEventListener(CLICK_EVENT_TYPE, handler));
        tab.addEventListener(DRAG_EVENT_TYPE, this.tabDragHandler);
        tab.addEventListener(DRAG_END_EVENT_TYPE, this.tabDragEndHandler);
        return { tab, isVisible: true, width: tab.width };
      });
    }
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
    tabsInfo.forEach((item) => {
      if (item.isVisible) {
        item.tab.hidden = false;
        item.tab.invisible = false;
      } else {
        item.tab.hidden = true;
      }
    });
    this.updateLeftMoreView();
    this.updateRightMoreView();
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
    tabsInfo.forEach((item) => {
      item.isVisible = true;
      item.tab.hidden = false;
      item.tab.invisible = false;
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
      this.renderDropMarker();
    } else {
      this.dragInfo = {
        index,
        targetIndex: index,
        left: e.offsetX,
        dragTabOffset: tabsInfo.reduce((acc, item, i) => {
          if (!item.isVisible) return acc;
          return i < index ? acc + item.width : acc;
        }, 0),
      };
    }
  }

  private tabDragEndHandler = () => {
    this.updateOrder();
    delete this.dragInfo;
    this.hideDropMarker();
  }

  private updateDragInfo(e: DragEvent) {
    const { dragInfo, lastVisibleIndex } = this;
    if (!dragInfo) return;
    const { dragTabOffset } = dragInfo;
    const maxLeft = (this.getRef('list') as HTMLElement).offsetWidth;
    const left = dragTabOffset + e.offsetX - dragInfo.left;
    if (left < 0 || left > maxLeft) return;
    let index = left > 0 ? this.getPositionIndex(left) : this.getFirstVisibleIndex();
    if (index < 0) index = left > 0 ? lastVisibleIndex + 1 : 0;
    dragInfo.targetIndex = index;
  }

  private getPositionIndex(left: number): number {
    const { tabsInfo } = this;
    let index = 0;
    let offset = 0;
    for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
      const { width, isVisible } = tabsInfo[i];
      if (!isVisible) continue;
      const updatedOffset = offset + width;
      if (left >= offset && left <= updatedOffset) {
        index = i;
        index = left < updatedOffset - width / 2 ? index : index + 1;
        break;
      }
      offset = updatedOffset;
    }
    return index;
  }

  private getFirstVisibleIndex(): number {
    const { tabsInfo, lastVisibleIndex } = this;
    return tabsInfo.findIndex((item, i) => item.isVisible || i === lastVisibleIndex);
  }

  private renderDropMarker() {
    const { dragInfo, tabsInfo } = this;
    if (!dragInfo) return;
    const { targetIndex } = dragInfo;
    const dropMarker = this.getRef('dropMarker') as HTMLElement;
    const leftMoreWidth = (this.getRef('left-more') as HTMLElement).offsetWidth;
    dropMarker.classList.remove(css.hidden);
    const leftPosition = tabsInfo.reduce((acc, item, i) => {
      if (!item.isVisible || i >= targetIndex) return acc;
      return i <= targetIndex ? acc + item.width : acc;
    }, 0);
    dropMarker.style.left = `${leftPosition + leftMoreWidth}px`;
  }

  private hideDropMarker() {
    const dropMarker = this.getRef('dropMarker') as HTMLElement;
    dropMarker.classList.add(css.hidden);
  }

  private updateOrder() {
    if (!this.updateTabsInfoOrder()) return;
    this.updateTabsViewOrder();
  }

  private updateTabsInfoOrder(): boolean {
    const { activeTabField, tabsInfo, dragInfo } = this;
    if (!dragInfo) return false;
    const { index, targetIndex } = dragInfo;
    let invisibleLeftCount = 0;
    tabsInfo.some((item) => {
      if (item.isVisible) return true;
      invisibleLeftCount += 1;
      return false;
    });
    if (targetIndex === index) return false;
    const activeTabInstance = tabsInfo[activeTabField].tab;
    const dragTabInfo = tabsInfo[index];
    tabsInfo.splice(index, 1);
    tabsInfo.splice(targetIndex > index ? targetIndex - 1 : targetIndex, 0, dragTabInfo);
    this.activeTabField = tabsInfo.findIndex(item => item.tab === activeTabInstance);
    return true;
  }

  private updateTabsViewOrder() {
    const { tabsInfo } = this;
    const list = this.getRef('list') as HTMLElement;
    tabsInfo.forEach((item, index) => {
      const { tab } = item;
      tab.index = index;
      const root = item.tab.getRef('root') as HTMLElement;
      list.removeChild(root);
      list.appendChild(root);
    });
  }
}

export default Tabs;
