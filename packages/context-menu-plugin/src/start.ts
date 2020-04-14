import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import './index.scss';

import ContextMenu from '@ContextMenu/index';
import IContextMenu from '@ContextMenu/IContextMenu';

const container = document.querySelector('#root');
if (container) {
  const contextMenu = new ContextMenu();
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  term.setHeader('context-menu-plugin');
  term.pluginManager.register('context-menu', contextMenu);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { contextMenu: IContextMenu }).contextMenu = contextMenu;
}
