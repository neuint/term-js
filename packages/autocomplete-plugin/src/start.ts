import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import Autocomplete from '@Autocomplete/index';

import './index.scss';

const container = document.querySelector('#root');
if (container) {
  const autocomplete = new Autocomplete();
  autocomplete.commands = [
    'login', 'sign up', 'logout',
  ];
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  term.setHeader('Test');
  term.pluginManager.register('autocomplete', autocomplete);
  (window as unknown as { term: ITerm }).term = term;
}
