import { Plugin, ITermInfo, IKeyboardShortcutsManager } from '@neuint/term-js';
import IFlows from './IFlows';
import { FlowsType } from './types';
export type { FlowsType, FlowType, StepResultType } from './types';
export type { default as IFlows } from './IFlows';
declare class Flows extends Plugin implements IFlows {
    flows: FlowsType;
    private branch?;
    private step;
    private branchData;
    private isWaiting;
    clear: (...args: any[]) => void;
    setTermInfo(termInfo: ITermInfo, keyboardShortcutsManager: IKeyboardShortcutsManager): void;
    private onSubmit;
    private onStepResult;
    private showStep;
}
export default Flows;
