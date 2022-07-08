import { FC, useRef, useEffect } from 'react';
import Flows, { FlowsType } from '@neuint/flows-plugin';
import { IPlugin, ITerm } from '@neuint/term-js';

export type { FlowsType } from '@neuint/flows-plugin';

type PropsType = {
  term?: ITerm;
  flows?: FlowsType;
};

const FlowsComponent: FC<PropsType> = ({ term, flows }: PropsType) => {
  const plugin = useRef<IPlugin>(new Flows(term.pluginManager));

  useEffect(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
    return () => {
      term.pluginManager.unregister(current);
    };
  }, [term.pluginManager]);

  useEffect(() => {
    plugin.current.flows = flows;
  }, [flows]);

  return null;
};

export default FlowsComponent;
