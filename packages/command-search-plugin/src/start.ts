import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import CommandSearch from '@CommandSearch/index';
import ICommandSearch from '@CommandSearch/ICommandSearch';

import './index.scss';

const container = document.querySelector('#root');
if (container) {
  const plugin: ICommandSearch = new CommandSearch();
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  term.setHeader('command-search-plugin');
  term.pluginManager.register(plugin);
  plugin.commands = ['sign in', 'sign up', 'sign out'];
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { plugin: ICommandSearch }).plugin = plugin;
}
