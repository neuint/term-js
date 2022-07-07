import React, { useState, useCallback, useEffect } from 'react';
import TermComponent from '@neuint/term-js-react';
import { TAB_KEY_CODE } from '@general/constants/keyCodes';

import AutocompleteComponent from './AutocompleteComponent';

import './App.scss';

const App = () => {
  const [items, setItems] = useState(['login', 'sign up', 'logout']);
  const [status, setStatus] = useState();
  const [write, setWrite] = useState({
    data: [
      { value: 'Hello world!', withSubmit: true },
      { value: 'What is your name? ', withSubmit: true },
    ],
    duration: 250,
  });
  const onWritten = useCallback(() => {
    setTimeout(() => {
      setItems(['test', 'test2', 'test3', 'test4']);
    }, 5000);
  }, []);

  useEffect(() => {
    setStatus('Aiwo');
  }, []);
  return (
    <TermComponent
      write={write}
      className="App__term"
      header="AutocompleteComponent"
      label="guest"
      onWritten={onWritten}
    >
      <AutocompleteComponent data={{ items, actionShortcut: { code: TAB_KEY_CODE } }} />
    </TermComponent>
  );
};
export default App;
