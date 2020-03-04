import Term from './Term';
import ITerm from '@Term/ITerm';
import { ValueType } from '@Term/types';

import css from './index.scss';

if (module.hot) module.hot.accept();

const container = document.querySelector('#root');

const clickHandler = (...args: any[]) => console.log('args', args);

if (container) {
  const term = new Term(container, {
    label: 'guest',
    editLine: [
      { clickHandler, str: 'User ', lock: true, className: css.granted },
      { clickHandler, str: 'name:', lock: true, className: css.denied },
      // { clickHandler, str: ' ', lock: true },
    ],
    lines: (new Array(1).fill(null)).map((
      _, index,
    ): ValueType => ([
      { str: 'Access denied please login!', className: css.denied },
    ])),
  });
  term.setHeader('Test');
  (window as unknown as { term: ITerm }).term = term;
}
