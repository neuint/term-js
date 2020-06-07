import { TermConstructorParamsType } from '@term-js/term';

export type TermParamsType = TermConstructorParamsType & { rename?: boolean; focused?: boolean };
export type TabType = {
  terminals: TermParamsType[];
  creating?: boolean;
  name?: string;
  rename?: boolean;
  focused?: boolean;
};

export type OptionsType = {
  localization?: { [key: string]: string };
  tabs: TabType[];
};
