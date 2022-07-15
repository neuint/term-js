import Term, { ITerm } from '@neuint/term-js';

import CommandSearch from './CommandSearch';
import ICommandSearch from './CommandSearch/ICommandSearch';

import '@neuint/term-js/dist/index.css';
import './index.scss';

const container = document.querySelector('#root');
if (container) {
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: {
      secret: false,
      value: [
        { str: 'Please authorise: ', lock: true },
      ],
    },
    lines: [],
  });
  const plugin: ICommandSearch = new CommandSearch(term.pluginManager);
  term.setHeader('command-search-plugin');
  term.pluginManager.register(plugin);
  plugin.commands = ['sign in', 'sign up', 'sign out'];
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { plugin: ICommandSearch }).plugin = plugin;
}
