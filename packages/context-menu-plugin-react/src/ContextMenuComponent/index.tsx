import React, { FC, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ContextMenu, { IContextMenu, TargetType } from '@neuint/context-menu-plugin';
import type { ITerm } from '@neuint/term-js';

import '@neuint/context-menu-plugin/dist/index.css';

type ParamsType = {
  target?: TargetType;
  escHide?: boolean;
  aroundClickHide?: boolean;
  onHide?: () => void;
};

type PropsType = {
  term?: ITerm;
  children?: React.ReactNode;
} & ParamsType;

const ContextMenuComponent: FC<PropsType> = (props: PropsType) => {
  const { term, children, target = 'end of line', escHide, aroundClickHide, onHide } = props;
  const [element, setElement] = useState<HTMLDivElement | undefined>();
  const plugin = useRef<IContextMenu>(new ContextMenu(term.pluginManager));
  const params = useRef<ParamsType>({ target, escHide, aroundClickHide, onHide });

  useEffect(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
    return () => {
      term.pluginManager.unregister(current);
    };
  }, [term.pluginManager]);

  useEffect(() => {
    params.current = { target, escHide, aroundClickHide, onHide };
  }, [aroundClickHide, escHide, onHide, target]);

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
