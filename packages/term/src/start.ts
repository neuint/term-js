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
    editLine: {
      secret: false,
      value: [
        { str: 'Enter email:', lock: true, className: css.test },
        { str: 'test', lock: false },
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
