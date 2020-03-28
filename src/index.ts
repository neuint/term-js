import Term from './Term';
import ITerm from '@Term/ITerm';
import { ValueType } from '@Term/types';
import Plugin from '@Term/PluginManager/Plugin';
import ITermInfo from '@Term/ITermInfo';

import css from './index.scss';

if (module.hot) module.hot.accept();

const container = document.querySelector('#root');
class TestPlugin extends Plugin {
  public setTermInfo(termInfo: ITermInfo) {
    super.setTermInfo(termInfo);
    termInfo.addEventListener('submit', this.onSubmit);
  }

  onSubmit = (e: any) => {
    const { termInfo } = this;
    console.log('e', e);
    termInfo?.updateEditLine('Test ');
    termInfo?.setCaretPosition(-1);
    termInfo?.setLabel({ delimiter: '|' });
    console.log('termInfo', termInfo);
  }
}

if (container) {
  const term = new Term(container, {
    label: 'guest',
    editLine: {
      secret: true,
      value: [{ str: 'Password: ', lock: true, className: css.granted }],
    },
    lines: [],
    // lines: (new Array(1).fill(null)).map((
    //   _, index,
    // ): ValueType => ([
    //   { str: 'User name: ', className: css.granted },
    //   'test',
    // ])),
  });
  term.setHeader('Test');
  term.pluginManager.register('test', new TestPlugin());
  (window as unknown as { term: ITerm }).term = term;
}
