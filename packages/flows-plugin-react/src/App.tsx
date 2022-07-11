import React, { useState, useEffect } from 'react';
import TermComponent from '@neuint/term-js-react';
import { FormattedValueFragmentType } from '@neuint/term-js';

import FlowsComponent, { FlowsType } from './FlowsComponent';

import '@neuint/term-js-react/dist/index.css';

import './App.scss';

const getWrite = (
  text: string, lock = false, withSubmit = false,
): { data: string | FormattedValueFragmentType, duration: number, withSubmit: boolean } => {
  return {
    withSubmit,
    data: { str: text, lock },
    duration: Math.round((text.length / 68) * 250),
  };
};

const flows: FlowsType = {
  'sign in': [
    {
      write: getWrite('enter email: ', true),
      variableName: 'email',
      handler: (data) => {
        return Promise.resolve(data.email.includes('@')
          ? undefined
          : { ...getWrite('Incorrect email', false, true), to: '0' });
      },
    },
    {
      write: getWrite('enter password: ', true),
      variableName: 'password',
      secret: true,
      handler: (data) => {
        return Promise.resolve(data.email.includes('@')
          ? undefined
          : { ...getWrite('Incorrect password', false, true), to: '1' });
      },
    },
  ],
};

const App = () => {
  const [content, setContent] = useState<string>('Test 2');

  useEffect(() => {
    setTimeout(() => {
      setContent('Test 3');
    }, 1000);
  }, []);

  return (
    <TermComponent
      className="App__term"
      header="FlowsComponent"
      label="guest"
    >
      <FlowsComponent />
    </TermComponent>
  );
};
export default App;
