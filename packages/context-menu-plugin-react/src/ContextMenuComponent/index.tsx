import React, { FC, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ContextMenu, { IContextMenu } from '@neuint/context-menu-plugin';
import type { ITerm } from '@neuint/term-js';

import '@neuint/context-menu-plugin/dist/index.css';

type ParamsType = {
  escHide?: boolean;
  aroundClickHide?: boolean;
  onHide?: () => void;
};

type PropsType = {
  term?: ITerm;
  children?: React.ReactNode;
} & ParamsType;

const ContextMenuComponent: FC<PropsType> = (props: PropsType) => {
  const { term, children, escHide, aroundClickHide, onHide } = props;
  const [element, setElement] = useState<HTMLDivElement | undefined>();
  const plugin = useRef<IContextMenu>(new ContextMenu(term.pluginManager));
  const params = useRef<ParamsType>({ escHide, aroundClickHide, onHide });

  useEffect(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
    return () => {
      term.pluginManager.unregister(current);
    };
  }, [term.pluginManager]);

  useEffect(() => {
    params.current = { escHide, aroundClickHide, onHide };
  }, [aroundClickHide, escHide, onHide]);

  useEffect(() => {
    if (children) {
      plugin.current.show('', params.current.target, params.current);
      setElement(document.querySelector('.ContextMenuView'));
    } else {
      setElement(undefined);
      plugin.current.hide();
    }
  }, [children, setElement]);

  return element && children ? createPortal(children, element) : null;
};

export default ContextMenuComponent;
