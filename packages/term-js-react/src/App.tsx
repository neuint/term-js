import React, { useState, useCallback } from 'react';

import TermComponent from './TermComponent';

import './App.scss';

const App = () => {
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
  return (
    <TermComponent
      write={write}
      className="App__term"
      label=""
      onSubmit={console.log}
      onWritten={onWritten}
    />
  );
};
export default App;
