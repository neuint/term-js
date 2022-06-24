import Term, { ITerm } from '@neuint/term-js';

import Modals, { TERMINAL_CENTER_POSITION, EDIT_CENTER_POSITION } from './Modals';
import IModals from './Modals/IModals';

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
  const plugin: IModals = new Modals(term.pluginManager);
  term.setHeader('modals-plugin');
  term.pluginManager.register(plugin);
  plugin.show({
    escHide: true,
    overlayHide: true,
    content: 'Test',
    position: EDIT_CENTER_POSITION,
  });
  plugin.show({
    escHide: true,
    overlayHide: true,
    closeButton: true,
    content: 'Test 2',
    title: 'Test 2',
    position: TERMINAL_CENTER_POSITION,
    actions: [[
      { text: 'Submit', type: 'submit' },
      { text: 'Cancel' },
    ]],
  });
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { plugin: IModals }).plugin = plugin;
}
