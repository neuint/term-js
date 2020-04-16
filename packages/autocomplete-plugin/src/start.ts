import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import Autocomplete from '@Autocomplete/index';
import IAutocomplete from '@Autocomplete/IAutocomplete';

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
  term.pluginManager.register(autocomplete);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { autocomplete: IAutocomplete }).autocomplete = autocomplete;
}
