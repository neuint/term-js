import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import { IWorkspace } from '@TerminalsOrchestrator/Workspace/IWorkspace';
import ITabs from '@TerminalsOrchestrator/Workspace/Tabs/ITabs';
import Tabs from '@TerminalsOrchestrator/Workspace/Tabs';

class Workspace extends TemplateEngine implements IWorkspace {
  public untitledName: string = '';
  public set tabs(val: string[]) {
    this.tabsView.tabs = val;
  }
  public get tabs(): string[] {
    return this.tabsView.tabs;
  }

  public set activeTab(val: number) {
    this.tabsView.activeTab = val;
  }

  public get activeTab(): number {
    return this.tabsView.activeTab;
  }

  private tabsView: ITabs;
  constructor(container: HTMLElement) {
    super(template, container);
    this.render();
    const tabsView = new Tabs(this.getRef('tabs') as HTMLElement);
    tabsView.addEventListener('focus', this.focusTabHandler);
    tabsView.addEventListener('close', this.closeTabHandler);
    tabsView.addEventListener('add', this.addTabHandler);
    this.tabsView = tabsView;
  }

  public render() {
    super.render({ css });
  }

  public declare() {
    this.tabsView.destroy();
    super.destroy();
  }

  private focusTabHandler = (index: number) => {
    this.tabsView.activeTab = index;
  }

  private closeTabHandler = (index: number) => {
    const { tabsView } = this;
    const activeTab = tabsView.activeTab;
    let newActiveTab = index === activeTab ? Math.max(0, activeTab - 1) : activeTab;
    if (activeTab > index) newActiveTab = activeTab - 1;
    tabsView.tabs = this.tabsView.tabs.filter((_, i) => i !== index);
    tabsView.activeTab = newActiveTab;
  }

  private addTabHandler = () => {
    const { tabsView } = this;
    tabsView.tabs = [...tabsView.tabs, this.untitledName];
    tabsView.activeTab = tabsView.tabs.length - 1;
  }
}

export default Workspace;
