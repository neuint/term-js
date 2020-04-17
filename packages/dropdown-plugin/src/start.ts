import { Term, ITerm } from '@term-js/term';
import '@term-js/term/dist/index.css';

import Dropdown from '@Dropdown/index';
import IDropdown from '@Dropdown/IDropdown';

import css from './index.scss';

const append = `
<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>
</svg>
`;

const container = document.querySelector('#root');
if (container) {
  const plugin: IDropdown = new Dropdown();
  const term = new Term(container, {
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: '',
    lines: [],
  });
  term.setHeader('dropdown-plugin');
  term.pluginManager.register(plugin);
  (window as unknown as { term: ITerm }).term = term;
  (window as unknown as { plugin: IDropdown }).plugin = plugin;
  setTimeout(() => {
    plugin.show(['test 1', 'test 2'], {
      append,
      className: css.root,
    });
  }, 1000);
}
