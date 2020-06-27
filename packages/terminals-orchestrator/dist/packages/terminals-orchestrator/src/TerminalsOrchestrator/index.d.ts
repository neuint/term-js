import './theme.scss';
import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';
import { OptionsType } from '@TerminalsOrchestrator/types';
declare class TerminalsOrchestrator implements ITerminalsOrchestrator {
    private workspace;
    constructor(container: HTMLElement, options: OptionsType);
    destroy(): void;
}
export default TerminalsOrchestrator;
