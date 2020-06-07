import template from './template.html';
import css from './index.scss';

import { Emitter, EMITTER_FORCE_LAYER_TYPE } from 'key-layers-js';
import { TemplateEngine } from '@term-js/term';
import { IWorkspace } from '@TerminalsOrchestrator/Workspace/IWorkspace';
import ITabs from '@TerminalsOrchestrator/Workspace/Tabs/ITabs';
import Tabs from '@TerminalsOrchestrator/Workspace/Tabs';
import IContent from '@TerminalsOrchestrator/Workspace/Content/IContent';
import Content from '@TerminalsOrchestrator/Workspace/Content';
import { E_KEY_CODE } from '@general/constants/keyCodes';
import { IS_MAC } from '@general/utils/browser';
import { TabInfoType } from '@TerminalsOrchestrator/Workspace/Tabs/types';

class Workspace extends TemplateEngine implements IWorkspace {
  public untitledName: string = '';
  public set tabs(val: (string | TabInfoType)[]) {
    const { tabsView } = this;
    tabsView.tabs = val.map((item: string | TabInfoType): TabInfoType => {
      if (typeof item === 'string') {
        const tabInfo = { title: item, id: this.nextTabId };
        this.nextTabId += 1;
        this.addContentWindow(tabInfo.id);
        return tabInfo;
      }
      return  item;
    });
    this.focusTabHandler(tabsView.activeTab);
  }

  public get tabs(): (string | TabInfoType)[] {
    return this.tabsView.tabs;
  }

  public set activeTab(val: number) {
    this.tabsView.activeTab = val;
  }

  public get activeTab(): number {
    return this.tabsView.activeTab;
  }

  private nextTabId: number = 1;
  private readonly tabsView: ITabs;
  private readonly contentList: IContent[] = [];
  private readonly emitter: Emitter = new Emitter(EMITTER_FORCE_LAYER_TYPE);
  private get activeContent(): IContent | null {
    const { activeTab } = this.tabsView;
    return this.getTabContent(activeTab);
  }
  private getTabContent(index: number): IContent | null {
    const tabInfo = this.tabsView.tabs[index];
    if (!tabInfo) return null;
    const { id } = tabInfo;
    return this.contentList.find(item => item.id === id) || null;
  }

  constructor(container: HTMLElement) {
    super(template, container);
    this.render();
    const tabsView = new Tabs(this.getRef('tabs') as HTMLElement);
    tabsView.addEventListener('focus', this.focusTabHandler);
    tabsView.addEventListener('close', this.closeTabHandler);
    tabsView.addEventListener('add', this.addTabHandler);
    this.emitter.addListener('keyDown', this.addTabHandler, { code: E_KEY_CODE, altKey: true });
    this.emitter.addListener('keyDown', this.newContentWindowHandler, {
      code: E_KEY_CODE, ...(IS_MAC ? { metaKey: true } : { ctrlKey: true }),
    });
    this.tabsView = tabsView;
  }

  public render() {
    super.render({ css });
  }

  public declare() {
    this.tabsView.destroy();
    super.destroy();
  }

  public destroy() {
    const { tabsView, contentList, emitter } = this;
    emitter.removeListener('keyDown', this.newContentWindowHandler);
    emitter.removeListener('keyDown', this.addTabHandler);
    emitter.destroy();
    contentList.forEach(item => item.destroy());
    tabsView.destroy();
    super.destroy();
  }

  private addContentWindow(id: number, hidden: boolean = true) {
    this.contentList.push(new Content(this.getRef('content') as HTMLElement, {
      id, hidden, className: css.contentItem,
    }));
  }

  private newContentWindowHandler = (e: KeyboardEvent) => {
    const { activeContent } = this;
    e.preventDefault();
    if (activeContent) {
      activeContent.addContentWindow();
    }
  }

  private focusTabHandler = (index: number) => {
    const content = this.getTabContent(index);
    if (content) {
      this.tabsView.activeTab = index;
      this.contentList.forEach((item) => {
        item.hidden = item !== content;
      });
    }
  }

  private closeTabHandler = (index: number) => {
    const { tabsView, contentList } = this;
    const content = this.getTabContent(index);
    const activeTab = tabsView.activeTab;
    let newActiveTab = index === activeTab ? Math.max(0, activeTab - 1) : activeTab;
    if (activeTab > index) newActiveTab = activeTab - 1;
    tabsView.tabs = this.tabsView.tabs.filter((_, i) => i !== index);
    if (content) {
      const contentIndex = contentList.indexOf(content);
      content.destroy();
      if (contentIndex >= 0) contentList.splice(contentIndex, 1);
    }
    this.focusTabHandler(newActiveTab);
  }

  private addTabHandler = () => {
    const { tabsView } = this;
    const tabInfo = { title: this.untitledName, id: this.nextTabId };
    tabsView.tabs = [...tabsView.tabs, tabInfo];
    this.nextTabId += 1;
    this.addContentWindow(tabInfo.id);
    this.focusTabHandler(tabsView.tabs.length - 1);
  }
}

export default Workspace;
