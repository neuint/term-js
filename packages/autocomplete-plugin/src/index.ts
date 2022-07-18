import Term, { ITerm } from '@neuint/term-js';

import { TAB_KEY_CODE } from '@general/constants/keyCodes';

import '@neuint/term-js/dist/index.css';
import './index.scss';
import icon from './icon.html';

import Autocomplete from './Autocomplete';
import IAutocomplete from './Autocomplete/IAutocomplete';

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
  term.setHeader('autocomplete-plugin');
  const autocomplete = new Autocomplete(term.pluginManager);
  const commands = ['login', 'sign up', 'logout'];
  const commands2 = ['test 1', 'test 2', 'test 3'];
  // autocomplete.addList(commands2, { code: TAB_KEY_CODE }, icon);
  autocomplete.addList(commands, { code: TAB_KEY_CODE }, icon);
  term.pluginManager.register(autocomplete);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { autocomplete: IAutocomplete }).autocomplete = autocomplete;
}
