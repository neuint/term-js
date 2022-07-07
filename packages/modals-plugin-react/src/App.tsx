import React, { useState, useEffect } from 'react';
import TermComponent from '@neuint/term-js-react';

import ModalsComponent, { ModalComponent } from './ModalsComponent';

import './App.scss';

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
      header="ModalsComponent"
      label="guest"
    >
      <ModalsComponent>
        <ModalComponent escHide overlayHide>
          <div>Test</div>
        </ModalComponent>
        <ModalComponent
          escHide
          overlayHide
          title="Test 2"
          actions={[
            { text: 'Submit', type: 'submit' },
            { text: 'Cancel' },
          ]}
        >
          <div>{content}</div>
        </ModalComponent>
      </ModalsComponent>
    </TermComponent>
  );
};
export default App;
