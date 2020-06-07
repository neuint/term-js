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
  private readonly contentList: IContent[] = [];
  private readonly emitter: Emitter = new Emitter(EMITTER_FORCE_LAYER_TYPE);
  private get activeContent(): IContent | null {
    return this.contentList[0] || null;
  }

  constructor(container: HTMLElement) {
    super(template, container);
    this.render();
    const tabsView = new Tabs(this.getRef('tabs') as HTMLElement);
    tabsView.addEventListener('focus', this.focusTabHandler);
    tabsView.addEventListener('close', this.closeTabHandler);
    tabsView.addEventListener('add', this.addTabHandler);
    this.emitter.addListener('keyDown', this.newContentWindowHandler, {
      code: E_KEY_CODE, ...(IS_MAC ? { metaKey: true } : { ctrlKey: true }),
    });
    this.emitter.addListener('keyDown', this.addTabHandler, {
      code: E_KEY_CODE, shiftKey: true, ...(IS_MAC ? { metaKey: true } : { ctrlKey: true }),
    });
    this.tabsView = tabsView;
    this.contentList.push(new Content(this.getRef('content') as HTMLElement, {
      className: css.contentItem,
    }));
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

  private newContentWindowHandler = (e: KeyboardEvent) => {
    const { activeContent } = this;
    e.preventDefault();
    if (activeContent) {
      activeContent.addContentWindow();
    }
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
