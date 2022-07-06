import { FC, useRef, useEffect } from 'react';
import StatusBar, { IStatusBar } from '@neuint/status-bar-plugin';
import type { ITerm } from '@neuint/term-js';

type PropsType = {
  text?: string;
  icon?: string;
  term?: ITerm;
};

const StatusBarComponent: FC<PropsType> = ({ text = '', icon = '', term }: PropsType) => {
  const plugin = useRef<IStatusBar>(new StatusBar(term.pluginManager));

  useEffect(() => {
    term.pluginManager.register(plugin.current);
  }, [term.pluginManager]);

  useEffect(() => {
    plugin.current.status = { text, icon };
  }, [text, icon]);

  return null;
};

export default StatusBarComponent;
