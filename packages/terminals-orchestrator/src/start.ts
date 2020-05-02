import '@term-js/term/dist/index.css';

import TerminalsOrchestrator from '@TerminalsOrchestrator/index';
import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';

import './index.scss';

const container = document.querySelector('#root') as HTMLElement;
if (container) {
  const terminalsOrchestrator: ITerminalsOrchestrator = new TerminalsOrchestrator(
    container, { tabs: [] },
  );
  (window as unknown as { terminalsOrchestrator: ITerminalsOrchestrator })
    .terminalsOrchestrator = terminalsOrchestrator;
}
