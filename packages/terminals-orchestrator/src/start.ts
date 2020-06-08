import '@term-js/term/dist/index.css';

import TerminalsOrchestrator from '@TerminalsOrchestrator/index';
import ITerminalsOrchestrator from '@TerminalsOrchestrator/ITerminalsOrchestrator';
import sha256 from './sha-256';

import './index.scss';

const container = document.querySelector('#root') as HTMLElement;
if (container) {
  const terminalsOrchestrator: ITerminalsOrchestrator = new TerminalsOrchestrator(container, {
    tabs: [
      { name: 'Welcome', terminals: [] },
    ],
    localization: {},
  });
  (window as unknown as { terminalsOrchestrator: ITerminalsOrchestrator })
    .terminalsOrchestrator = terminalsOrchestrator;
  (window as any).sha256 = sha256;
}
