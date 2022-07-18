import { FC, useRef, useEffect } from 'react';
import CommandSearch, { ICommandSearch } from '@neuint/command-search-plugin';
import { ITerm } from '@neuint/term-js';

import '@neuint/command-search-plugin/dist/index.css';

type PropsType = {
  commands: string[];
  autoOpen?: boolean;
  term?: ITerm;
};

const CommandSearchComponent: FC<PropsType> = ({ term, commands, autoOpen }: PropsType) => {
  const plugin = useRef<ICommandSearch>(new CommandSearch(term.pluginManager));

  useEffect(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
    return () => {
      term.pluginManager.unregister(current);
    };
  }, [term.pluginManager]);

  useEffect(() => {
    plugin.current.commands = commands;
    plugin.current.autoOpen = autoOpen;
  }, [commands, autoOpen]);

  return null;
};

export default CommandSearchComponent;
