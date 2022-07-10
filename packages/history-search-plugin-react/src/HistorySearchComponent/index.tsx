import { FC, useRef, useEffect } from 'react';
import HistorySearch from '@neuint/history-search-plugin';
import { ITerm, IPlugin } from '@neuint/term-js';

import '@neuint/history-search-plugin/dist/index.css';

type PropsType = {
  term?: ITerm;
};

const HistorySearchComponent: FC<PropsType> = ({ term }: PropsType) => {
  const plugin = useRef<IPlugin>(new HistorySearch(term.pluginManager));

  useEffect(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
    return () => {
      term.pluginManager.unregister(current);
    };
  }, [term.pluginManager]);

  return null;
};

export default HistorySearchComponent;
