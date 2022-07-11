import { FC, useRef, useEffect } from 'react';
import Flows, { FlowsType, IFlows } from '@neuint/flows-plugin';
import { ITerm } from '@neuint/term-js';

export type { FlowsType, IFlows } from '@neuint/flows-plugin';

type PropsType = {
  term?: ITerm;
  flows?: FlowsType;
};

const FlowsComponent: FC<PropsType> = ({ term, flows = {} }: PropsType) => {
  const plugin = useRef<IFlows | undefined>(term ? new Flows(term.pluginManager) : undefined);

  useEffect(() => {
    const { current } = plugin;
    if (term && current) term.pluginManager.register(current);
    return () => {
      if (term && current) term.pluginManager.unregister(current);
    };
  }, [term]);

  useEffect(() => {
    if (plugin.current) plugin.current.flows = flows;
  }, [flows]);

  return null;
};

export default FlowsComponent;
