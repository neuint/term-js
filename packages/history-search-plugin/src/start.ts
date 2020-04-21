import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import HistorySearch from '@HistorySearch/index';
import IHistorySearch from '@HistorySearch/IHistorySearch';

import './index.scss';

const container = document.querySelector('#root');
if (container) {
  const plugin: IHistorySearch = new HistorySearch();
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  term.setHeader('history-search-plugin');
  term.pluginManager.register(plugin);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { plugin: IHistorySearch }).plugin = plugin;
}
