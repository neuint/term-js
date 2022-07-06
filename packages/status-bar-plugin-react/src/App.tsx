import React, { useState, useCallback } from 'react';
import TermComponent from '@neuint/term-js-react';

import StatusBarComponent from './StatusBarComponent';

import './App.scss';

const App = () => {
  const [status, setStatus] = useState('Status');
  const [write, setWrite] = useState({
    data: [
      { value: 'Hello world!', withSubmit: true },
      { value: 'What is your name? ', withSubmit: true },
    ],
    duration: 250,
  });
  const onWritten = useCallback(() => {
    setWrite('Aiwo');
    setStatus('Aiwo');
  }, []);
  return (
    <TermComponent
      write={write}
      className="App__term"
      header="StatusBarComponent"
      label="guest"
      onSubmit={console.log}
      onWritten={onWritten}
    >
      <StatusBarComponent
        text={status}
      />
    </TermComponent>
  );
};
export default App;
