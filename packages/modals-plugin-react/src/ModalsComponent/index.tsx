import React, { FC, useRef, useEffect, Children, useMemo } from 'react';
import Modals, { IModals } from '@neuint/modals-plugin';
import { ITerm } from '@neuint/term-js';

import '@neuint/modals-plugin/dist/index.css';

export { default as ModalComponent } from '../ModalComponent';

type PropsType = {
  term: ITerm;
  children?: React.ReactNode;
};

const ModalsComponent: FC<PropsType> = ({ term, children }: PropsType) => {
  const plugin = useRef<IModals>(new Modals(term.pluginManager));
  useMemo(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
  }, [term.pluginManager]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      term.pluginManager.unregister(plugin.current);
    };
  }, [term.pluginManager]);

  return children
    ? Children.map(children, (child) => React.cloneElement(child, { plugin: plugin.current }))
    : null;
};

export default ModalsComponent;
