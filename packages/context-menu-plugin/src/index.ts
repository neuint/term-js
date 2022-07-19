import Term, { ITerm } from '@neuint/term-js';

import '@neuint/term-js/dist/index.css';
import './index.scss';

import ContextMenu from './ContextMenu';
import IContextMenu from './ContextMenu/IContextMenu';

const container = document.querySelector('#root');
if (container) {
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  const contextMenu = new ContextMenu(term.pluginManager);
  term.setHeader('context-menu-plugin');
  term.pluginManager.register(contextMenu);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { contextMenu: IContextMenu }).contextMenu = contextMenu;
  // contextMenu.show('<div style="padding: 20px">Test</div>');
}
