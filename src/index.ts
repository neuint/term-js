import Term from './Term';
import ITerm from '@Term/ITerm';
import { ValueType } from '@Term/types';

import './index.scss';

if (module.hot) module.hot.accept();

const container = document.querySelector('#root');

if (container) {
  const term = new Term(container, {
    lines: (new Array(1).fill(null)).map((
      _, index,
    ): ValueType => ([{ str: 'test' }])),
  });
  term.setHeader('Test');
  (window as unknown as { term: ITerm }).term = term;
}
