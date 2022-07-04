import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import { noop } from 'lodash-es';

import IFlows from './IFlows';
import { FlowsType, FlowType } from './types';

export type { FlowsType, FlowType } from './types';
export type { default as IFlows } from './IFlows';

class Flows extends Plugin implements IFlows {
  public flows: FlowsType = {};

  private branch?: FlowType;

  private step = 0;

  public clear = noop;

  setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.termInfo.addEventListener('submit', this.onSubmit);
  }

  private onSubmit = (data: { value: string, typedValue?: string }) => {
    let { branch, flows } = this;
    const command = (data.typedValue || '').trim();
    if (branch) return;
    branch = flows[command];
    if (!branch) return;
    this.termInfo.write(branch);
    this.step = 0;
    this.branch = branch;
  };
}

export default Flows;
