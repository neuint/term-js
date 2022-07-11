/* eslint-disable no-param-reassign */
import React, { FC, useEffect, useRef, Children, useState } from 'react';
import Term, { ITerm, ValueType, FormattedValueFragmentType } from '@neuint/term-js';
import { isArray, noop } from 'lodash-es';

import '@neuint/term-js/dist/index.css';

type HandlersType = {
  onSubmit?: (line: string, lines: string[]) => void;
  onChange?: (e: InputEvent) => void;
};

type NormalizedWriteItemType = {
  withSubmit?: boolean;
  duration?: number;
  value: FormattedValueFragmentType;
};

type ComplexWriteItemType = {
  withSubmit?: boolean;
  value: string | FormattedValueFragmentType;
};

export type WriteItemType = string | FormattedValueFragmentType | ComplexWriteItemType;

export type FullWriteType = {
  data: WriteItemType | WriteItemType[];
  duration?: number;
};

export type WriteType = WriteItemType | FullWriteType;

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

const normalizeWriteItem = (item: WriteItemType): NormalizedWriteItemType | undefined => {
  if (typeof item === 'string') return { value: { str: item } };
  if ((item as FormattedValueFragmentType)?.str !== undefined) {
    return { value: item as FormattedValueFragmentType };
  }
  if ((item as ComplexWriteItemType)?.value !== undefined) {
    const { value, withSubmit } = item as ComplexWriteItemType;
    return { withSubmit, value: typeof value === 'string' ? { str: value } : value };
  }
  return undefined;
};

const getWriteData = (write: WriteType): NormalizedWriteItemType[] => {
  if ((write as FullWriteType)?.data === undefined) {
    return [normalizeWriteItem(write as WriteItemType)];
  }
  const { duration, data } = write as FullWriteType;
  const normalizedData = isArray(data) ? data.map(normalizeWriteItem) : [normalizeWriteItem(data)];
  const fullLength = duration ? normalizedData.reduce((acc, item) => {
    return acc + item.value.str.length;
  }, 0) : 0;
  const characterDuration = duration && fullLength ? duration / fullLength : 0;
  return normalizedData.map((item) => ({
    ...item,
    duration: duration ? item.value.str.length * characterDuration : undefined,
  }));
};

const writeData = (term: ITerm, data: WriteType): Promise<undefined> => {
  const normalizedData = getWriteData(data);
  return new Promise<undefined>((resolve) => {
    const next = () => {
      const item = normalizedData.shift();
      if (!item) {
        resolve(undefined);
        return;
      }
      const writeResponse = term.write(item.value, {
        duration: item.duration, withSubmit: item.withSubmit,
      });
      if (writeResponse instanceof Promise) {
        writeResponse.then(next);
      } else {
        next();
      }
    };
    next();
  });
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
