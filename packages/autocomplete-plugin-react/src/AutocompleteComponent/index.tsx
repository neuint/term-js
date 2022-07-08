import { FC, useRef, useEffect } from 'react';
import Autocomplete, { IAutocomplete } from '@neuint/autocomplete-plugin';
import { ITerm, ActionShortcutType } from '@neuint/term-js';

type ParamsType = {
  // eslint-disable-next-line react/no-unused-prop-types
  items: string[];
  // eslint-disable-next-line react/no-unused-prop-types
  actionShortcut: ActionShortcutType;
  // eslint-disable-next-line react/no-unused-prop-types
  icon?: string;
};

type PropsType = {
  data: ParamsType | ParamsType[];
  term?: ITerm;
} & ParamsType;

const AutocompleteComponent: FC<PropsType> = (props: PropsType) => {
  const { data, term } = props;
  const plugin = useRef<IAutocomplete>(new Autocomplete(term.pluginManager));
  const removeList = useRef<Array<() => void>>([]);

  useEffect(() => {
    const { current } = plugin;
    term.pluginManager.register(current);
    return () => {
      term.pluginManager.unregister(current);
    };
  }, [term.pluginManager]);

  useEffect(() => {
    const { current } = plugin;
    removeList.current.forEach((remove) => remove());
    const newRemoveList = [];
    (Array.isArray(data) ? data : [data]).forEach(({ items, actionShortcut, icon }) => {
      newRemoveList.push(current.addList(items, actionShortcut, icon));
    });
    removeList.current = newRemoveList;
  }, [data]);
  return null;
};

export default AutocompleteComponent;
