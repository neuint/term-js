import Term from '@Term/index';
import ITerm from '@Term/ITerm';

import css from './index.scss';
import { ValueType } from '@Term/types';

const container = document.querySelector('.content');
if (container) {
  const term = new Term(container, {
    header: 'Test',
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    // editLine: 'test',
    editLine: {
      secret: false,
      value: [
        { str: 'Email: ', lock: true, className: css.test },
        { str: 'pppp', lock: false },
        'ttt',
        // { str: 'test', lock: false, className: css.denied },
      ],
    },
    lines: (new Array(0).fill(null)).map((
      _, index,
    ): ValueType => ([
      { str: 'User name: ', className: css.granted },
      `test ${index} `,
      (new Array(40).fill(null)).map((): string => 's').join(''),
    ])),
  });
  (window as unknown as { term: ITerm }).term = term;
}
