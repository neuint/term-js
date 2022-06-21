import Term, { ITerm } from '@neuint/term-js';

import HistorySearch from './HistorySearch';
import IHistorySearch from './HistorySearch/IHistorySearch';

import './index.scss';

const container = document.querySelector('#root');
if (container) {
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  const plugin: IHistorySearch = new HistorySearch(term.pluginManager);
  term.setHeader('history-search-plugin');
  term.pluginManager.register(plugin);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { plugin: IHistorySearch }).plugin = plugin;
}
