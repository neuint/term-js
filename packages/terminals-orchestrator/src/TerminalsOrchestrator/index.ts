import './theme.scss';

import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';
import { OptionsType } from '@TerminalsOrchestrator/types';
import { IWorkspace } from '@TerminalsOrchestrator/Workspace/IWorkspace';
import Workspace from '@TerminalsOrchestrator/Workspace';

class TerminalsOrchestrator implements ITerminalsOrchestrator {
  private workspace: IWorkspace;
  constructor(container: HTMLElement, options: OptionsType) {
    this.workspace = new Workspace(container);
    let activeIndex = 0;
    this.workspace.tabs = options.tabs.map(({ name, focused }, index: number): string => {
      if (focused) activeIndex = index;
      return name || '';
    });
    this.workspace.activeTab = activeIndex;
  }

  public destroy() {
    this.workspace.destroy();
  }
}

export default TerminalsOrchestrator;
