import React, { useState, useCallback, useEffect } from 'react';
import TermComponent from '@neuint/term-js-react';

import HistorySearchComponent from './HistorySearchComponent';

import './App.scss';

const App = () => {
  return (
    <TermComponent
      className="App__term"
      header="HistorySearchComponent"
      label="guest"
    >
      <HistorySearchComponent />
    </TermComponent>
  );
};
export default App;
