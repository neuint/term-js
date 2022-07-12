import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import { noop, get } from 'lodash-es';

import { writeData } from '@general/utils/write';
import IFlows from './IFlows';
import { FlowsType, FlowType, StepResultType } from './types';

export type { FlowsType, FlowType, StepResultType } from './types';
export type { default as IFlows } from './IFlows';

class Flows extends Plugin implements IFlows {
  private flowsField: FlowsType = {};

  public get flows(): FlowsType {
    return this.flowsField;
  }

  public set flows(flows: FlowsType) {
    this.flowsField = flows;
    this.runAutoStartBranch();
  }

  private branch?: FlowType;

  private step = 0;

  private branchData: { [key: string]: string } = {};

  private isWaiting = false;

  public clear = noop;

  setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.termInfo.addEventListener('submit', this.onSubmit);
    this.runAutoStartBranch();
  }

  private runAutoStartBranch() {
    const { flows, termInfo, branch } = this;
    if (!termInfo || branch) return;
    const autoStartBranch = Object.keys(flows).find((flowName) => get(flows[flowName], '0.autostart'));
    if (autoStartBranch) {
      this.step = 0;
      this.branch = flows[autoStartBranch];
      this.branchData = {};
      this.showStep();
    }
  }

  private onSubmit = (data: { value: string, typedValue?: string }) => {
    let { branch, flows, branchData, isWaiting } = this;
    if (isWaiting) return;
    let command = (data.typedValue || '');
    if (branch) {
      const { handler = () => Promise.resolve(), variableName } = branch[this.step];
      if (variableName) branchData[variableName] = command;
      const result = handler(branchData);
      if (result) this.isWaiting = true;
      (result || Promise.resolve(undefined)).then(this.onStepResult);
      return;
    }
    command = command.trim();
    branch = flows[command];
    if (!branch) return;
    this.step = 0;
    this.branch = branch;
    this.branchData = {};
    this.showStep();
  };

  private onStepResult = (result: StepResultType | undefined) => {
    const { to, write } = result || {};
    if (to) {
      const [step, command] = to.split('|');
      this.step = parseInt(step, 10);
      this.branch = command ? this.flows[command] : this.branch;
    } else {
      this.step += 1;
    }
    const writeResponse = write ? writeData(this.termInfo, write) : undefined;
    (writeResponse instanceof Promise ? writeResponse : Promise.resolve(true)).then(() => {
      this.showStep();
    });
  };

  private showStep = () => {
    const { branch, step } = this;
    this.isWaiting = false;
    if (branch.length - 1 < step) {
      this.branch = undefined;
      this.step = 0;
      this.branchData = {};
      return;
    }
    const { write, onEnter, secret = false } = branch[step];
    const writeResponse = write ? writeData(this.termInfo, write) : undefined;
    (writeResponse instanceof Promise ? writeResponse : Promise.resolve(true)).then(() => {
      this.termInfo.secret(secret);
    });
    if (onEnter) onEnter(this.branchData);
  };
}

export default Flows;
