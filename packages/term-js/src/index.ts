import './index.scss';

import Term from './Term/index';
import ITerm from './Term/ITerm';

const container = document.querySelector('.content');
let email = '';
let pass = '';
const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
if (container) {
  const term = new Term(container, {
    header: 'Term',
    virtualizedTopOffset: 400,
    virtualizedBottomOffset: 400,
    label: 'guest',
    editLine: {
      secret: false,
      value: [
        { str: 'Enter email: ', lock: true, className: 'test' },
      ],
    },
    lines: [],
  });
  term.addEventListener('submit', (data) => {
    const { typedValue } = data;
    if (!email && false) {
      if (re.test(typedValue)) {
        email = typedValue;
        (term.write({ str: 'Enter password: ', lock: true, className: 'test' }) as Promise<boolean>).then(() => {
          term.secret = true;
        });
      } else {
        (term.write(
          { str: 'Invalid email', className: 'denied' }, { withSubmit: true },
        ) as Promise<boolean>).then(() => {
          return term.write({ str: 'Enter email: ', lock: true, className: 'test' }) as Promise<boolean>;
        });
      }
    } else {
      console.log(typedValue);
    }
  });
  (window as unknown as { term: ITerm }).term = term;
}
