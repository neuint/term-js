import Term from './Term';
import ITerm from '@Term/ITerm';

import css from './index.scss';
import { ValueType } from '@Term/types';

const container = document.querySelector('#root');
if (container) {
  const term = new Term(container, {
    label: 'guest',
    editLine: {
      secret: true,
      value: [{ str: 'Password: ', lock: true, className: css.granted }],
    },
    lines: (new Array(100).fill(null)).map((
      _, index,
    ): ValueType => ([
      { str: 'User name: ', className: css.granted },
      `test ${index} `,
      (new Array(40).fill(null)).map((): string => 's').join(''),
    ])),
  });
  term.setHeader('Test');
  (window as unknown as { term: ITerm }).term = term;
}
