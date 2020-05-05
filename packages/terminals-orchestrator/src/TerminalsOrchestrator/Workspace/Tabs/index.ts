import ResizeObserver from 'resize-observer-polyfill';
import { get } from 'lodash-es';

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
    const { tabEntities } = this;
    this.tabsField = val;
    tabEntities.forEach(item => item.destroy());
    this.renderTabs();
  }

  private activeTabField: number = 0;
  public get activeTab(): number {
    return this.activeTabField;
  }
  public set activeTab(val: number) {
    const { tabsField, tabEntities, activeTabField } = this;
    if (val >= 0 && val <= tabsField.length - 1) {
      if (tabEntities[activeTabField]) tabEntities[activeTabField].active = false;
      this.activeTabField = val;
      tabEntities[val].active = true;
    }
  }

  private tabEntities: ITab[] = [];
  private readonly ro: ResizeObserver;

  constructor(container: HTMLElement) {
    super(template, container);
    this.ro = new ResizeObserver(this.observeHandler);
    this.render();
  }

  public render() {
    super.render({ css });
    this.ro.observe(this.getRef('list') as HTMLElement);
  }

  public destroy() {
    this.ro.unobserve(this.getRef('list') as HTMLElement);
    super.destroy();
  }

  private renderTabs() {
    const { activeTab, tabs } = this;
    const list = this.getRef('list');
    if (list) {
      this.tabEntities = tabs.map((title: string, index: number) => {
        return new Tab(list as HTMLElement, { title, index, active: index === activeTab });
      });
    }
  }

  private observeHandler = (entries: ResizeObserverEntry[]) => {
    const { width } = get(entries, '[0].contentRect');
    const list = this.getRef('list') as  HTMLElement;
    if (width < list.scrollWidth) {
      this.hideTabs();
    } else {
      this.showTabs();
    }
  }

  private hideTabs() {
    const leftMore = this.getRef('left-more') as HTMLElement;
    const rightMore = this.getRef('right-more') as HTMLElement;
    leftMore.classList.remove(css.hidden);
    rightMore.classList.remove(css.hidden);
  }

  private showTabs() {
    const leftMore = this.getRef('left-more') as HTMLElement;
    const rightMore = this.getRef('right-more') as HTMLElement;
    leftMore.classList.add(css.hidden);
    rightMore.classList.add(css.hidden);
  }
}

export default Tabs;
