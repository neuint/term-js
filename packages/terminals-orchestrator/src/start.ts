import '@term-js/term/dist/index.css';

import TerminalsOrchestrator from '@TerminalsOrchestrator/index';
import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';

import './index.scss';

const container = document.querySelector('#root') as HTMLElement;
if (container) {
  const terminalsOrchestrator: ITerminalsOrchestrator = new TerminalsOrchestrator(container, {
    tabs: [
      { name: 'Welcome Welcome Welcome Welcome Welcome Welcome', terminals: [] },
      { name: 'Test', terminals: [] },
      { name: 'Test', terminals: [] },
      { name: 'Test', terminals: [] },
    ],
  });
  (window as unknown as { terminalsOrchestrator: ITerminalsOrchestrator })
    .terminalsOrchestrator = terminalsOrchestrator;
}
