import ResizeObserver from 'resize-observer-polyfill';

import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import ITabs from '@TerminalsOrchestrator/Workspace/Tabs/ITabs';
import ITab from '@TerminalsOrchestrator/Workspace/Tab/ITab';
import Tab from '@TerminalsOrchestrator/Workspace/Tab';

class Tabs extends TemplateEngine implements ITabs {
  private tabsField: string[] = [];
  public get tabs(): string[] {
    return this.tabsField;
  }
  public set tabs(val: string[]) {
    const { tabsInfo } = this;
    this.tabsField = val;
    tabsInfo.forEach(item => item.tab.destroy());
    this.tabsInfo = [];
    this.renderTabs();
  }

  private activeTabField: number = 0;
  public get activeTab(): number {
    return this.activeTabField;
  }
  public set activeTab(val: number) {
    const { tabsField, tabsInfo, activeTabField } = this;
    if (val >= 0 && val <= tabsField.length - 1) {
      if (tabsInfo[activeTabField]) tabsInfo[activeTabField].tab.active = false;
      this.activeTabField = val;
      if (tabsInfo[val]) tabsInfo[val].tab.active = true;
      this.updateListView();
    }
  }

  private visibleListWidth: number = 0;
  private tabsInfo: { isVisible: boolean; width: number; tab: ITab }[] = [];
  private readonly ro: ResizeObserver;

  constructor(container: HTMLElement) {
    super(template, container);
    this.ro = new ResizeObserver(this.updateListView);
    this.render();
  }

  public render() {
    super.render({ css });
    this.ro.observe(this.getRef('root') as HTMLElement);
  }

  public destroy() {
    this.ro.unobserve(this.getRef('root') as HTMLElement);
    super.destroy();
  }

  private renderTabs() {
    const { activeTab, tabs } = this;
    const list = this.getRef('list');
    if (list) {
      this.tabsInfo = tabs.map((title: string, index: number) => {
        const tab = new Tab(list as HTMLElement, {
          title, index, active: index === activeTab, invisible: true,
        });
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
}

export default Tabs;