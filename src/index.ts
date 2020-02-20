import Term from './Term';
import ITerm from '@Term/ITerm';

import './index.scss';

if (module.hot) module.hot.accept();

const container = document.querySelector('#root');

if (container) {
  const term = new Term(container, {
    lines: (new Array(500).fill(null)).map((
      _, index,
    ): string => (new Array(20).fill(`Line ${index}`)).join(' ')),
  });
  term.setHeader('Test');
  (window as unknown as { term: ITerm }).term = term;
}
