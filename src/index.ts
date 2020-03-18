import Term from './Term';
import ITerm from '@Term/ITerm';
import { ValueType } from '@Term/types';

import css from './index.scss';

if (module.hot) module.hot.accept();

const container = document.querySelector('#root');

const clickHandler = (e: Event) => {
  console.log('e', e);
};

if (container) {
  const term = new Term(container, {
    label: 'guest',
    editLine: [
      { clickHandler, id: 'test', str: 'User name: ', lock: true, className: css.granted },
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
