import template from './template.html';
import css from './index.scss';

import { TemplateEngine } from '@term-js/term';
import { IWorkspace } from '@TerminalsOrchestrator/Workspace/IWorkspace';
import ITabs from '@TerminalsOrchestrator/Workspace/Tabs/ITabs';
import Tabs from '@TerminalsOrchestrator/Workspace/Tabs';

class Workspace extends TemplateEngine implements IWorkspace {
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
    this.tabsView = new Tabs(this.getRef('tabs') as HTMLElement);
  }

  public render() {
    super.render({ css });
  }

  public declare() {
    this.tabsView.destroy();
    super.destroy();
  }
}

export default Workspace;
