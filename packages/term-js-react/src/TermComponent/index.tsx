/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useRef, Children, useState } from 'react';
import { noop } from 'lodash-es';
import Term, { ITerm, ValueType } from '@neuint/term-js';
import { WriteType } from '@general/types/write';
import { writeData } from '@general/utils/write';

import '@neuint/term-js/dist/index.css';

type HandlersType = {
  onSubmit?: (line: string, lines: string[]) => void;
  onChange?: (e: InputEvent) => void;
};

export type { WriteType, FullWriteType, WriteItemType } from '@general/types/write';

type PropsType = {
  className?: string;
  header?: string;
  label?: string;
  delimiter?: string;
  secret?: boolean;
  initLines?: ValueType[];
  initValue?: ValueType;
  write?: WriteType;
  onWritten?: () => void;
  children?: React.ReactNode;
} & HandlersType;

const updateHandler = (
  term: ITerm,
  options: {
    event: 'submit' | 'change';
    prevHandler: () => void;
    handler: (...args: any[]) => void;
  },
) => {
  const { prevHandler, handler, event } = options;
  if (prevHandler && prevHandler !== handler) {
    term.removeEventListener(event, prevHandler);
  }
  if (handler) term.addEventListener(event, handler);
};

const changeSecretState = (term: ITerm, secret: boolean) => {
  if (term.secret === secret) return;
  // TODO: set value as secret
  term.value = '';
  term.secret = secret;
};

const TermComponent: FC<PropsType> = (props: PropsType) => {
  const {
    className, label, header = '', delimiter, onSubmit, onChange, initLines = [], secret = false,
    initValue, onWritten = noop, write, children,
  } = props;
  const root = useRef();
  const [isReady, setReady] = useState(false);
  const term = useRef<ITerm>();
  const prevProps = useRef<HandlersType>({ onSubmit, onChange });
  const nextWrite = useRef<WriteType | undefined>(undefined);

  useEffect(() => {
    const { current } = term;
    if (current) {
      current.header = header;
      current.setLabel({ label, delimiter });
      changeSecretState(current, secret);
      updateHandler(current, { event: 'submit', handler: onSubmit, prevHandler: prevProps.current.onSubmit });
      updateHandler(current, { event: 'change', handler: onChange, prevHandler: prevProps.current.onChange });
    } else {
      term.current = new Term(root.current, {
        label,
        header,
        lines: initLines,
        virtualizedTopOffset: 400,
        virtualizedBottomOffset: 400,
        editLine: { secret, value: initValue },
      });
      if (onSubmit) term.current.addEventListener('submit', onSubmit);
      if (onChange) term.current.addEventListener('change', onChange);
      setReady(true);
    }
  }, [initValue, secret, header, label, delimiter, onSubmit, onChange, initLines]);

  useEffect(() => () => {
    term.current?.destroy();
    term.current = undefined;
  }, []);

  useEffect(() => {
    if (nextWrite.current !== undefined || write === undefined) return;
    nextWrite.current = write;
    debugger;
    writeData(term.current, write).then(() => {
      nextWrite.current = undefined;
      onWritten();
    });
  }, [onWritten, write]);
  return (
    <div ref={root} className={className}>
      {children && term.current && isReady
        ? Children.map(children, (child) => React.cloneElement(child, { term: term.current }))
        : null}
    </div>
  );
};

export default TermComponent;
