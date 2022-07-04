import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import { noop } from 'lodash-es';

import IFlows from './IFlows';
import { FlowsType, FlowType, StepResultType } from './types';

export type { FlowsType, FlowType, StepResultType } from './types';
export type { default as IFlows } from './IFlows';

class Flows extends Plugin implements IFlows {
  public flows: FlowsType = {};

  private branch?: FlowType;

  private step = 0;

  private branchData: { [key: string]: string } = {};

  private isWaiting = false;

  public clear = noop;

  setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager) {
    super.setTermInfo(termInfo, keyboardShortcutsManager);
    this.termInfo.addEventListener('submit', this.onSubmit);
  }

  private onSubmit = (data: { value: string, typedValue?: string }) => {
    let { branch, flows, branchData, isWaiting } = this;
    if (isWaiting) return;
    let command = (data.typedValue || '');
    if (branch) {
      const { handler, variableName } = branch[this.step];
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
    const { to, duration, data, withSubmit } = result || {};
    if (to) {
      const [step, command] = to.split('|');
      this.step = parseInt(step, 10);
      this.branch = command ? this.flows[command] : this.branch;
    } else {
      this.step += 1;
    }
    const writeResponse = data ? this.termInfo.write(data, { duration, withSubmit }) : undefined;
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
    this.termInfo.write(write.data, write);
    if (onEnter) onEnter(this.branchData);
  };
}

export default Flows;
