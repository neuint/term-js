import React, { useState, useCallback, useEffect } from 'react';
import TermComponent from '@neuint/term-js-react';

import ContextMenuComponent from './ContextMenuComponent';

import './App.scss';

const App = () => {
  const [status, setStatus] = useState();
  const [write, setWrite] = useState({
    data: [
      { value: 'Hello world!', withSubmit: true },
      { value: 'What is your name? ', withSubmit: true },
    ],
    duration: 250,
  });
  const onWritten = useCallback(() => {
    setWrite('Aiwo');
  }, []);

  useEffect(() => {
    let set = false;
    setInterval(() => {
      setStatus(set ? undefined : 'Aiwo');
      set = !set;
    }, 1000);
  }, []);
  return (
    <TermComponent
      write={write}
      className="App__term"
      header="ContextMenuComponent"
      label="guest"
      onWritten={onWritten}
    >
      <ContextMenuComponent escHide aroundClickHide>
        {status}
      </ContextMenuComponent>
    </TermComponent>
  );
};
export default App;
