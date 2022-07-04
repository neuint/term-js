import { ValueType } from '@neuint/term-js';

export type FlowType = Array<{
  onEnter?: () => void;
  write: { data: ValueType, duration?: number, withSubmit?: boolean };
  variableName: string;
  skipEmpty?: boolean;
  handler: (data: { [key: string]: string }) => Promise<{
    to?: string, write?: ValueType, duration?: number, withSubmit?: boolean,
  } | undefined>;
}>;

export type FlowsType = { [key: string]: FlowType };
