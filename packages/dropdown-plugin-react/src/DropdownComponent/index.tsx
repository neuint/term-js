import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Dropdown, { IDropdown } from '@neuint/dropdown-plugin';
import { ITerm } from '@neuint/term-js';

type ParamsType = {
  className?: string;
  onSelect?: (text: string, index: number) => void;
  onClose?: () => void;
};

type PropsType = {
  term?: ITerm;
  children?: React.ReactNode;
  items: string[];
} & ParamsType;

const DropdownComponent: FC<PropsType> = (props: PropsType) => {
  const { term, children, className, items, onSelect, onClose } = props;
  const plugin = useRef<IDropdown>(new Dropdown(term.pluginManager));
  const [element, setElement] = useState<HTMLDivElement | undefined>();
  const params = useRef<ParamsType & { opened: boolean }>({
    className, onSelect, onClose, opened: false,
  });

  const closeHandler = useCallback(() => {
    if (!params.current.opened) return;
    params.current.opened = false;
    setElement(undefined);
    plugin.current.hide();
    if (params.current.onClose) params.current.onClose();
  }, []);

  useEffect(() => {
    term.pluginManager.register(plugin.current);
  }, [term.pluginManager]);

  useEffect(() => {
    params.current = { opened: params.current.opened, className, onSelect, onClose };
  }, [className, onSelect, onClose]);

  useEffect(() => {
    if (!items.length) {
      closeHandler();
      return;
    }
    if (params.current.opened) {
      plugin.current.show(items, {
        append: children ? '<div class="DropdownComponent__append"></div>' : undefined,
        className: params.current.className,
        onSelect: params.current.onSelect,
        onClose: closeHandler,
      });
      setElement(document.querySelector('.DropdownComponent__append'));
    } else {
      plugin.current.items = items;
    }
    params.current.opened = true;
  }, [items, children, setElement, closeHandler]);

  return element && children ? createPortal(children, element) : null;
};

export default DropdownComponent;
