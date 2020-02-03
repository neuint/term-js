import Term from './Term';
import ITerm from '@Term/ITerm';

import './index.scss';

if (module.hot) module.hot.accept();

const container = document.querySelector('#root');

if (container) {
  const term = new Term(container);
  term.setHeader('Test');
  (window as unknown as { term: ITerm }).term = term;
}
