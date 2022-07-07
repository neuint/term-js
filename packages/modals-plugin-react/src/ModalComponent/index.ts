import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { v1 } from 'uuid';
import { IModals } from '@neuint/modals-plugin';

export type ActionType = {
  text: string;
  onClick?: (e: Event) => void;
  type?: 'submit' | 'general';
};

type ParamsType = {
  overlayHide?: boolean;
  closeButton?: boolean;
  escHide?: boolean;
  title?: string;
  className?: string;
  actions?: ActionType[] | ActionType[][];
  onClose?: () => void;
};

type PropsType = {
  children?: React.ReactNode;
  plugin?: IModals;
} & ParamsType;

const ModalComponent = (props: PropsType) => {
  const {
    overlayHide, closeButton, escHide, title, className, actions, children, plugin, onClose,
  } = props;
  const params = useRef<ParamsType>({
    overlayHide, closeButton, escHide, title, className, actions, onClose,
  });
  const close = useRef<() => void>();
  const uuid = useRef<string>(`modal_${v1().replace(/-/g, '')}`);
  const element = useRef<HTMLDivElement>(document.createElement('div'));

  const closeHandler = useCallback(() => {
    if (params.current.onClose) params.current.onClose();
  }, []);

  useEffect(() => () => {
    if (close.current) close.current();
    closeHandler();
  }, [closeHandler]);

  useEffect(() => {
    params.current = { overlayHide, closeButton, escHide, title, className, actions, onClose };
  }, [overlayHide, closeButton, escHide, title, className, actions, onClose]);

  useEffect(() => {
    close.current = plugin.show({
      ...params.current,
      onClose: closeHandler,
      content: element.current,
      className: params.current.className
        ? `${uuid.current} ${params.current.className}`
        : uuid.current,
    });
  }, [plugin, closeHandler]);

  return children ? createPortal(children, element.current) : null;
};

export default ModalComponent;
