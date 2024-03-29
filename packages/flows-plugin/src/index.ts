import { identity } from 'lodash-es';
import Term from '@neuint/term-js';

import { WriteType } from '@general/types/write';
import Flows, { FlowsType } from './Flows';

import '@neuint/term-js/dist/index.css';
import './index.scss';

const container = document.querySelector('#root');

const getWrite = (
  text: string, lock = false, withSubmit = false,
): WriteType => {
  return {
    withSubmit,
    data: { str: text, lock },
    duration: Math.round((text.length / 68) * 250),
  };
};

const flows: FlowsType = {
  'sign in': [
    {
      write: getWrite('enter email: ', true),
      variableName: 'email',
      onExit: (data) => {
        console.log('Test');
      },
      handler: (data) => {
        return Promise.resolve(data.email.includes('@')
          ? undefined
          : { write: getWrite('Incorrect email', false, true), to: '0' });
      },
    },
    {
      write: getWrite('enter password: ', true),
      variableName: 'password',
      secret: true,
      handler: (data) => {
        return Promise.resolve(data.email.includes('@')
          ? undefined
          : { write: getWrite('Incorrect password', false, true), to: '1' });
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
  plugin.flows = flows;
  term.pluginManager.register(plugin);
  term.setHeader('flows-plugin');
  (window as unknown as { term: Term }).term = term;
  (window as any).plugin = plugin;
}
