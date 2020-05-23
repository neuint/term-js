import '@term-js/term/dist/index.css';

import TerminalsOrchestrator from '@TerminalsOrchestrator/index';
import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';
import sha256 from './sha-256';

import './index.scss';

const container = document.querySelector('#root') as HTMLElement;
if (container) {
  const terminalsOrchestrator: ITerminalsOrchestrator = new TerminalsOrchestrator(container, {
    tabs: [
      { name: 'Welcome Welcome Welcome Welcome Welcome Welcome', terminals: [] },
      { name: 'Test 1', terminals: [] },
      { name: 'Test 2', terminals: [] },
      { name: 'Test 3', terminals: [] },
      { name: 'Test 4', terminals: [] },
      { name: 'Test 5', terminals: [] },
      { name: 'Test 6', terminals: [] },
      { name: 'Test 7', terminals: [] },
    ],
  });
  (window as unknown as { terminalsOrchestrator: ITerminalsOrchestrator })
    .terminalsOrchestrator = terminalsOrchestrator;
  (window as any).sha256 = sha256;
}
