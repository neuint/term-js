import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import Autocomplete from '@Autocomplete/index';
import IAutocomplete from '@Autocomplete/IAutocomplete';
import { TAB_KEY_CODE, E_KEY_CODE } from './keyCodes';
import icon from './icon.html';

import './index.scss';

const container = document.querySelector('#root');
if (container) {
  const autocomplete = new Autocomplete();
  const commands = ['login', 'sign up', 'logout'];
  const commands2 = ['test 1', 'test 2', 'test 3'];
  autocomplete.addList(commands, { code: TAB_KEY_CODE });
  autocomplete.addList(commands2, { code: E_KEY_CODE, meta: true }, icon);
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  term.setHeader('autocomplete-plugin');
  term.pluginManager.register(autocomplete);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { autocomplete: IAutocomplete }).autocomplete = autocomplete;
}
