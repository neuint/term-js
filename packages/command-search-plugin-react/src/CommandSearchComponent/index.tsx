import React, { FC, useRef, useEffect } from 'react';
import CommandSearch, { ICommandSearch } from '@neuint/command-search-plugin';
import { ITerm } from '@neuint/term-js';

type PropsType = {
  commands: string[];
  term?: ITerm;
};

const CommandSearchComponent: FC<PropsType> = ({ term, commands }: PropsType) => {
  const plugin = useRef<ICommandSearch>(new CommandSearch(term.pluginManager));

  useEffect(() => {
    term.pluginManager.register(plugin.current);
  }, [term.pluginManager]);

  useEffect(() => {
    plugin.current.commands = commands;
  }, [commands]);

  return null;
};

export default CommandSearchComponent;
