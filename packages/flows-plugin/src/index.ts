import { identity } from 'lodash-es';
import Term from '@neuint/term-js';

import Flows, { FlowsType } from './Flows';

import './index.scss';

const container = document.querySelector('#root');

const flows: FlowsType = {
  signIn: [
    {
      write: { data: 'enter email: ', duration: 200 },
      variableName: 'email',
      skipEmpty: true,
      handler: (data) => {
        return Promise.resolve(data.email.includes('@') ? undefined : { write: 'Incorrect email' });
      },
    },
    {
      write: { data: 'enter password: ', duration: 200 },
      variableName: 'password',
      skipEmpty: true,
      handler: (data) => {
        return Promise.resolve(data.email.includes('@') ? undefined : { write: 'Incorrect email' });
      },
    },
  ],
};

if (container) {
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [].map(identity),
  });
  const plugin = new Flows(term.pluginManager);
  term.pluginManager.register(plugin);
  term.setHeader('flows-plugin');
  (window as unknown as { term: Term }).term = term;
}
