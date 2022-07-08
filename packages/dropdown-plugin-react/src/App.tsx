import React, { useState, useCallback, useEffect } from 'react';
import TermComponent from '@neuint/term-js-react';

import DropdownComponent from './DropdownComponent';

import './App.scss';

const App = () => {
  const [items, setItems] = useState([]);
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
    setItems(['test', 'test2', 'test3', 'test4']);
    setTimeout(() => {
      setItems([]);
    }, 2000);
  }, []);

  useEffect(() => {
    setStatus('Aiwo');
  }, []);
  return (
    <TermComponent
      write={write}
      className="App__term"
      header="DropdownComponent"
      label="guest"
      onWritten={onWritten}
    >
      <DropdownComponent items={items} onSelect={console.log} onClose={() => console.log('onClose')}>
        {status}
      </DropdownComponent>
    </TermComponent>
  );
};
export default App;
